const config = require("../config");

module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    // ================= BASIC CHECKS =================
    if (!message.guild) return;
    if (message.author.bot) return;

    // allow admins to bypass
    if (message.member.permissions.has("Administrator")) return;

    // ================= ANTI LINK CHECK =================
    const linkRegex = /(https?:\/\/|discord\.gg|discord\.com\/invite)/gi;

    if (linkRegex.test(message.content)) {
      try {
        await message.delete();

        message.channel.send({
          content: `🚫 ${message.author}, links are not allowed here!`,
        }).then(msg => {
          setTimeout(() => msg.delete().catch(() => {}), 5000);
        });

        // ================= LOG SYSTEM =================
        const logChannel = message.guild.channels.cache.get(config.logsChannel);

        if (logChannel) {
          logChannel.send({
            content: `🚨 Anti-Link Triggered\nUser: ${message.author.tag}\nChannel: ${message.channel}`,
          });
        }

      } catch (err) {
        console.log("AntiLink Error:", err);
      }
    }
  });
};
