# SkyCast – Premium Weather Dashboard

![SkyCast Banner](assets/screenshots/banner.png)

> A modern, fully responsive weather dashboard built with pure HTML, CSS, and JavaScript — no frameworks, no dependencies. Designed to showcase strong web fundamentals and portfolio-quality UI skills.

---

## 🌤️ Live Demo

> Open `index.html` in your browser after adding your API key (see [Setup](#️-setup--api-key-configuration) below).

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔍 **City Search** | Search any city worldwide with instant validation |
| 📍 **Geolocation** | "Use My Location" button for automatic weather |
| 🌡️ **Current Weather** | Temperature, feels-like, condition, icon |
| 💧 **Weather Details** | Humidity, wind speed & direction, visibility, pressure, sunrise, sunset |
| ⭐ **Today's Highlights** | UV index, wind compass, humidity bar, visibility bar, pressure arc gauge |
| 📅 **5-Day Forecast** | Daily forecast cards with high/low temperatures |
| 🎨 **Dynamic Backgrounds** | Background gradient changes per weather condition & day/night |
| 🕒 **Recent Searches** | Remembers last 6 cities using localStorage |
| ⏳ **Loading State** | Animated spinner + skeleton cards |
| ❌ **Error Handling** | Friendly messages for invalid city, no internet, bad API key |
| 📱 **Fully Responsive** | Tested at 320px → 1440px |
| ♿ **Accessible** | Semantic HTML, ARIA labels, keyboard navigation, focus states |

---

## 🎨 Design System

- **Glassmorphism** cards with backdrop-filter blur
- **Dynamic gradient backgrounds** reflecting weather and time of day:
  - ☀️ Clear → Bright blue sky gradient
  - ☁️ Cloudy → Cool slate gradient
  - 🌧️ Rain → Deep blue-grey gradient
  - ⛈️ Thunderstorm → Dramatic dark gradient
  - ❄️ Snow → Icy light blue gradient
  - 🌙 Night → Deep purple-blue gradient
- **CSS Variables** for a maintainable design token system
- **Smooth CSS animations** — floating icons, shimmer skeleton, compass needle
- **Google Fonts** — Outfit + Inter
- **Font Awesome 6** icons

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic structure, accessibility (ARIA) |
| **CSS3** | Glassmorphism, CSS variables, animations, responsive grid |
| **Vanilla JavaScript (ES6+)** | API calls, DOM manipulation, localStorage, async/await |
| **OpenWeatherMap API** | Real-time weather, 5-day forecast, UV index |
| **Fetch API** | HTTP requests |
| **Browser Geolocation API** | GPS-based weather |
| **localStorage** | Recent searches persistence |
| **Google Fonts** | Outfit, Inter |
| **Font Awesome 6** | Weather & UI icons |

---

## 🔧 Setup & API Key Configuration

### Step 1 — Get a Free API Key

1. Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. Click **Sign Up** (it's free)
3. After signing in, go to **API Keys** in your account dashboard
4. Copy your default API key (or generate a new one)
5. ⚠️ **New keys take ~2 hours to activate**

### Step 2 — Add Your API Key

Open **`script.js`** and find this section near the top:

```javascript
const CONFIG = {
  API_KEY: 'YOUR_API_KEY_HERE',  // ← Replace this
  ...
};
```

Replace `'YOUR_API_KEY_HERE'` with your actual key:

```javascript
const CONFIG = {
  API_KEY: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4',  // ✅ Your real key
  ...
};
```

### Step 3 — Run Locally

Simply open `index.html` in any modern browser:

```bash
# Option 1: Double-click index.html in your file explorer

# Option 2: Use VS Code Live Server extension
# Right-click index.html → "Open with Live Server"

# Option 3: Python simple server
python -m http.server 8080
# Then open http://localhost:8080
```

> **Note:** The app works by opening `index.html` directly in a browser — no Node.js or build tools required.

---

## 🔐 API Key Security Note

This app uses a **client-side API key** embedded in JavaScript. This is **acceptable for:**
- Personal portfolio projects
- Local development and testing
- GitHub portfolio showcasing

For a **production application**, you should:
- Create a **backend proxy server** (Node.js/Express, Python Flask, etc.)
- Keep the API key in a `.env` file on the server
- Your frontend calls your backend, which calls OpenWeatherMap
- This prevents key exposure and allows rate limiting

---

## 📁 Project Structure

```
skycast/
├── index.html          # Main HTML structure (semantic, accessible)
├── style.css           # All styles (CSS variables, glassmorphism, animations)
├── script.js           # All JavaScript (API, DOM, localStorage, geolocation)
├── README.md           # This file
└── assets/
    └── screenshots/    # Screenshots for portfolio/README
```

---

## 🧪 Testing All Features

### Manual Test Checklist

| Test | How to Test |
|---|---|
| ✅ City search | Type "London" → press Enter or click Search |
| ✅ Enter key | Type city → press Enter |
| ✅ Invalid city | Type "xyznotacity" → see friendly error |
| ✅ Empty search | Click Search with empty input → see error |
| ✅ Geolocation | Click "My Location" → allow/deny permission |
| ✅ Recent searches | Search 2+ cities → see history dropdown |
| ✅ Clear recent | Click × in recent searches dropdown |
| ✅ Forecast cards | Verify 5 days shown with icons/temps |
| ✅ Loading state | Observe spinner + skeleton on each search |
| ✅ Background change | Compare clear vs rainy city backgrounds |
| ✅ Responsive | Resize browser from 320px → 1440px |
| ✅ Night mode | Search a city where it's currently night |
| ✅ UV index gauge | Check the circular UV display |
| ✅ Compass | Observe needle direction for wind |
| ✅ Pressure arc | Check the SVG arc gauge |

### Sample Test Cities

| City | Expected Weather Type |
|---|---|
| Mumbai | Humid, possibly rainy |
| London | Often cloudy/rainy |
| Dubai | Clear, hot |
| Reykjavik | Cloudy/cold |
| Sydney | Usually clear |

---

## 💡 JavaScript Skills Demonstrated

This project showcases the following JS concepts:

| Concept | Where Used |
|---|---|
| `async/await` | `fetchWeatherByCity()`, `searchWeather()` |
| `Promise.all()` | Parallel API calls (current + forecast) |
| `fetch()` API | All HTTP requests |
| `try/catch` | Error handling for API and network failures |
| `localStorage` | `saveRecentSearch()`, `loadRecentSearches()` |
| DOM Manipulation | `displayCurrentWeather()`, `displayForecast()` |
| Event Listeners | Search, geolocation, keyboard events |
| Geolocation API | `navigator.geolocation.getCurrentPosition()` |
| Template Literals | Dynamic HTML generation |
| Array methods | `.map()`, `.filter()`, `.find()`, `.forEach()` |
| `Map` data structure | Grouping forecast data by day |
| Modular functions | 20+ single-responsibility functions |
| ES6 destructuring | `const { name, sys, main } = data;` |
| Spread operator | `Math.max(...items.map(...))` |

---

## 🚀 Future Improvements

Here's how you could enhance this project further:

- [ ] **°F / °C Toggle** — unit switcher button
- [ ] **Hourly Forecast** — 24-hour timeline chart
- [ ] **Weather Map** — embedded OpenWeatherMap tile layer
- [ ] **Air Quality Index** — using OWM Air Pollution API
- [ ] **PWA** — Add a service worker + manifest.json for offline capability
- [ ] **Dark/Light Mode Toggle** — manual theme override
- [ ] **Animated Weather Backgrounds** — CSS particle rain/snow effects
- [ ] **Weather Alerts** — Display OWM alerts/warnings
- [ ] **Multiple Cities** — Dashboard with multiple city widgets
- [ ] **Charts** — Temperature trend line chart with Chart.js
- [ ] **Backend Proxy** — Node.js proxy to secure the API key
- [ ] **Favourites** — Star cities to quick-access
- [ ] **Shareable URL** — `?city=London` query param support

---

## 📸 Screenshots

> *Add your screenshots to `assets/screenshots/` and link them here*

| Desktop | Mobile |
|---|---|
| ![Desktop](assets/screenshots/desktop.png) | ![Mobile](assets/screenshots/mobile.png) |

---

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)
- Portfolio: [yourportfolio.com](https://yourportfolio.com)

---

## 📄 Skills Demonstrated

`HTML5` `CSS3` `JavaScript (ES6+)` `REST API` `Fetch API` `Async/Await`
`DOM Manipulation` `Responsive Web Design` `CSS Animations` `Glassmorphism`
`LocalStorage` `Browser Geolocation API` `Accessibility (ARIA)` `Git/GitHub`

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

*Built with ❤️ using pure HTML, CSS, and JavaScript — no frameworks needed.*
