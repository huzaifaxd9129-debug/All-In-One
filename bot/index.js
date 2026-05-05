require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  ActivityType,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require("discord.js");

const fs = require("fs");
const config = require("./config");

const client = new Client({
  intents: Object.values(GatewayIntentBits),
});

// ================= COMMAND LOADER =================
client.commands = new Map();

const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// ================= SYSTEMS LOADER =================
const systemFiles = fs.readdirSync("./systems").filter(f => f.endsWith(".js"));

for (const file of systemFiles) {
  const system = require(`./systems/${file}`);
  system(client);
}

// ================= EVENTS LOADER =================
const eventFiles = fs.readdirSync("./events").filter(f => f.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// ================= READY + STATUS =================
client.once("ready", () => {
  console.log(`${client.user.tag} is online ✅`);

  client.user.setPresence({
    activities: [
      {
        name: config.status || "Made By Huztro",
        type: ActivityType.Watching,
      },
    ],
    status: "online",
  });
});

// ================= MESSAGE HANDLER =================
client.on("messageCreate", async (message) => {
  if (!message.guild || message.author.bot) return;

  const prefix = config.prefix;

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();

  // ================= HELP PANEL COMMAND =================
  if (cmd === "help") {
    const embed = new EmbedBuilder()
      .setTitle("📖 Help Panel")
      .setDescription("Select a category from dropdown below")
      .setColor(config.color || "#2f3136");

    const menu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("help_menu")
        .setPlaceholder("📌 Select Category")
        .addOptions([
          {
            label: "Moderation",
            value: "mod",
            emoji: "🛡️",
            description: "Ban, Kick, Mute, etc",
          },
          {
            label: "Economy",
            value: "eco",
            emoji: "💰",
            description: "Money system commands",
          },
          {
            label: "Utility",
            value: "util",
            emoji: "⚙️",
            description: "General tools",
          },
          {
            label: "Tickets",
            value: "ticket",
            emoji: "🎫",
            description: "Support system",
          },
        ])
    );

    return message.channel.send({
      embeds: [embed],
      components: [menu],
    });
  }

  // ================= NORMAL COMMANDS =================
  const command = client.commands.get(cmd);
  if (!command) return;

  try {
    command.execute(message, args, client);
  } catch (err) {
    console.log(err);
    message.reply("❌ Error executing command");
  }
});

// ================= HELP MENU INTERACTION =================
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;

  if (interaction.customId === "help_menu") {
    const value = interaction.values[0];

    let embed;

    if (value === "mod") {
      embed = new EmbedBuilder()
        .setTitle("🛡️ Moderation Commands")
        .setDescription("-ban\n-kick\n-mute\n-unmute\n-warn")
        .setColor("Red");
    }

    if (value === "eco") {
      embed = new EmbedBuilder()
        .setTitle("💰 Economy Commands")
        .setDescription("-balance\n-daily\n-work\n-rob")
        .setColor("Gold");
    }

    if (value === "util") {
      embed = new EmbedBuilder()
        .setTitle("⚙️ Utility Commands")
        .setDescription("-ping\n-avatar\n-serverinfo")
        .setColor("Blue");
    }

    if (value === "ticket") {
      embed = new EmbedBuilder()
        .setTitle("🎫 Ticket System")
        .setDescription("-ticketpanel to open system")
        .setColor("Purple");
    }

    return interaction.update({
      embeds: [embed],
      components: [],
    });
  }
});

// ================= LOGIN =================
client.login(process.env.TOKEN);
