const {
  ChannelType,
  PermissionsBitField,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require("discord.js");

const config = require("../config");

module.exports = (client) => {

  // ================= TICKET PANEL =================
  client.on("messageCreate", async (message) => {
    if (!message.guild) return;
    if (message.author.bot) return;

    // command to send panel
    if (message.content === "-ticketpanel") {
      if (!message.member.permissions.has("Administrator")) return;

      const embed = new EmbedBuilder()
        .setTitle("🎫 Support Ticket System")
        .setDescription("Select a category below to open a ticket")
        .setColor(config.color || "#2f3136");

      const menu = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("ticket_menu")
          .setPlaceholder("📩 Select Ticket Category")
          .addOptions([
            {
              label: "Support",
              description: "General Support",
              value: "support",
              emoji: "🛠️",
            },
            {
              label: "Report",
              description: "Report a user",
              value: "report",
              emoji: "🚨",
            },
            {
              label: "Other",
              description: "Other issues",
              value: "other",
              emoji: "📌",
            },
          ])
      );

      message.channel.send({
        embeds: [embed],
        components: [menu],
      });
    }
  });

  // ================= INTERACTION HANDLER =================
  client.on("interactionCreate", async (interaction) => {

    // ================= DROPDOWN =================
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId !== "ticket_menu") return;

      const type = interaction.values[0];

      const channel = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: interaction.user.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
            ],
          },
        ],
      });

      const embed = new EmbedBuilder()
        .setTitle("🎫 Ticket Created")
        .setDescription(`Category: **${type}**\nUser: ${interaction.user}`)
        .setColor(config.color || "#2f3136");

      const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("close_ticket")
          .setLabel("Close Ticket")
          .setStyle(ButtonStyle.Danger)
          .setEmoji("🔒")
      );

      channel.send({
        content: `${interaction.user}`,
        embeds: [embed],
        components: [button],
      });

      interaction.reply({
        content: `✅ Ticket created: ${channel}`,
        ephemeral: true,
      });
    }

    // ================= CLOSE TICKET =================
    if (interaction.isButton()) {
      if (interaction.customId === "close_ticket") {
        const logChannel = interaction.guild.channels.cache.get(config.logsChannel);

        if (logChannel) {
          logChannel.send(
            `🔒 Ticket closed by ${interaction.user.tag} | Channel: ${interaction.channel.name}`
          );
        }

        interaction.reply("🔒 Closing ticket...");
        setTimeout(() => {
          interaction.channel.delete().catch(() => {});
        }, 2000);
      }
    }
  });
};
