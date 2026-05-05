const config = require("../config");

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    try {
      // ================= MODAL SUBMIT CHECK =================
      if (!interaction.isModalSubmit()) return;

      // customId must match your apply form
      if (interaction.customId !== "apply_form") return;

      // ================= GET ANSWERS =================
      const reason = interaction.fields.getTextInputValue("reason");
      const experience = interaction.fields.getTextInputValue("experience");
      const age = interaction.fields.getTextInputValue("age");

      // ================= LOG CHANNEL =================
      const logChannel = interaction.guild.channels.cache.get(config.logsChannel);

      if (!logChannel) return;

      // ================= SEND APPLICATION =================
      logChannel.send({
        content: `📩 **New Staff Application**\n\n👤 User: ${interaction.user.tag}\n🆔 ID: ${interaction.user.id}\n\n📌 Reason:\n${reason}\n\n💼 Experience:\n${experience}\n\n🎂 Age:\n${age}`,
      });

      // ================= REPLY TO USER =================
      await interaction.reply({
        content: "✅ Your application has been submitted successfully!",
        ephemeral: true,
      });

    } catch (err) {
      console.log("Apply System Error:", err);
    }
  });
};
