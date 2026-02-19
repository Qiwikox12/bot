const fs = require("fs");
const path = require("path");
const https = require("https");

const DEFAULT_PROXY_SOURCES = [
  "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks5.txt",
  "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/socks5.txt",
  "https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/socks5.txt",
  "https://api.proxyscrape.com/v2/?request=get&protocol=socks5&timeout=10000&country=all&ssl=all&anonymity=all"
];

function normalizeProxy(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) {
    return null;
  }

  const [host, port] = trimmed.split(":");
  if (!host || !port || Number.isNaN(Number(port))) {
    return null;
  }

  return `${host}:${port}`;
}

function parseProxyText(text) {
  return text
    .split(/\r?\n/)
    .map(normalizeProxy)
    .filter(Boolean);
}

function loadProxyList(filePath = path.join(process.cwd(), "proxy", "list.txt")) {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const raw = fs.readFileSync(filePath, "utf8");
  return parseProxyText(raw);
}

function createProxyRotator(proxies) {
  let cursor = 0;

  return function getNextProxy() {
    if (!Array.isArray(proxies) || proxies.length === 0) {
      return null;
    }

    const current = proxies[cursor % proxies.length];
    cursor += 1;
    return current;
  };
}

function requestText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          res.resume();
          return;
        }

        let data = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

async function fetchProxyList(sources = DEFAULT_PROXY_SOURCES) {
  const settled = await Promise.allSettled(sources.map((url) => requestText(url)));

  const collected = [];
  for (const item of settled) {
    if (item.status === "fulfilled") {
      collected.push(...parseProxyText(item.value));
    }
  }

  return [...new Set(collected)];
}

function saveProxyList(proxies, filePath = path.join(process.cwd(), "proxy", "list.txt")) {
  const folder = path.dirname(filePath);
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  fs.writeFileSync(filePath, proxies.join("\n"), "utf8");
}

module.exports = {
  DEFAULT_PROXY_SOURCES,
  loadProxyList,
  createProxyRotator,
  fetchProxyList,
  saveProxyList
};
