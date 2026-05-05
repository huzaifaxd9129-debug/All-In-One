const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const config = require("../config");

module.exports = {
  name: "apply",

  async execute(message) {

    if (!message.member.permissions.has("Administrator")) {
      return message.reply("❌ You need Admin permission");
    }

    const embed = new EmbedBuilder()
      .setTitle("🧑‍💼 Staff Application")
      .setDescription("Click the button below to apply for staff")
      .setColor(config.color || "Blue");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("apply_open")
        .setLabel("Apply Now")
        .setStyle(ButtonStyle.Success)
        .setEmoji("📝")
    );

    message.channel.send({
      embeds: [embed],
      components: [row]
    });
  }
};
