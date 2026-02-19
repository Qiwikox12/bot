const mineflayer = require("mineflayer");

function createBotProfile({ baseName, index }) {
  if (index === 0) {
    return baseName;
  }

  return `${baseName}_${index + 1}`;
}

function launchBots(config) {
  const {
    host,
    port,
    version,
    count,
    usernamePrefix,
    language,
    delayMs,
    getNextProxy
  } = config;

  const bots = [];

  for (let i = 0; i < count; i += 1) {
    const username = createBotProfile({ baseName: usernamePrefix, index: i });
    const proxy = typeof getNextProxy === "function" ? getNextProxy() : null;

    setTimeout(() => {
      const bot = mineflayer.createBot({
        host,
        port,
        username,
        version
      });

      bot.once("spawn", () => {
        const message = language === "ru"
          ? `✅ ${username} подключен к ${host}:${port}`
          : `✅ ${username} connected to ${host}:${port}`;
        console.log(message);
      });

      bot.on("error", (err) => {
        const message = language === "ru"
          ? `❌ Ошибка ${username}: ${err.message}`
          : `❌ ${username} error: ${err.message}`;
        console.log(message);
      });

      bot.on("end", () => {
        const message = language === "ru"
          ? `⚠️ ${username} отключен`
          : `⚠️ ${username} disconnected`;
        console.log(message);
      });

      if (proxy) {
        const note = language === "ru"
          ? `ℹ️ Прокси для ${username} загружен (${proxy}), но не применяется автоматически.`
          : `ℹ️ Proxy for ${username} loaded (${proxy}) but not auto-applied.`;
        console.log(note);
      }

      bots.push(bot);
    }, delayMs * i);
  }

  return bots;
}

module.exports = { launchBots };
