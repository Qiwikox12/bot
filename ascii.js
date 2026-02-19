const colors = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  yellow: "\x1b[33m",
  gray: "\x1b[90m",
  green: "\x1b[32m"
};

function renderAscii(lang = "en") {
  const subtitle = lang === "ru"
    ? "Мощный запускатор Mineflayer"
    : "Powerful Mineflayer launcher";

  return `${colors.cyan}
╔════════════════════════════════════════════════════════════════════╗
║  ██████  ██    ██  █████  ██████  ██████   █████  ███    ██ ███████║
║ ██    ██ ██    ██ ██   ██ ██   ██ ██   ██ ██   ██ ████   ██    ███ ║
║ ██    ██ ██    ██ ███████ ██   ██ ██████  ███████ ██ ██  ██   ███  ║
║ ██ ▄▄ ██ ██    ██ ██   ██ ██   ██ ██   ██ ██   ██ ██  ██ ██  ███   ║
║  ██████   ██████  ██   ██ ██████  ██   ██ ██   ██ ██   ████ ███████║
║   ▀▀                                                                   ║
╚════════════════════════════════════════════════════════════════════╝
${colors.magenta}                         Q U A D R A N T   B O T${colors.reset}
${colors.yellow}${subtitle}${colors.reset}`;
}

function renderPanel(lang = "en", lines = []) {
  const title = lang === "ru" ? "Статус" : "Status";
  const content = lines.map((line) => `│ ${line}`).join("\n");

  return `${colors.gray}┌─────────────────────────────────────────────┐
${colors.green}│ ${title}
${colors.gray}├─────────────────────────────────────────────┤
${colors.reset}${content}
${colors.gray}└─────────────────────────────────────────────┘${colors.reset}`;
}

module.exports = { renderAscii, renderPanel };
