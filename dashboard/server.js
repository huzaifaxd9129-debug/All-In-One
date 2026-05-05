const express = require("express");
const config = require("./config");

const app = express();

// ================= BASIC SETUP =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= HOME PAGE =================
app.get("/", (req, res) => {
  res.send(`
    <h1>🤖 Discord Bot Dashboard</h1>
    <p>Status: Online ✅</p>
    <p>Prefix: ${config.prefix}</p>
    <p>Made By: Huztro</p>
  `);
});

// ================= STATUS ROUTE =================
app.get("/status", (req, res) => {
  res.json({
    status: "online",
    prefix: config.prefix,
    welcomeChannel: config.welcomeChannel,
    logsChannel: config.logsChannel,
  });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🌐 Dashboard running on port ${PORT}`);
});
