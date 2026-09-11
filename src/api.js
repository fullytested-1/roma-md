const J="https://jerrycoder.oggyapi.workers.dev",N="https://api.nexray.eu.cc",E="https://eliteprotech-apis.zone.id";
async function req(url,ms=20000){const c=new AbortController(),t=setTimeout(()=>c.abort(),ms);try{const r=await fetch(url,{signal:c.signal,headers:{accept:"application/json"}});if(!r.ok)throw new Error("HTTP "+r.status);return await r.json()}finally{clearTimeout(t)}}
async function fb(name,urls,valid){for(const u of urls){try{const d=await req(u);if(valid(d))return{ok:true,data:d}}catch{}}return{ok:false,error:name+" failed"}}
export const api={
 facebook:u=>fb("Facebook",[J+"/down/fb?url="+encodeURIComponent(u),N+"/downloader/facebook?url="+encodeURIComponent(u),E+"/facebook1?url="+encodeURIComponent(u)],d=>d?.status==="success"||d?.status===true||d?.success===true),
 twitter:u=>fb("Twitter",[N+"/downloader/twitter?url="+encodeURIComponent(u),J+"/down/twitter?url="+encodeURIComponent(u)],d=>d?.status==="success"||d?.status===true),
 lyrics:q=>fb("Lyrics",[J+"/search/lyrics-v1?q="+encodeURIComponent(q)],d=>d?.status==="success"),
 ai:q=>fb("AI",[J+"/ai/gpt?q="+encodeURIComponent(q)],d=>typeof d?.reply==="string"),
 image:p=>fb("Image",[J+"/ai/poll?prompt="+encodeURIComponent(p)],d=>d?.status==="success"&&typeof d?.image==="string")
};