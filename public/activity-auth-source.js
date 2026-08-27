import { DiscordSDK } from "@discord/embedded-app-sdk";

window.discordActivityReady = (async () => {
  const cfg = await (await fetch("/.proxy/api/activity/config", {cache:"no-store"})).json();
  if (!cfg.clientId) throw new Error("DISCORD_CLIENT_ID is missing.");

  const discordSdk = new DiscordSDK(cfg.clientId);
  await discordSdk.ready();

  const { code } = await discordSdk.commands.authorize({
    client_id:cfg.clientId,
    response_type:"code",
    state:"",
    prompt:"none",
    scope:["identify"]
  });

  const tokenRes = await fetch("/.proxy/api/activity/token", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({code})
  });
  const token = await tokenRes.json();
  if (!tokenRes.ok || !token.access_token) throw new Error(token.error || "OAuth token exchange failed.");

  const auth = await discordSdk.commands.authenticate({access_token:token.access_token});
  if (!auth?.user) throw new Error("Discord Activity authentication failed.");

  window.discordActivityAuth = { accessToken:token.access_token, user:auth.user };
  return window.discordActivityAuth;
})();
