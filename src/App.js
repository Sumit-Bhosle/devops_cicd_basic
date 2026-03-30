import React, { useState } from "react";

function App() {
  const [temp, setTemp] = useState(null); // State to hold the temperature value

  const getWeather = async () => {
    // async function to fetch weather data
    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=19.07&longitude=72.87&current_weather=true",
    ); // Fetching weather data for Mumbai
    
    const data = await res.json(); // parsing the response to JSON
    setTemp(data.current_weather.temperature); // Updating the state with the fetched temperature
  };

  return (
    <div className="AppTitle">
      <h1>Weather App</h1>
      <button onClick={getWeather}>Get Weather</button>
      {temp && <h2>Temperature: {temp}°C</h2>}
    </div>
  );
}

export default App;
