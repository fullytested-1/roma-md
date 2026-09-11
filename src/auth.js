import mongoose from "mongoose";
import crypto from "node:crypto";
import {initAuthCreds,makeCacheableSignalKeyStore} from "@whiskeysockets/baileys";
import P from "pino";
import {config} from "./config.js";
const Auth=mongoose.model("RomaAuth",new mongoose.Schema({sessionId:String,category:String,key:String,value:String,updatedAt:Date},{collection:"roma_auth"}));
const KEY=Buffer.from(config.encryptionKey,"hex");
function dec(v){const r=Buffer.from(v,"base64url"),d=crypto.createDecipheriv("aes-256-gcm",KEY,r.subarray(0,12));d.setAuthTag(r.subarray(12,28));return Buffer.concat([d.update(r.subarray(28)),d.final()]).toString()}
function revive(v){return JSON.parse(v,(_,x)=>x&&x.type==="Buffer"&&Array.isArray(x.data)?Buffer.from(x.data):x)}
async function load(category,key){const x=await Auth.findOne({sessionId:config.sessionId,category,key}).lean();return x?revive(dec(x.value)):null}
export async function createAuthState(){
 const creds=await load("creds","creds")||initAuthCreds();
 const keys={get:async(type,ids)=>{const o={};for(const id of ids)o[id]=await load("key",type+":"+id);return o},set:async()=>{throw new Error("Read-only bot auth")}};
 return {state:{creds,keys:makeCacheableSignalKeyStore(keys,P({level:"silent"}))}};
}