const config = require("../config");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",

  execute(member) {
    const channel = member.guild.channels.cache.get(config.welcomeChannel);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor(config.color || "#2f3136")
      .setTitle("👋 Welcome!")
      .setDescription(`Welcome ${member} to **${member.guild.name}**`)
      .setThumbnail(member.user.displayAvatarURL())
      .setFooter({ text: "Enjoy your stay!" });

    channel.send({ embeds: [embed] }).catch(() => {});
  },
};
