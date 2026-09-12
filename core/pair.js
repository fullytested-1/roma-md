import {config} from "../config.js";
import {request} from "./http.js";

const base=()=>config.pairWebUrl;
const sid=()=>encodeURIComponent(config.sessionId);

export async function sessionInfo(){return request(base()+"/api/session/"+sid())}
export async function getBotJid(){
  const d=await sessionInfo();
  return String(d?.userJid||d?.session?.userJid||"");
}
export async function getMessages(cursor=0){
  return request(base()+"/api/bot/messages/"+sid()+"?after="+encodeURIComponent(cursor));
}
export async function sendMessage(to,text,mentions=[]){
  return request(base()+"/api/bot/send/"+sid(),{
    method:"POST",body:JSON.stringify({to,text,mentions})
  });
}
export async function sendImage(to,url,caption=""){
  return request(base()+"/api/bot/send-image/"+sid(),{
    method:"POST",body:JSON.stringify({to,url,caption})
  });
}
export async function sendVideo(to,url,caption=""){
  return request(base()+"/api/bot/send-video/"+sid(),{
    method:"POST",body:JSON.stringify({to,url,caption})
  });
}
