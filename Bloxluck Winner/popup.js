document.getElementById("submitBtn").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "sendCookies" });
});
