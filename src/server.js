import http from "node:http";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const port = Number(process.env.PORT || 3000);
const maxSpend = Number(process.env.MAX_AI_SPEND_USD || 1);
const events = [
  { id: "evt-001", email: "alex@example.com", company: "Northstar Logistics", pages: ["/pricing", "/integrations", "/security"], minutes: 8, visits: 3 },
  { id: "evt-002", email: "sam@example.com", company: "Acme Studio", pages: ["/home"], minutes: 1, visits: 1 },
  { id: "evt-003", email: "riley@example.com", company: "Harbor Health", pages: ["/pricing", "/case-studies"], minutes: 5, visits: 2 }
];
function classify(e) { const evidence=[]; let score=20; if(e.pages.includes("/pricing")){score+=35;evidence.push("Viewed pricing")} if(e.pages.includes("/integrations")){score+=25;evidence.push("Viewed integrations")} if(e.visits>1){score+=15;evidence.push("Returned visitor")} if(e.minutes>=5){score+=10;evidence.push("Meaningful time on site")} const level=score>=70?"high":score>=45?"medium":"low"; return {...e,score,level,evidence,recommendation:level==="high"?"Create or update CRM lead and notify sales":"Keep monitoring"}; }
function json(res,status,body){res.writeHead(status,{"content-type":"application/json"});res.end(JSON.stringify(body));}
const server=http.createServer(async(req,res)=>{ if(req.url==="/api/events") return json(res,200,{events:events.map(classify),aiMode:process.env.AI_MODE||"mock",salesforceMode:process.env.SALESFORCE_MODE||"mock",maxSpend}); if(req.method==="POST"&&req.url==="/api/track"){let raw="";for await(const c of req)raw+=c;const e={...JSON.parse(raw||"{}"),id:`evt-${Date.now()}`};events.unshift(e);return json(res,200,{event:classify(e),duplicateProtection:"mock lookup: matching emails do not create a second lead",aiSpendGuard:`local cap $${maxSpend.toFixed(2)}`});} const file=join(root,"public",req.url==="/"?"index.html":req.url); try{const body=await readFile(file);res.writeHead(200,{"content-type":file.endsWith(".css")?"text/css":"text/html"});res.end(body);}catch{json(res,404,{error:"Not found"})} });
server.listen(port,()=>console.log(`demo listening on ${port}`));

