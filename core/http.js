export async function request(url,options={}){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),20000);
  try{
    const res=await fetch(url,{...options,signal:controller.signal,headers:{
      accept:"application/json","content-type":"application/json",...(options.headers||{})
    }});
    const text=await res.text();
    let data; try{data=text?JSON.parse(text):{}}catch{data={raw:text}};
    if(!res.ok) throw new Error("HTTP "+res.status);
    return data;
  }finally{clearTimeout(timer)}
}
export const sleep=ms=>new Promise(r=>setTimeout(r,ms));
