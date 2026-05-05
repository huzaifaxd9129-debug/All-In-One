module.exports = {
  name: "mod",

  async execute(message, args, client) {
    if (!message.member.permissions.has("Administrator")) {
      return message.reply("❌ No permission");
    }

    const cmd = args[0]?.toLowerCase();
    const user = message.mentions.members.first();

    // ================= BAN =================
    if (cmd === "ban") {
      if (!user) return message.reply("❌ Mention user");
      await user.ban();
      return message.channel.send(`🔨 Banned ${user.user.tag}`);
    }

    // ================= KICK =================
    if (cmd === "kick") {
      if (!user) return message.reply("❌ Mention user");
      await user.kick();
      return message.channel.send(`👢 Kicked ${user.user.tag}`);
    }

    // ================= MUTE (TIMEOUT) =================
    if (cmd === "mute") {
      if (!user) return message.reply("❌ Mention user");
      await user.timeout(10 * 60 * 1000);
      return message.channel.send(`🔇 Muted ${user.user.tag}`);
    }

    // ================= UNMUTE =================
    if (cmd === "unmute") {
      if (!user) return message.reply("❌ Mention user");
      await user.timeout(null);
      return message.channel.send(`🔊 Unmuted ${user.user.tag}`);
    }

    // ================= WARN =================
    if (cmd === "warn") {
      return message.channel.send(`⚠️ Warned ${user.user.tag}`);
    }

    // ================= CLEAR =================
    if (cmd === "clear") {
      const amount = parseInt(args[1]) || 10;
      await message.channel.bulkDelete(amount);
      return message.channel.send(`🧹 Deleted ${amount} messages`);
    }

    // ================= LOCK =================
    if (cmd === "lock") {
      await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        SendMessages: false,
      });
      return message.channel.send("🔒 Channel locked");
    }

    // ================= UNLOCK =================
    if (cmd === "unlock") {
      await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        SendMessages: true,
      });
      return message.channel.send("🔓 Channel unlocked");
    }

    // ================= NICK =================
    if (cmd === "nick") {
      const nick = args.slice(2).join(" ");
      if (!user || !nick) return;
      await user.setNickname(nick);
      return message.channel.send("🏷️ Nickname changed");
    }

    // ================= SLOWMODE =================
    if (cmd === "slowmode") {
      const time = parseInt(args[1]) || 5;
      message.channel.setRateLimitPerUser(time);
      return message.channel.send(`⏱️ Slowmode set to ${time}s`);
    }

    // ================= SAY =================
    if (cmd === "say") {
      const text = args.slice(1).join(" ");
      return message.channel.send(text);
    }

    // ================= DM USER =================
    if (cmd === "dm") {
      const text = args.slice(2).join(" ");
      if (!user) return;
      user.send(text);
      return message.channel.send("📩 DM sent");
    }

    // ================= ADD ROLE =================
    if (cmd === "addrole") {
      const role = message.mentions.roles.first();
      if (!user || !role) return;
      await user.roles.add(role);
      return message.channel.send("➕ Role added");
    }

    // ================= REMOVE ROLE =================
    if (cmd === "removerole") {
      const role = message.mentions.roles.first();
      if (!user || !role) return;
      await user.roles.remove(role);
      return message.channel.send("➖ Role removed");
    }

    // ================= AVATAR =================
    if (cmd === "avatar") {
      return message.channel.send(user.user.displayAvatarURL());
    }

    // ================= SERVER INFO =================
    if (cmd === "serverinfo") {
      return message.channel.send(
        `📊 ${message.guild.name}\nMembers: ${message.guild.memberCount}`
      );
    }

    // ================= BOT INFO =================
    if (cmd === "botinfo") {
      return message.channel.send(`🤖 ${client.user.tag}`);
    }

    // ================= UNBAN (by ID) =================
    if (cmd === "unban") {
      const id = args[1];
      await message.guild.members.unban(id);
      return message.channel.send("♻️ Unbanned user");
    }

    // ================= PURGE =================
    if (cmd === "purge") {
      const amount = parseInt(args[1]) || 20;
      await message.channel.bulkDelete(amount);
      return message.channel.send("🧹 Purged messages");
    }

    // ================= HIDE CHANNEL =================
    if (cmd === "hide") {
      message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        ViewChannel: false,
      });
      return message.channel.send("🙈 Channel hidden");
    }

    // ================= UNHIDE CHANNEL =================
    if (cmd === "unhide") {
      message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        ViewChannel: true,
      });
      return message.channel.send("👁️ Channel visible");
    }

    // ================= HELP =================
    if (cmd === "help") {
      return message.channel.send(
        `🛡️ MOD COMMANDS:
ban, kick, mute, unmute, warn, clear, lock, unlock, nick,
slowmode, say, dm, addrole, removerole, avatar,
serverinfo, botinfo, unban, purge, hide, unhide`
      );
    }

    // ================= DEFAULT =================
    message.channel.send("❌ Unknown mod command");
  },
};
