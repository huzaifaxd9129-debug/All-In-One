const { ActivityType } = require("discord.js");
const config = require("../config");

module.exports = {
  name: "ready",
  once: true,

  execute(client) {
    console.log(`✅ ${client.user.tag} is now online!`);

    // ================= BOT STATUS =================
    client.user.setPresence({
      activities: [
        {
          name: config.status || "Made By Huztro",
          type: ActivityType.Watching,
        },
      ],
      status: "online",
    });

    // ================= OPTIONAL: CONSOLE INFO =================
    console.log("━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`Bot Name   : ${client.user.tag}`);
    console.log(`Prefix     : ${config.prefix}`);
    console.log(`Servers    : ${client.guilds.cache.size}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━");
  },
};
