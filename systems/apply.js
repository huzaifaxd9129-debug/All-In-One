console.log("Apply system loaded");

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

      const reason = new TextInputBuilder()
        .setCustomId("reason")
        .setLabel("Why do you want staff?")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      const exp = new TextInputBuilder()
        .setCustomId("experience")
        .setLabel("Your experience?")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      const age = new TextInputBuilder()
        .setCustomId("age")
        .setLabel("Your age?")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder().addComponents(reason),
        new ActionRowBuilder().addComponents(exp),
        new ActionRowBuilder().addComponents(age)
      );

      return interaction.showModal(modal);
    }

    // ================= MODAL SUBMIT =================
    if (interaction.isModalSubmit() && interaction.customId === "apply_form") {

      const reason = interaction.fields.getTextInputValue("reason");
      const exp = interaction.fields.getTextInputValue("experience");
      const age = interaction.fields.getTextInputValue("age");

      const logChannel = interaction.guild.channels.cache.get(config.logsChannel);

      if (logChannel) {
        const embed = new EmbedBuilder()
          .setTitle("📩 Staff Application")
          .setColor("Blue")
          .addFields(
            { name: "User", value: `${interaction.user.tag}` },
            { name: "Reason", value: reason },
            { name: "Experience", value: exp },
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
