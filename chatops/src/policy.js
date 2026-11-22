const SCOPES={help:"chatops:read",status:"chatops:read",issue:"chatops:read"};
export function authorizeCommand({command,principal,allowedUserIds=[]}) {
  if(!command || command.ok!==true || !SCOPES[command.command]) return {allowed:false,reason:"unsupported_command"};
  if(!principal || typeof principal.userId!=="string" || !principal.userId) return {allowed:false,reason:"missing_authenticated_principal"};
  if(!Array.isArray(allowedUserIds) || !allowedUserIds.includes(principal.userId)) return {allowed:false,reason:"user_not_allowlisted"};
  if(!Array.isArray(principal.scopes) || !principal.scopes.includes(SCOPES[command.command])) return {allowed:false,reason:"missing_required_scope"};
  return {allowed:true,reason:"authorized_read_only_command"};
}