import test from "node:test";
import assert from "node:assert/strict";
import {createHmac} from "node:crypto";
import {verifySlackRequest} from "../src/security.js";
import {parseCommand} from "../src/commands.js";
import {authorizeCommand} from "../src/policy.js";
const secret="synthetic-test-secret", now=1800000000, timestamp=String(now), rawBody="command=%2Fbgla+status";
const signature="v0="+createHmac("sha256",secret).update(`v0:${timestamp}:${rawBody}`).digest("hex");
test("valid fresh Slack signature",()=>assert.equal(verifySlackRequest({signingSecret:secret,rawBody,timestamp,signature,nowSeconds:now}),true));
test("rejects stale, malformed, and invalid signatures",()=>{
 assert.equal(verifySlackRequest({signingSecret:secret,rawBody,timestamp,signature,nowSeconds:now+301}),false);
 assert.equal(verifySlackRequest({signingSecret:secret,rawBody,timestamp,signature:"v0="+"0".repeat(64),nowSeconds:now}),false);
 assert.equal(verifySlackRequest({signingSecret:"",rawBody,timestamp,signature,nowSeconds:now}),false);
});
test("parses only supported read commands",()=>{
 assert.deepEqual(parseCommand("/bgla status"),{ok:true,command:"status",effect:"read"});
 assert.deepEqual(parseCommand("/bgla issue 42"),{ok:true,command:"issue",issueNumber:42,effect:"read"});
 assert.equal(parseCommand("/bgla deploy prod").ok,false);
 assert.equal(parseCommand("/bgla issue 0").ok,false);
});
test("authorization denies by default and requires allowlist plus scope",()=>{
 const command=parseCommand("/bgla status");
 assert.equal(authorizeCommand({command}).allowed,false);
 assert.equal(authorizeCommand({command,principal:{userId:"U1",scopes:[]},allowedUserIds:["U1"]}).allowed,false);
 assert.equal(authorizeCommand({command,principal:{userId:"U1",scopes:["chatops:read"]},allowedUserIds:["U1"]}).allowed,true);
});