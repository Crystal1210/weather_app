import React, { useState, useEffect } from 'react';
import './WeatherApp.css';

// Import your icons here...
import search_icon from "../Assets/search.png";
import clear_icon from "../Assets/clear.png";
import cloud_icon from "../Assets/cloud.png";
import drizzle_icon from "../Assets/drizzle.png";
import humidity_icon from "../Assets/humidity.png";
import rain_icon from "../Assets/rain.png";
import snow_icon from "../Assets/snow.png";
import wind_icon from "../Assets/wind.png";

const WeatherApp = () => {
    const api_key = process.env.REACT_APP_OPEN_WEATHER_MAP_API_KEY;
    console.log('API Key:', api_key); 
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState({
        temp: 'Loading...',
        city: 'Fetching location...',
        humidity: '...',
        wind: '...',
        icon: cloud_icon, // Default icon
    });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(success, error);

        function success(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            fetchWeatherDataByCoords(latitude, longitude);
        }

        function error() {
            alert("Unable to retrieve your location. Using default location.");
            // Optionally, fetch weather for a default location or handle differently
        }
    }, []);

    const fetchWeatherDataByCoords = async (lat, lon) => {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=Metric&appid=${api_key}`;
        await fetchWeatherData(url);
    };

    const fetchWeatherDataByCity = async (cityName) => {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=Metric&appid=${api_key}`;
        await fetchWeatherData(url);
    };

    const fetchWeatherData = async (url) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.cod === "404") {
                alert("City not found. Please try again.");
                return;
            }
            updateWeatherState(data);
        } catch (error) {
            console.error("Failed to fetch weather data:", error);
            alert("Failed to fetch weather data.");
        }
    };

    const updateWeatherState = (data) => {
        setWeatherData({
            temp: `${data.main.temp} °C`,
            city: data.name,
            humidity: `${data.main.humidity} %`,
            wind: `${data.wind.speed} km/h`,
            icon: getWeatherIcon(data.weather[0].icon),
        });
    };

    const getWeatherIcon = (iconCode) => {
        switch (iconCode) {
            case "01d":
            case "01n":
                return clear_icon;
            case "02d":
            case "02n":
            case "03d":
            case "03n":
            case "04d":
            case "04n":
                return cloud_icon;
            case "09d":
            case "09n":
            case "10d":
            case "10n":
                return rain_icon;
            case "13d":
            case "13n":
                return snow_icon;
            default:
                return cloud_icon; // Default icon if not matched
        }
    };

    const handleSearch = () => {
        fetchWeatherDataByCity(city);
    };

    return (
        <div className='container'>
            <div className="top-bar">
                <input type="text"
                       className="cityInput"
                       placeholder='Enter city name'
                       value={city}
                       onChange={(e) => setCity(e.target.value)}
                       onKeyPress={(e) => { if (e.key === 'Enter') { handleSearch(); } }} />
                <div className="search-icon" onClick={handleSearch}>
                    <img src={search_icon} alt="Search" />
                </div>
            </div>
            <div className="weather-image">
                <img src={weatherData.icon} alt="Weather Icon" />
            </div>
            <div className="weather-temp">{weatherData.temp}</div>
            <div className="weather-location">{weatherData.city}</div>
            <div className="data-container">
                <div className="element">
                    <img src={humidity_icon} alt="Humidity Icon" className="icon" />
                    <div className="data">
                        <div className="humidity-percent">{weatherData.humidity}</div>
                        <div className="text">Humidity</div>
                    </div>
                </div>
                <div className="element">
                    <img src={wind_icon} alt="Wind Icon" className="icon" />
                    <div className="data">
                        <div className="wind-rate">{weatherData.wind}</div>
                        <div className="text">Wind Speed</div>
                    </div>
                </div>
            </div>
            <div className="footnote">
                <h3>Created by: Crystal Jane Roche</h3>
            </div>
        </div>
    );
};

export default WeatherApp;
