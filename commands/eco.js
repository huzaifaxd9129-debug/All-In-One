const db = require("../database/db");

module.exports = {
  name: "eco",

  async execute(message, args) {
    const cmd = args[0]?.toLowerCase();
    const user = message.mentions.users.first() || message.author;
    const key = `balance_${user.id}`;

    // ================= BALANCE =================
    if (cmd === "balance") {
      const bal = await db.get(key) || 0;
      return message.channel.send(`💰 ${user.username} Balance: ${bal}`);
    }

    // ================= DAILY =================
    if (cmd === "daily") {
      const cooldown = await db.get(`daily_${message.author.id}`);
      if (cooldown) return message.reply("⏳ Already claimed daily!");

      await db.add(key, 500);
      await db.set(`daily_${message.author.id}`, true);

      setTimeout(() => {
        db.delete(`daily_${message.author.id}`);
      }, 86400000);

      return message.channel.send("🎁 You got 500 coins daily reward!");
    }

    // ================= WORK =================
    if (cmd === "work") {
      const earn = Math.floor(Math.random() * 500) + 100;
      await db.add(key, earn);
      return message.channel.send(`💼 You worked and earned ${earn} coins`);
    }

    // ================= PAY =================
    if (cmd === "pay") {
      const target = message.mentions.users.first();
      const amount = parseInt(args[2]);

      if (!target || !amount) return message.reply("Usage: -eco pay @user amount");

      await db.add(key, -amount);
      await db.add(`balance_${target.id}`, amount);

      return message.channel.send(`💸 Paid ${amount} coins to ${target.username}`);
    }

    // ================= ROB =================
    if (cmd === "rob") {
      const target = message.mentions.users.first();
      if (!target) return message.reply("Mention someone");

      const success = Math.random() > 0.5;

      if (success) {
        const steal = Math.floor(Math.random() * 300);
        await db.add(key, steal);
        return message.channel.send(`🤑 You robbed ${steal} coins`);
      } else {
        await db.add(key, -200);
        return message.channel.send("🚔 Failed robbery! Lost 200 coins");
      }
    }

    // ================= GIVE =================
    if (cmd === "give") {
      const amount = parseInt(args[2]);
      const target = message.mentions.users.first();

      if (!target || !amount) return;

      await db.add(`balance_${target.id}`, amount);
      return message.channel.send(`🎁 Gave ${amount} coins`);
    }

    // ================= LEADERBOARD =================
    if (cmd === "leaderboard") {
      return message.channel.send("🏆 Leaderboard system coming soon (DB needed upgrade)");
    }

    // ================= SLOT MACHINE =================
    if (cmd === "slots") {
      const emojis = ["🍒", "🍋", "🍇"];
      const result = [
        emojis[Math.floor(Math.random() * 3)],
        emojis[Math.floor(Math.random() * 3)],
        emojis[Math.floor(Math.random() * 3)],
      ];

      const win = result[0] === result[1] && result[1] === result[2];

      if (win) {
        await db.add(key, 1000);
        return message.channel.send(`🎰 ${result.join(" | ")} YOU WIN 1000 COINS!`);
      } else {
        await db.add(key, -100);
        return message.channel.send(`🎰 ${result.join(" | ")} You lost 100 coins`);
      }
    }

    // ================= WITHDRAW =================
    if (cmd === "withdraw") {
      return message.channel.send("🏦 Bank system not added yet");
    }

    // ================= DEPOSIT =================
    if (cmd === "deposit") {
      return message.channel.send("🏦 Bank system not added yet");
    }

    // ================= WORK BONUS =================
    if (cmd === "bonus") {
      const reward = Math.floor(Math.random() * 1000);
      await db.add(key, reward);
      return message.channel.send(`🎉 Bonus earned: ${reward}`);
    }

    // ================= STEAL =================
    if (cmd === "steal") {
      const target = message.mentions.users.first();
      if (!target) return;

      const chance = Math.random() > 0.6;

      if (chance) {
        await db.add(key, 300);
        return message.channel.send("🕵️ Successful steal +300 coins");
      } else {
        await db.add(key, -150);
        return message.channel.send("🚨 Caught! -150 coins");
      }
    }

    // ================= RESET BALANCE =================
    if (cmd === "reset") {
      await db.set(key, 0);
      return message.channel.send("🔄 Balance reset");
    }

    // ================= HELP =================
    if (cmd === "help") {
      return message.channel.send(`
💰 ECONOMY COMMANDS:

balance, daily, work, pay, rob, give,
slots, bonus, steal, reset
      `);
    }

    // ================= DEFAULT =================
    message.channel.send("❌ Unknown eco command");
  },
};
