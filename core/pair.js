import {config} from "../config.js";
import {request} from "./http.js";

const base=()=>config.pairWebUrl;
const sid=()=>encodeURIComponent(config.sessionId);
const endpoint=path=>base()+path+sid();

export async function sessionInfo(){return request(endpoint("/api/session/"));}
export async function getBotJid(){
  const d=await sessionInfo();
  return String(d?.userJid||d?.session?.userJid||d?.jid||"");
}
export async function getMessages(cursor=0){
  return request(endpoint("/api/bot/messages/")+"?after="+encodeURIComponent(cursor));
}
export async function sendMessage(to,text,mentions=[]){
  return request(endpoint("/api/bot/send/"),{method:"POST",body:JSON.stringify({to,text,mentions})});
}
export async function sendImage(to,url,caption=""){
  return request(endpoint("/api/bot/send-image/"),{method:"POST",body:JSON.stringify({to,url,caption})});
}
export async function sendVideo(to,url,caption=""){
  return request(endpoint("/api/bot/send-video/"),{method:"POST",body:JSON.stringify({to,url,caption})});
}
export async function sendAudio(to,url,caption=""){
  return request(endpoint("/api/bot/send-audio/"),{method:"POST",body:JSON.stringify({to,url,caption})});
}
