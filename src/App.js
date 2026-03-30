/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./App.css";

function App() {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState("Mumbai");
  const [resolvedLocation, setResolvedLocation] = useState("Mumbai, India");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const codeToWeather = (code) => {
    const mapping = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      56: "Light freezing drizzle",
      57: "Dense freezing drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      66: "Light freezing rain",
      67: "Heavy freezing rain",
      71: "Slight snow",
      73: "Moderate snow",
      75: "Heavy snow",
      77: "Snow grains",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      85: "Slight snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with hail",
      99: "Severe thunderstorm with hail",
    };

    return mapping[code] || "Unknown";
  };

  const iconForWeather = (code) => {
    const size = 28;
    const stroke = 2;
    switch (code) {
      case 0:
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="5" fill="#ffb800" />
            <g stroke="#ffb800" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="1" x2="12" y2="4" />
              <line x1="12" y1="20" x2="12" y2="23" />
              <line x1="1" y1="12" x2="4" y2="12" />
              <line x1="20" y1="12" x2="23" y2="12" />
              <line x1="4.2" y1="4.2" x2="6.4" y2="6.4" />
              <line x1="17.6" y1="17.6" x2="19.8" y2="19.8" />
            </g>
          </svg>
        );
      case 1:
      case 2:
      case 3:
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="13" cy="15" rx="6" ry="4" fill="#b5c6de" />
            <path d="M5 15c0 2.8 2.7 5 6 5 3.3 0 6-2.2 6-5" stroke="#e6ebf4" strokeWidth="2" />
            <path d="M9 9a4 4 0 1 1 8 0" stroke="#f9d36a" strokeWidth="2" />
          </svg>
        );
      case 45:
      case 48:
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 14h14" stroke="#cbd6e3" strokeWidth="2" strokeLinecap="round" />
            <path d="M3 18h18" stroke="#cbd6e3" strokeWidth="2" strokeLinecap="round" />
            <path d="M7 10h10" stroke="#cbd6e3" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      default:
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" fill="#7aa3cc" />
            <path d="M8 15l4-7 4 7" stroke="#fff" strokeWidth="2" fill="none" />
          </svg>
        );
    }
  };

  const getWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`
      );

      if (!geoRes.ok) {
        throw new Error(`Geocoding failed: ${geoRes.status}`);
      }

      const geoData = await geoRes.json();
      if (!geoData.results || !geoData.results.length) {
        throw new Error("Location not found. Try another query.");
      }

      const place = geoData.results[0];
      setResolvedLocation(`${place.name}, ${place.country}`);

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current_weather=true&timezone=auto`
      );

      if (!weatherRes.ok) {
        throw new Error(`Weather fetch failed: ${weatherRes.status}`);
      }

      const weatherData = await weatherRes.json();
      const current = weatherData.current_weather;
      if (!current) {
        throw new Error("Current weather data is unavailable.");
      }

      const condition = codeToWeather(current.weathercode);
      setWeather({ ...current, ...condition });
    } catch (e) {
      setError(e.message || "Unable to fetch weather data");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleString();
  };

  return (
    <div className="App">
      <header className="dashboard-header">
        <h1>Weather Dashboard</h1>
        <p>{resolvedLocation}</p>

        <div className="location-input-row">
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter City (e.g., London)"
            aria-label="Location"
          />
          <button className="btn-refresh" onClick={getWeather} disabled={loading}>
            {loading ? "Looking up..." : "Search Location"}
          </button>
        </div>
      </header>

      <main className="dashboard-grid">
        <section className="weather-card card-main">
          <h2>Current Conditions</h2>

          {error && <p className="error-text">{error}</p>}

          {!weather && !loading && !error && <p>Enter a location and click Search.</p>}

          {weather && (
            <div className="card-content">
              <div className="metric big">
                <div className="metric-icon">{iconForWeather(weather.weathercode)}</div>
                <span className="metric-value">{weather.temperature}°C</span>
                <small>{codeToWeather(weather.weathercode)}</small>
              </div>

              <div className="metric">
                <div className="metric-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.5 13.5l6.5-6.5 6.5 6.5" stroke="#63b3ff" strokeWidth="2" strokeLinecap="round" />
                    <path d="M11 17.5V7" stroke="#63b3ff" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="metric-value">{weather.windspeed} km/h</span>
                <small>Wind Speed</small>
              </div>

              <div className="metric">
                <div className="metric-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="9" stroke="#63b3ff" strokeWidth="2" />
                    <path d="M12 12l4-2" stroke="#63b3ff" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="metric-value">{weather.winddirection}°</span>
                <small>Wind Direction</small>
              </div>

              <div className="metric">
                <div className="metric-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6v6l3 1.5" stroke="#63b3ff" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="10" stroke="#63b3ff" strokeWidth="2" />
                  </svg>
                </div>
                <span className="metric-value">{formatTime(weather.time)}</span>
                <small>Last Updated</small>
              </div>

              <div className="metric">
                <div className="metric-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 17h18" stroke="#63b3ff" strokeWidth="2" strokeLinecap="round" />
                    <path d="M6 13l3 3 3-5 3 7 3-9" stroke="#63b3ff" strokeWidth="2" fill="none" />
                  </svg>
                </div>
                <span className="metric-value">{weather.temperature}°C</span>
                <small>Feels like</small>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
