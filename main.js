const readline = require("readline");
const { renderAscii, renderPanel } = require("./ascii");
const { launchBots } = require("./bots");
const {
  loadProxyList,
  createProxyRotator,
  fetchProxyList,
  saveProxyList
} = require("./proxy/proxy");

function askQuestion(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

async function askYesNo(rl, question, fallback = true) {
  const answer = (await askQuestion(rl, `${question} y/n: `)).toLowerCase();
  if (!answer) {
    return fallback;
  }

  return answer === "y" || answer === "yes";
}

function toNumberOrDefault(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

async function run() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const isRussian = await askYesNo(rl, "Русский язык", true);
  const language = isRussian ? "ru" : "en";

  console.clear();
  console.log(renderAscii(language));

  const t = {
    en: {
      host: "Server IP",
      port: "Server port",
      version: "Minecraft version",
      bots: "Bot count",
      name: "Bot name prefix",
      delay: "Join delay ms",
      useProxy: "Use proxies",
      fetchProxy: "Update proxy list from online sources",
      loaded: (n) => `Loaded proxies: ${n}`,
      downloaded: (n) => `Downloaded proxies: ${n}`,
      disabled: "Proxy mode disabled",
      starting: "Starting bots",
      done: "Launch complete"
    },
    ru: {
      host: "IP сервера",
      port: "Порт сервера",
      version: "Версия Minecraft",
      bots: "Количество ботов",
      name: "Префикс имени бота",
      delay: "Задержка входа мс",
      useProxy: "Использовать прокси",
      fetchProxy: "Обновить прокси из онлайн источников",
      loaded: (n) => `Загружено прокси: ${n}`,
      downloaded: (n) => `Скачано прокси: ${n}`,
      disabled: "Режим прокси отключен",
      starting: "Запуск ботов",
      done: "Запуск завершен"
    }
  }[language];

  const host = await askQuestion(rl, `${t.host}: `);
  const portInput = await askQuestion(rl, `${t.port}: `);
  const version = await askQuestion(rl, `${t.version}: `);
  const botsInput = await askQuestion(rl, `${t.bots}: `);
  const usernamePrefix = await askQuestion(rl, `${t.name}: `);
  const delayInput = await askQuestion(rl, `${t.delay}: `);
  const useProxy = await askYesNo(rl, t.useProxy, true);

  let proxyList = [];

  if (useProxy) {
    const shouldFetch = await askYesNo(rl, t.fetchProxy, true);
    if (shouldFetch) {
      proxyList = await fetchProxyList();
      saveProxyList(proxyList);
      console.log(renderPanel(language, [t.downloaded(proxyList.length)]));
    } else {
      proxyList = loadProxyList();
    }
  }

  rl.close();

  const port = Math.max(1, toNumberOrDefault(portInput, 25565));
  const count = Math.max(1, toNumberOrDefault(botsInput, 1));
  const delayMs = Math.max(250, toNumberOrDefault(delayInput, 1200));
  const getNextProxy = createProxyRotator(proxyList);

  console.log(renderPanel(language, [
    t.loaded(proxyList.length),
    useProxy ? "Proxy mode ON" : t.disabled,
    `${t.starting}...`
  ]));

  launchBots({
    host,
    port,
    version,
    count,
    usernamePrefix: usernamePrefix || "QuadrantBot",
    language,
    delayMs,
    getNextProxy
  });

  console.log(renderPanel(language, [t.done]));
}

run();
