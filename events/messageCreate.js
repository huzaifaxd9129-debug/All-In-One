const config = require("../config");

module.exports = {
  name: "messageCreate",

  execute(message, client) {
    // ================= BASIC CHECKS =================
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(config.prefix)) return;

    // ================= COMMAND PARSING =================
    const args = message.content
      .slice(config.prefix.length)
      .trim()
      .split(/ +/);

    const cmd = args.shift().toLowerCase();

    // ================= GET COMMAND =================
    const command =
      client.commands?.get(cmd);

    if (!command) return;

    try {
      command.execute(message, args, client);
    } catch (err) {
      console.log(err);
      message.reply("❌ Error while executing command.");
    }
  },
};
