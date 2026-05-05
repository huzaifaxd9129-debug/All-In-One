const config = require("../config");

module.exports = (client) => {
  const giveaways = new Map();

  client.on("messageCreate", async (message) => {
    if (!message.guild) return;
    if (message.author.bot) return;

    const args = message.content.split(/ +/);
    const cmd = args.shift().toLowerCase();

    // ================= START GIVEAWAY =================
    if (cmd === "-gstart") {
      if (!message.member.permissions.has("Administrator")) return;

      const prize = args.join(" ");
      if (!prize) return message.reply("❌ Please provide a prize!");

      const giveawayMsg = await message.channel.send(
        `🎁 **GIVEAWAY STARTED** 🎁\n\nPrize: **${prize}**\nReact with 🎉 to join!`
      );

      await giveawayMsg.react("🎉");

      giveaways.set(message.channel.id, {
        messageId: giveawayMsg.id,
        prize,
      });
    }

    // ================= END GIVEAWAY =================
    if (cmd === "-gend") {
      const data = giveaways.get(message.channel.id);
      if (!data) return message.reply("❌ No giveaway running here!");

      const giveawayMsg = await message.channel.messages.fetch(data.messageId);

      const users = await giveawayMsg.reactions.cache
        .get("🎉")
        .users.fetch();

      const filtered = users.filter((u) => !u.bot);

      if (filtered.size === 0) {
        return message.channel.send("❌ No participants!");
      }

      const winner = filtered.random();

      message.channel.send(
        `🎉 Congratulations ${winner}! You won **${data.prize}**`
      );

      giveaways.delete(message.channel.id);

      // ================= LOG =================
      const logChannel = message.guild.channels.cache.get(config.logsChannel);

      if (logChannel) {
        logChannel.send(
          `🎁 Giveaway Ended\nPrize: ${data.prize}\nWinner: ${winner.tag}`
        );
      }
    }
  });
};
