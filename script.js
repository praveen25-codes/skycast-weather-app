/**
 * SkyCast – script.js
 * Premium Weather Dashboard
 *
 * Uses the Open-Meteo API (No API Key Required):
 *   • Geocoding: https://geocoding-api.open-meteo.com/v1/search
 *   • Forecast:  https://api.open-meteo.com/v1/forecast
 */

// ─────────────────────────────────────────────
// ⚙️  CONFIGURATION
// ─────────────────────────────────────────────
const CONFIG = {
  GEO_URL: 'https://geocoding-api.open-meteo.com/v1/search',
  WEATHER_URL: 'https://api.open-meteo.com/v1/forecast',
  DEFAULT_CITY: 'Chennai',
  MAX_RECENT_SEARCHES: 6,
  RECENT_SEARCHES_KEY: 'skycast_recent_searches',
};

// ─────────────────────────────────────────────
// 🔗  DOM REFERENCES
// ─────────────────────────────────────────────
const DOM = {
  body:              document.getElementById('app-body'),
  searchInput:       document.getElementById('city-input'),
  searchBtn:         document.getElementById('search-btn'),
  geoBtn:            document.getElementById('geolocation-btn'),
  errorBanner:       document.getElementById('error-banner'),
  errorTitle:        document.getElementById('error-title'),
  errorMsg:          document.getElementById('error-msg'),
  errorCloseBtn:     document.getElementById('error-close-btn'),
  loadingOverlay:    document.getElementById('loading-overlay'),
  weatherContent:    document.getElementById('weather-content'),
  welcomeState:      document.getElementById('welcome-state'),
  recentSearches:    document.getElementById('recent-searches'),
  recentList:        document.getElementById('recent-list'),
  clearRecentBtn:    document.getElementById('clear-recent-btn'),
  geoToast:          document.getElementById('geo-toast'),
  geoToastMsg:       document.getElementById('geo-toast-msg'),
  footerYear:        document.getElementById('footer-year'),

  // Current weather
  cityName:          document.getElementById('city-name'),
  countryName:       document.getElementById('country-name'),
  currentDatetime:   document.getElementById('current-datetime'),
  currentIcon:       document.getElementById('current-weather-icon'),
  weatherDesc:       document.getElementById('weather-desc'),
  currentTemp:       document.getElementById('current-temp'),
  feelsLike:         document.getElementById('feels-like'),

  // Details
  humidity:          document.getElementById('humidity'),
  humiditySub:       document.getElementById('humidity-sub'),
  windSpeed:         document.getElementById('wind-speed'),
  windDir:           document.getElementById('wind-dir'),
  visibility:        document.getElementById('visibility'),
  visibilitySub:     document.getElementById('visibility-sub'),
  pressure:          document.getElementById('pressure'),
  pressureSub:       document.getElementById('pressure-sub'),
  sunrise:           document.getElementById('sunrise'),
  sunset:            document.getElementById('sunset'),

  // Highlights
  uvValue:           document.getElementById('uv-value'),
  uvLabelText:       document.getElementById('uv-label-text'),
  uvFill:            document.getElementById('uv-fill'),
  uvMarker:          document.getElementById('uv-marker'),
  uvCircle:          document.getElementById('uv-circle'),
  windBig:           document.getElementById('wind-big'),
  compassNeedle:     document.getElementById('compass-needle'),
  windDirText:       document.getElementById('wind-dir-text'),
  humidityBig:       document.getElementById('humidity-big'),
  humidityFill:      document.getElementById('humidity-fill'),
  comfortText:       document.getElementById('comfort-text'),
  visibilityBig:     document.getElementById('visibility-big'),
  visibilityFill:    document.getElementById('visibility-fill'),
  visibilityText:    document.getElementById('visibility-text'),
  pressureBig:       document.getElementById('pressure-big'),
  pressureArcFill:   document.getElementById('pressure-arc-fill'),
  pressureNeedle:    document.getElementById('pressure-needle'),

  // Forecast
  forecastGrid:      document.getElementById('forecast-grid'),
};

/** All valid weather CSS class prefixes */
const WEATHER_CLASSES = ['clear', 'clouds', 'rain', 'drizzle', 'thunderstorm', 'snow', 'mist', 'fog', 'haze', 'night'];
const COMPASS_LABELS = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];

// ─────────────────────────────────────────────
// 🌤️  WEATHER CODE MAPPING (Open-Meteo WMO Codes)
// ─────────────────────────────────────────────
function getWeatherInfo(code, isDay = 1) {
  const daySuffix = isDay ? '-sun' : '-moon';
  const mapping = {
    0:  { desc: 'Clear Sky', icon: isDay ? 'fa-solid fa-sun' : 'fa-solid fa-moon', theme: 'clear' },
    1:  { desc: 'Mainly Clear', icon: `fa-solid fa-cloud${daySuffix}`, theme: 'clouds' },
    2:  { desc: 'Partly Cloudy', icon: `fa-solid fa-cloud${daySuffix}`, theme: 'clouds' },
    3:  { desc: 'Overcast', icon: 'fa-solid fa-cloud', theme: 'clouds' },
    45: { desc: 'Fog', icon: 'fa-solid fa-smog', theme: 'fog' },
    48: { desc: 'Depositing Rime Fog', icon: 'fa-solid fa-smog', theme: 'fog' },
    51: { desc: 'Light Drizzle', icon: 'fa-solid fa-cloud-rain', theme: 'drizzle' },
    53: { desc: 'Moderate Drizzle', icon: 'fa-solid fa-cloud-rain', theme: 'drizzle' },
    55: { desc: 'Dense Drizzle', icon: 'fa-solid fa-cloud-rain', theme: 'drizzle' },
    56: { desc: 'Light Freezing Drizzle', icon: 'fa-solid fa-cloud-meatball', theme: 'drizzle' },
    57: { desc: 'Dense Freezing Drizzle', icon: 'fa-solid fa-cloud-meatball', theme: 'drizzle' },
    61: { desc: 'Slight Rain', icon: 'fa-solid fa-cloud-rain', theme: 'rain' },
    63: { desc: 'Moderate Rain', icon: 'fa-solid fa-cloud-showers-heavy', theme: 'rain' },
    65: { desc: 'Heavy Rain', icon: 'fa-solid fa-cloud-showers-heavy', theme: 'rain' },
    66: { desc: 'Light Freezing Rain', icon: 'fa-solid fa-cloud-meatball', theme: 'rain' },
    67: { desc: 'Heavy Freezing Rain', icon: 'fa-solid fa-cloud-meatball', theme: 'rain' },
    71: { desc: 'Slight Snowfall', icon: 'fa-regular fa-snowflake', theme: 'snow' },
    73: { desc: 'Moderate Snowfall', icon: 'fa-regular fa-snowflake', theme: 'snow' },
    75: { desc: 'Heavy Snowfall', icon: 'fa-solid fa-snowflake', theme: 'snow' },
    77: { desc: 'Snow Grains', icon: 'fa-solid fa-snowflake', theme: 'snow' },
    80: { desc: 'Slight Rain Showers', icon: 'fa-solid fa-cloud-rain', theme: 'rain' },
    81: { desc: 'Moderate Rain Showers', icon: 'fa-solid fa-cloud-showers-heavy', theme: 'rain' },
    82: { desc: 'Violent Rain Showers', icon: 'fa-solid fa-cloud-showers-heavy', theme: 'rain' },
    85: { desc: 'Slight Snow Showers', icon: 'fa-regular fa-snowflake', theme: 'snow' },
    86: { desc: 'Heavy Snow Showers', icon: 'fa-solid fa-snowflake', theme: 'snow' },
    95: { desc: 'Thunderstorm', icon: 'fa-solid fa-cloud-bolt', theme: 'thunderstorm' },
    96: { desc: 'Thunderstorm with Hail', icon: 'fa-solid fa-cloud-bolt', theme: 'thunderstorm' },
    99: { desc: 'Heavy Thunderstorm with Hail', icon: 'fa-solid fa-cloud-bolt', theme: 'thunderstorm' }
  };
  return mapping[code] || { desc: 'Unknown', icon: 'fa-solid fa-cloud', theme: 'clouds' };
}

// ─────────────────────────────────────────────
// 🛠️  UTILITY FUNCTIONS
// ─────────────────────────────────────────────

function formatTime(isoString) {
  const date = new Date(isoString);
  let h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, '0');
  const period = h >= 12 ? 'PM' : 'AM';
  h = ((h % 12) || 12).toString().padStart(2, '0');
  return `${h}:${m} ${period}`;
}

function formatDate(isoString) {
  const date = new Date(isoString || Date.now());
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function getShortDay(isoString) {
  const date = new Date(isoString);
  const days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  return days[date.getDay()];
}

function metersToKm(meters) {
  return (meters / 1000).toFixed(1);
}

function degreesToCompass(degrees) {
  const index = Math.round(degrees / 22.5) % 16;
  return COMPASS_LABELS[index];
}

function humidityComfort(humidity) {
  if (humidity < 30) return 'Very dry air';
  if (humidity < 50) return 'Comfortable';
  if (humidity < 70) return 'Slightly humid';
  if (humidity < 85) return 'Very humid';
  return 'Extremely humid';
}

function visibilityText(km) {
  if (km >= 10) return 'Excellent clarity';
  if (km >= 6)  return 'Good visibility';
  if (km >= 3)  return 'Moderate visibility';
  if (km >= 1)  return 'Poor visibility';
  return 'Very poor visibility';
}

function pressureText(hpa) {
  if (hpa < 1000) return 'Low pressure';
  if (hpa < 1013) return 'Normal range';
  if (hpa < 1025) return 'High pressure';
  return 'Very high pressure';
}

function uvInfo(uv) {
  if (uv < 3)   return { label: 'Low',    color: '#4ade80', percentage: (uv / 12) * 100 };
  if (uv < 6)   return { label: 'Moderate', color: '#FACC15', percentage: (uv / 12) * 100 };
  if (uv < 8)   return { label: 'High',   color: '#fb923c', percentage: (uv / 12) * 100 };
  if (uv < 11)  return { label: 'V.High', color: '#ef4444', percentage: (uv / 12) * 100 };
  return { label: 'Extreme', color: '#a855f7', percentage: Math.min((uv / 12) * 100, 100) };
}

// ─────────────────────────────────────────────
// 🎨  UI STATE MANAGEMENT
// ─────────────────────────────────────────────

function showLoading() {
  DOM.loadingOverlay.hidden = false;
  DOM.weatherContent.hidden = true;
  DOM.welcomeState.hidden   = true;
  hideError();
}

function hideLoading() {
  DOM.loadingOverlay.hidden = true;
}

function showError(title, message) {
  DOM.errorTitle.textContent = title;
  DOM.errorMsg.textContent   = message;
  DOM.errorBanner.hidden     = false;
  DOM.loadingOverlay.hidden  = true;
  if (DOM.weatherContent.hidden) {
    DOM.welcomeState.hidden = false;
  }
}

function hideError() {
  DOM.errorBanner.hidden = true;
}

function showToast(message, duration = 4000) {
  DOM.geoToastMsg.textContent = message;
  DOM.geoToast.hidden = false;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { DOM.geoToast.classList.add('show'); });
  });
  setTimeout(() => {
    DOM.geoToast.classList.remove('show');
    setTimeout(() => { DOM.geoToast.hidden = true; }, 400);
  }, duration);
}

function updateBackground(theme, isNight) {
  WEATHER_CLASSES.forEach(cls => DOM.body.classList.remove(`weather-${cls}`));
  if (isNight) {
    DOM.body.classList.add('weather-night');
  } else {
    DOM.body.classList.add(`weather-${theme}`);
  }
}

// ─────────────────────────────────────────────
// 💾  RECENT SEARCHES (localStorage)
// ─────────────────────────────────────────────

function loadRecentSearches() {
  const searches = getRecentSearches();
  renderRecentSearches(searches);
}

function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem(CONFIG.RECENT_SEARCHES_KEY)) || [];
  } catch {
    return [];
  }
}

function saveRecentSearch(cityName) {
  if (!cityName) return;
  let searches = getRecentSearches();
  searches = searches.filter(s => s.toLowerCase() !== cityName.toLowerCase());
  searches.unshift(cityName);
  searches = searches.slice(0, CONFIG.MAX_RECENT_SEARCHES);
  localStorage.setItem(CONFIG.RECENT_SEARCHES_KEY, JSON.stringify(searches));
  renderRecentSearches(searches);
}

function clearRecentSearches() {
  localStorage.removeItem(CONFIG.RECENT_SEARCHES_KEY);
  renderRecentSearches([]);
}

function renderRecentSearches(searches) {
  const container = DOM.recentSearches;
  const list      = DOM.recentList;

  if (!searches || searches.length === 0) {
    container.hidden = true;
    return;
  }

  list.innerHTML = '';
  searches.forEach(city => {
    const li = document.createElement('li');
    li.className = 'recent-item';
    li.setAttribute('role', 'listitem');
    li.innerHTML = `<i class="fa-solid fa-clock-rotate-left" aria-hidden="true"></i> ${escapeHtml(city)}`;
    li.addEventListener('click', () => {
      DOM.searchInput.value = city;
      container.hidden = true;
      searchWeather(city);
    });
    list.appendChild(li);
  });

  container.hidden = false;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ─────────────────────────────────────────────
// 🌐  API CALLS & DISPLAY
// ─────────────────────────────────────────────

async function searchWeather(cityQuery) {
  const city = (cityQuery || DOM.searchInput.value).trim();
  if (!city) {
    showError('Empty Search', 'Please enter a city name to get the weather.');
    return;
  }

  showLoading();

  try {
    // 1. Geocoding
    const geoRes = await fetch(`${CONFIG.GEO_URL}?name=${encodeURIComponent(city)}&count=1`);
    if (!geoRes.ok) throw new Error('API_ERROR');
    const geoData = await geoRes.json();
    
    if (!geoData.results || geoData.results.length === 0) {
      throw new Error('CITY_NOT_FOUND');
    }
    
    const location = geoData.results[0];
    await fetchAndDisplayWeather(location.latitude, location.longitude, location.name, location.country, location.timezone);
    saveRecentSearch(location.name);

  } catch (err) {
    handleApiError(err);
  } finally {
    hideLoading();
  }
}

async function searchWeatherByCoords(lat, lon) {
  showLoading();
  try {
    // 1. Reverse Geocode via BigDataCloud free API
    const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    let cityName = 'Current Location';
    let countryName = '';
    
    if (geoRes.ok) {
      const geoData = await geoRes.json();
      cityName = geoData.city || geoData.locality || 'Current Location';
      countryName = geoData.countryName || '';
    }

    await fetchAndDisplayWeather(lat, lon, cityName, countryName, 'auto');
    saveRecentSearch(cityName);

  } catch (err) {
    handleApiError(err);
  } finally {
    hideLoading();
  }
}

async function fetchAndDisplayWeather(lat, lon, cityName, countryName, timezone) {
  const params = [
    `latitude=${lat}`,
    `longitude=${lon}`,
    `current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,visibility`,
    `daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max`,
    `timezone=${timezone || 'auto'}`
  ].join('&');

  const weatherRes = await fetch(`${CONFIG.WEATHER_URL}?${params}`);
  if (!weatherRes.ok) throw new Error('API_ERROR');
  
  const weatherData = await weatherRes.json();
  
  displayWeather(weatherData, cityName, countryName);
  
  // Show content
  DOM.weatherContent.hidden = true;
  DOM.welcomeState.hidden   = true;
  // Trigger reflow for animation
  void DOM.weatherContent.offsetWidth;
  DOM.weatherContent.hidden = false;
}

function displayWeather(data, cityName, countryName) {
  const current = data.current;
  const daily = data.daily;
  
  const isNight = current.is_day === 0;
  const weatherInfo = getWeatherInfo(current.weather_code, current.is_day);
  
  // ── Header & Main Card ──
  DOM.cityName.textContent       = cityName;
  DOM.countryName.textContent    = countryName;
  DOM.currentDatetime.textContent = formatDate(current.time);
  
  DOM.currentIcon.className      = `current-weather-icon ${weatherInfo.icon}`;
  DOM.weatherDesc.textContent    = weatherInfo.desc;
  
  DOM.currentTemp.textContent    = Math.round(current.temperature_2m);
  DOM.feelsLike.textContent      = Math.round(current.apparent_temperature);
  
  // ── Details Grid ──
  DOM.humidity.textContent     = `${current.relative_humidity_2m}%`;
  DOM.humiditySub.textContent  = humidityComfort(current.relative_humidity_2m);

  DOM.windSpeed.textContent    = `${current.wind_speed_10m.toFixed(1)} km/h`;
  DOM.windDir.textContent      = degreesToCompass(current.wind_direction_10m);

  const visKm = metersToKm(current.visibility || 10000);
  DOM.visibility.textContent   = `${visKm} km`;
  DOM.visibilitySub.textContent = visibilityText(parseFloat(visKm));

  DOM.pressure.textContent     = `${Math.round(current.surface_pressure)} hPa`;
  DOM.pressureSub.textContent  = pressureText(current.surface_pressure);

  DOM.sunrise.textContent      = formatTime(daily.sunrise[0]);
  DOM.sunset.textContent       = formatTime(daily.sunset[0]);

  // ── Highlights ──
  const uvIndex = daily.uv_index_max[0] || 0;
  const uv = uvInfo(uvIndex);
  DOM.uvValue.textContent     = uvIndex.toFixed(1);
  DOM.uvLabelText.textContent = uv.label;
  DOM.uvCircle.style.background = `conic-gradient(${uv.color} ${uv.percentage}%, var(--glass-bg) 0%)`;
  DOM.uvMarker.style.left     = `${Math.min(uv.percentage, 100)}%`;

  DOM.windBig.textContent     = current.wind_speed_10m.toFixed(1);
  DOM.compassNeedle.style.transform = `rotate(${current.wind_direction_10m}deg)`;
  DOM.windDirText.textContent = degreesToCompass(current.wind_direction_10m);

  DOM.humidityBig.textContent = current.relative_humidity_2m;
  DOM.humidityFill.style.width = `${current.relative_humidity_2m}%`;
  DOM.comfortText.textContent = humidityComfort(current.relative_humidity_2m);

  const visPct = Math.min((parseFloat(visKm) / 10) * 100, 100);
  DOM.visibilityBig.textContent = visKm;
  DOM.visibilityFill.style.width = `${visPct}%`;
  DOM.visibilityText.textContent = visibilityText(parseFloat(visKm));

  const hpa = current.surface_pressure;
  const arcPct = Math.max(0, Math.min(((hpa - 950) / 100) * 100, 100));
  const offset = 157 - (arcPct / 100) * 157;
  DOM.pressureBig.textContent = Math.round(hpa);
  DOM.pressureArcFill.style.strokeDashoffset = offset;
  const needleAngle = (arcPct / 100) * 180 - 90;
  DOM.pressureNeedle.style.transform = `rotate(${needleAngle}deg)`;

  // ── 5-Day Forecast ──
  DOM.forecastGrid.innerHTML = '';
  // Open-Meteo returns array of dates, min/max temps, etc.
  for (let i = 0; i < 5; i++) {
    const dayDate = daily.time[i];
    const isToday = i === 0;
    const dayLabel = isToday ? 'Today' : getShortDay(dayDate);
    
    const maxT = Math.round(daily.temperature_2m_max[i]);
    const minT = Math.round(daily.temperature_2m_min[i]);
    const dailyCode = daily.weather_code[i];
    const info = getWeatherInfo(dailyCode, 1);

    const card = document.createElement('article');
    card.className = `card glass forecast-card${isToday ? ' today' : ''}`;
    card.setAttribute('role', 'listitem');
    card.setAttribute('aria-label', `${dayLabel}: ${info.desc}, high ${maxT}°C, low ${minT}°C`);

    card.innerHTML = `
      <span class="forecast-day">${escapeHtml(dayLabel)}</span>
      <i class="${info.icon} forecast-icon" aria-hidden="true"></i>
      <p class="forecast-condition">${escapeHtml(info.desc)}</p>
      <div class="forecast-temps">
        <span class="forecast-max">${maxT}°</span>
        <span class="forecast-divider">/</span>
        <span class="forecast-min">${minT}°</span>
      </div>
    `;
    DOM.forecastGrid.appendChild(card);
  }

  // ── Background ──
  updateBackground(weatherInfo.theme, isNight);
}

function handleApiError(err) {
  const errorMap = {
    'CITY_NOT_FOUND': {
      title: 'City Not Found',
      msg:   'We couldn\'t find that city. Please check the spelling and try again.',
    },
    'API_ERROR': {
      title: 'Service Unavailable',
      msg:   'Unable to fetch weather data. Please try again.',
    },
    'NetworkError': {
      title: 'No Internet Connection',
      msg:   'Please check your internet connection and try again.',
    },
  };

  const errorType = err.message in errorMap ? err.message
    : err instanceof TypeError ? 'NetworkError'
    : 'API_ERROR';

  const mapped = errorMap[errorType] || errorMap['API_ERROR'];
  showError(mapped.title, mapped.msg);
}

// ─────────────────────────────────────────────
// 📍  GEOLOCATION
// ─────────────────────────────────────────────

function requestGeolocation() {
  if (!navigator.geolocation) {
    showToast('Geolocation is not supported by your browser.');
    return;
  }

  DOM.geoBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin" aria-hidden="true"></i>';
  DOM.geoBtn.disabled  = true;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      DOM.geoBtn.innerHTML = '<i class="fa-solid fa-location-crosshairs" aria-hidden="true"></i><span>My Location</span>';
      DOM.geoBtn.disabled  = false;
      const { latitude, longitude } = position.coords;
      searchWeatherByCoords(latitude, longitude);
    },
    (error) => {
      DOM.geoBtn.innerHTML = '<i class="fa-solid fa-location-crosshairs" aria-hidden="true"></i><span>My Location</span>';
      DOM.geoBtn.disabled  = false;
      showToast('Location permission was denied. Please search for a city instead.');
    },
    { timeout: 10000, maximumAge: 300000 }
  );
}

// ─────────────────────────────────────────────
// 🎛️  EVENT LISTENERS
// ─────────────────────────────────────────────

DOM.searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    DOM.recentSearches.hidden = true;
    searchWeather();
  }
});

DOM.searchBtn.addEventListener('click', () => {
  DOM.recentSearches.hidden = true;
  searchWeather();
});

DOM.geoBtn.addEventListener('click', requestGeolocation);
DOM.errorCloseBtn.addEventListener('click', hideError);
DOM.clearRecentBtn.addEventListener('click', clearRecentSearches);

DOM.searchInput.addEventListener('focus', () => {
  const searches = getRecentSearches();
  if (searches.length > 0) {
    renderRecentSearches(searches);
  }
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-wrapper')) {
    DOM.recentSearches.hidden = true;
  }
});

DOM.searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    DOM.recentSearches.hidden = true;
    DOM.searchInput.blur();
  }
});

// ─────────────────────────────────────────────
// 🚀  INITIALISATION
// ─────────────────────────────────────────────

function init() {
  DOM.footerYear.textContent = new Date().getFullYear();
  loadRecentSearches();
  
  // Default to Chennai, India on startup
  searchWeather(CONFIG.DEFAULT_CITY);
}

init();
