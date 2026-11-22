const ISSUE_NUMBER=/^[1-9]\d{0,8}$/;
export function parseCommand(text) {
  if(typeof text!=="string" || text.length>500) return {ok:false,error:"invalid_input"};
  const parts=text.trim().split(/\s+/).filter(Boolean);
  if(!parts.length) return {ok:false,error:"empty_command"};
  const [root,...args]=parts;
  if(root!=="/bgla") return {ok:false,error:"unknown_command"};
  if(args.length===1 && ["help","status"].includes(args[0])) return {ok:true,command:args[0],effect:"read"};
  if(args.length===2 && args[0]==="issue" && ISSUE_NUMBER.test(args[1])) return {ok:true,command:"issue",issueNumber:Number(args[1]),effect:"read"};
  return {ok:false,error:"unsupported_command_or_arguments"};
}