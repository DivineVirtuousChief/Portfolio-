import { createHmac, timingSafeEqual } from "node:crypto";
export function verifySlackRequest({ signingSecret, rawBody, timestamp, signature, nowSeconds = Math.floor(Date.now()/1000), toleranceSeconds = 300 }) {
  if (typeof signingSecret !== "string" || !signingSecret || typeof rawBody !== "string" ||
      typeof timestamp !== "string" || !/^\\d{1,12}$/.test(timestamp) ||
      typeof signature !== "string" || !/^v0=[a-f0-9]{64}$/i.test(signature) ||
      !Number.isInteger(nowSeconds) || !Number.isInteger(toleranceSeconds) || toleranceSeconds < 0) return false;
  const requestTime = Number(timestamp);
  if (!Number.isSafeInteger(requestTime) || Math.abs(nowSeconds-requestTime)>toleranceSeconds) return false;
  const base = `v0:${timestamp}:${rawBody}`;
  const expected = `v0=${createHmac("sha256",signingSecret).update(base,"utf8").digest("hex")}`;
  const a=Buffer.from(expected,"utf8"), b=Buffer.from(signature,"utf8");
  return a.length===b.length && timingSafeEqual(a,b);
}