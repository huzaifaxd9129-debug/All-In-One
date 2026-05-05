const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder
} = require("discord.js");

const config = require("../config");

module.exports = (client) => {

  client.on("interactionCreate", async (interaction) => {

    // ================= BUTTON =================
    if (interaction.isButton() && interaction.customId === "apply_open") {

      const modal = new ModalBuilder()
        .setCustomId("apply_form")
        .setTitle("Staff Application");

      const q1 = new TextInputBuilder()
        .setCustomId("reason")
        .setLabel("Why do you want staff?")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      const q2 = new TextInputBuilder()
        .setCustomId("experience")
        .setLabel("Your experience?")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      const q3 = new TextInputBuilder()
        .setCustomId("age")
        .setLabel("Your age?")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder().addComponents(q1),
        new ActionRowBuilder().addComponents(q2),
        new ActionRowBuilder().addComponents(q3)
      );

      return interaction.showModal(modal);
    }

    // ================= FORM SUBMIT =================
    if (interaction.isModalSubmit() && interaction.customId === "apply_form") {

      const reason = interaction.fields.getTextInputValue("reason");
      const experience = interaction.fields.getTextInputValue("experience");
      const age = interaction.fields.getTextInputValue("age");

      const logChannel = interaction.guild.channels.cache.get(config.logsChannel);

      if (logChannel) {
        const embed = new EmbedBuilder()
          .setTitle("📩 Staff Application")
          .setColor("Blue")
          .addFields(
            { name: "User", value: `${interaction.user.tag}` },
            { name: "Reason", value: reason },
            { name: "Experience", value: experience },
            { name: "Age", value: age }
          );

        logChannel.send({ embeds: [embed] });
      }

      return interaction.reply({
        content: "✅ Application submitted!",
        ephemeral: true,
      });
    }
  });

};
