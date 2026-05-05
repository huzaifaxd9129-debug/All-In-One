require("dotenv").config();
const { Client, GatewayIntentBits, ActivityType } = require("discord.js");
const fs = require("fs");

const client = new Client({
  intents: Object.values(GatewayIntentBits),
});


// ================= SYSTEM LOADER =================
const systemFiles = fs.readdirSync("./systems").filter(f => f.endsWith(".js"));

for (const file of systemFiles) {
  const system = require(`./systems/${file}`);
  system(client);
}


// ================= EVENT LOADER =================
const eventFiles = fs.readdirSync("./events").filter(f => f.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}


// ================= BOT READY + STATUS =================
client.once("ready", () => {
  console.log(`${client.user.tag} is online ✅`);

  // STATUS SYSTEM
  client.user.setPresence({
    activities: [
      {
        name: "Made By Huztro",
        type: ActivityType.Watching, // Watching / Playing / Listening
      },
    ],
    status: "online",
  });
});


// ================= LOGIN =================
client.login(process.env.TOKEN);
