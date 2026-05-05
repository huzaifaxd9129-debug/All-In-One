const { EmbedBuilder } = require("discord.js");
const config = require("../config");

module.exports = (client) => {

  client.on("guildMemberAdd", async (member) => {

    const channel = member.guild.channels.cache.get(config.welcomeChannel);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setTitle("👋 Welcome to the Server!")
      .setDescription(
        `Hey ${member.user}, welcome to **${member.guild.name}** 🎉\n\n` +
        `You are member **#${member.guild.memberCount}**`
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setColor(config.color || "#2f3136")
      .setFooter({ text: "Enjoy your stay ❤️" })
      .setTimestamp();

    channel.send({ embeds: [embed] }).catch(() => {});
  });

};
