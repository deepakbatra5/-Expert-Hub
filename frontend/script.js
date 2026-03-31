const chatBox = document.getElementById("chatBox");
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");
const roleSelect = document.getElementById("role");
const themeSelect = document.getElementById("themeSelect");

const THEME_STORAGE_KEY = "expert-hub-theme";
const RUNTIME_API_URL = (window.EXPERT_HUB_API_URL || "").trim();

function resolveApiUrl() {
  const { protocol, hostname, port } = window.location;

  if (RUNTIME_API_URL) {
    return RUNTIME_API_URL;
  }

  if (protocol === "file:") {
    return "http://localhost:3000/chat";
  }

  if (hostname.endsWith("github.io")) {
    return "";
  }

  if (port && port !== "3000") {
    return `http://${hostname}:3000/chat`;
  }

  return "/chat";
}

const CHAT_API_URL = resolveApiUrl();

function escapeHtml(input) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseInlineMarkdown(text) {
  return text
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function markdownToHtml(markdownText) {
  const codeBlocks = [];
  const escaped = escapeHtml(markdownText || "").replace(/\r\n/g, "\n");
  const textWithTokens = escaped.replace(/```([a-zA-Z0-9_-]+)?\n?([\s\S]*?)```/g, (_m, lang, code) => {
    const token = `@@CODEBLOCK_${codeBlocks.length}@@`;
    codeBlocks.push({ lang: lang || "", code: code.replace(/\n$/, "") });
    return token;
  });

  const lines = textWithTokens.split("\n");
  const htmlParts = [];
  let inUnorderedList = false;
  let inOrderedList = false;

  function closeLists() {
    if (inUnorderedList) {
      htmlParts.push("</ul>");
      inUnorderedList = false;
    }
    if (inOrderedList) {
      htmlParts.push("</ol>");
      inOrderedList = false;
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      closeLists();
      continue;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      closeLists();
      const level = headingMatch[1].length;
      htmlParts.push(`<h${level}>${parseInlineMarkdown(headingMatch[2])}</h${level}>`);
      continue;
    }

    const unorderedMatch = line.match(/^[-*]\s+(.*)$/);
    if (unorderedMatch) {
      if (inOrderedList) {
        htmlParts.push("</ol>");
        inOrderedList = false;
      }
      if (!inUnorderedList) {
        htmlParts.push("<ul>");
        inUnorderedList = true;
      }
      htmlParts.push(`<li>${parseInlineMarkdown(unorderedMatch[1])}</li>`);
      continue;
    }

    const orderedMatch = line.match(/^\d+[.)]\s+(.*)$/);
    if (orderedMatch) {
      if (inUnorderedList) {
        htmlParts.push("</ul>");
        inUnorderedList = false;
      }
      if (!inOrderedList) {
        htmlParts.push("<ol>");
        inOrderedList = true;
      }
      htmlParts.push(`<li>${parseInlineMarkdown(orderedMatch[1])}</li>`);
      continue;
    }

    closeLists();
    htmlParts.push(`<p>${parseInlineMarkdown(line)}</p>`);
  }

  closeLists();

  let html = htmlParts.join("");
  html = html.replace(/@@CODEBLOCK_(\d+)@@/g, (_m, indexStr) => {
    const index = Number(indexStr);
    const block = codeBlocks[index];
    if (!block) {
      return "";
    }
    const languageClass = block.lang ? ` class=\"language-${block.lang}\"` : "";
    return `<pre><code${languageClass}>${block.code}</code></pre>`;
  });

  return html || "<p>No response received.</p>";
}

function addMessage(text, type, extraClass = "") {
  const item = document.createElement("div");
  item.className = `message ${type} ${extraClass}`.trim();
  item.textContent = text;
  chatBox.appendChild(item);
  chatBox.scrollTop = chatBox.scrollHeight;
  return item;
}

function addBotMessage(markdownText) {
  const item = document.createElement("div");
  item.className = "message bot";
  item.innerHTML = markdownToHtml(markdownText);
  chatBox.appendChild(item);
  chatBox.scrollTop = chatBox.scrollHeight;
  return item;
}

function setTheme(themeName) {
  document.documentElement.setAttribute("data-theme", themeName);
  localStorage.setItem(THEME_STORAGE_KEY, themeName);
}

function loadTheme() {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  const theme = saved || "midnight";
  themeSelect.value = theme;
  setTheme(theme);
}

async function sendMessage(messageText) {
  const message = messageText.trim();
  if (!message) {
    return;
  }

  addMessage(message, "user");
  messageInput.value = "";
  sendBtn.disabled = true;

  const pending = addMessage("Thinking...", "bot", "loading");

  if (!CHAT_API_URL) {
    pending.remove();
    addBotMessage("### Backend Not Connected Yet\n\nYour frontend is live on GitHub Pages, but the backend API URL is not configured.\n\n1. Add the `EXPERT_HUB_API_URL` secret in GitHub Actions settings.\n2. Set it to your deployed backend endpoint, for example `https://your-backend-domain.com/chat`.\n3. Re-run the `Deploy Frontend to GitHub Pages` workflow.\n\nAfter that, chat will work normally.");
    sendBtn.disabled = false;
    messageInput.focus();
    return;
  }

  try {
    const res = await fetch(CHAT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, role: roleSelect.value })
    });

    if (!res.ok) {
      throw new Error(`Request failed (${res.status})`);
    }

    const data = await res.json();
    pending.remove();
    addBotMessage(data.reply || "No response received.");
  } catch (err) {
    pending.remove();
    addMessage("Unable to connect to the assistant right now. Please try again.", "bot");
    console.error(err);
  } finally {
    sendBtn.disabled = false;
    messageInput.focus();
  }
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(messageInput.value);
});

themeSelect.addEventListener("change", (event) => {
  setTheme(event.target.value);
});

loadTheme();
addMessage("Welcome. Select a role and start chatting.", "bot");