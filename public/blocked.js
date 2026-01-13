// Historical quotes on self-restraint and discipline
const QUOTES = [
  { text: "It is not that we have a short time to live, but that we waste a lot of it.", author: "Seneca" },
  { text: "You have power over your mind - not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
  { text: "The first and best victory is to conquer self.", author: "Plato" },
  { text: "He who conquers himself is the mightiest warrior.", author: "Confucius" },
  { text: "Self-command is the main elegance.", author: "Ralph Waldo Emerson" },
  { text: "We must all suffer one of two things: the pain of discipline or the pain of regret.", author: "Jim Rohn" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "Rule your mind or it will rule you.", author: "Horace" }
];

const params = new URLSearchParams(window.location.search);
const domain = params.get("domain");
const limitRaw = params.get("limit");

// Display a random quote
const quoteIndex = Math.floor(Math.random() * QUOTES.length);
const quote = QUOTES[quoteIndex];

const container = document.querySelector(".container");
const quoteContainer = document.createElement("div");
quoteContainer.className = "quote-container";
quoteContainer.innerHTML = `
  <p class="quote-text">"${quote.text}"</p>
  <p class="quote-author">— ${quote.author}</p>
`;
container.appendChild(quoteContainer);

// Valid themes map (simplified from utils/themes.ts)
const THEME_COLORS = {
  "red-500": "0 84.2% 60.2%",
  "orange-500": "24.6 95% 53.1%",
  "amber-500": "45.4 93.4% 47.5%",
  "yellow-500": "47.9 95.8% 53.1%",
  "lime-500": "84.8 85.2% 51.4%",
  "green-500": "142.1 76.2% 36.3%",
  "emerald-500": "160.1 84.1% 39.4%",
  "teal-500": "173.4 80.4% 40%",
  "cyan-500": "188.7 94.5% 42.7%",
  "sky-500": "198.6 88.7% 48.4%",
  "blue-500": "217.2 91.2% 59.8%",
  "indigo-500": "238.7 83.5% 66.7%",
  "violet-500": "258.3 89.5% 66.3%",
  "purple-500": "271.5 81.3% 55.9%",
  "fuchsia-500": "292.2 84.1% 60.6%",
  "pink-500": "330.4 81.2% 60.4%",
  "rose-500": "349.7 79.2% 59.8%",
};

const setDefaultColor = () => {
  const icon = document.querySelector(".icon svg");
  if (icon) icon.style.color = "#ef4444";
};

chrome.storage.local.get("settings", (result) => {
  try {
    const themeId = result?.settings?.theme;
    if (themeId && THEME_COLORS[themeId]) {
      const hsl = THEME_COLORS[themeId];
      const icon = document.querySelector(".icon svg");
      if (icon) icon.style.color = `hsl(${hsl})`;
    } else {
      console.log("No theme found or invalid, staying default");
      setDefaultColor();
    }
  } catch (e) {
    console.error("Failed to load theme", e);
    setDefaultColor();
  }
});

// Domain display removed as per user request
// if (domain) { ... }

if (limitRaw) {
  const ms = parseInt(limitRaw);
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));

  let timeString = "";
  if (hours > 0) timeString += `${hours}h `;
  if (minutes > 0 || hours > 0) timeString += `${minutes}m `;
  if (seconds > 0 && hours === 0) timeString += `${seconds}s`;

  if (!timeString) timeString = "0m";

  const textP = document.querySelector("p:not(.domain-badge)");
  if (textP) {
    textP.innerHTML = `You have reached your daily limit of <span id="limit-text" style="color: #fff; font-weight: bold;">${timeString.trim()}</span>.`;
  }
}
