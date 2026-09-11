export const commandGroups = {
  General: ["ping","menu","help","alive","owner","runtime"],
  Downloader: ["ytv","yta","spotify","song","instagram","facebook","twitter","tiktok","lyrics","play"],
  Group: ["add","remove","promote","demote","groupinfo","invite","revoke","tagall","welcome","goodbye","antilink","open","close","mute"],
  Owner: ["broadcast","block","unblock","restart","eval","exec","setpp","setname","setbio"],
  FunUtility: ["sticker","toimage","textsticker","translate","weather","wiki","image","qr","readqr","short"],
  AI: ["ai","imagine"],
  Safety: ["antidelete","viewonce","autoread","autotyping"]
};

export function menuText(prefix) {
  return Object.entries(commandGroups).map(function(x) {
    return "*" + x[0] + "*\n" + x[1].map(function(c) { return "• " + prefix + c; }).join("\n");
  }).join("\n\n");
}
