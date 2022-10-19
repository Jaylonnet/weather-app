import './css/style.css';
import SunnyImg from './images/sunny.jpg';

const searchField = document.querySelector('#search-field');
const searchBtn = document.querySelector('#search-btn');
const currentTempNode = document.querySelector('#current-temp p');
const feelsLikeNode = document.querySelector('#feels-like-temp p');
const humidityNode = document.querySelector('#humidity p');

searchField.addEventListener('focus', (e) => {
    e.target.classList.remove('shrink');
    e.target.classList.add('expand');
});

searchField.addEventListener('blur', (e) => {
    e.target.classList.remove('expand');
    e.target.classList.add('shrink');
});

function formatCelsius (value) {return value + '\u00B0c'}

function displayWeatherForCity (weather) {
    currentTempNode.textContent = formatCelsius(weather.currentTemp);
    feelsLikeNode.textContent = formatCelsius(weather.feelsLike);
    humidityNode.textContent = `${weather.humidity}%`;
};

function displayLoaders (nodes) {
    nodes.forEach((node) => {
        node.textContent = '';
        node.classList.add('loader')
    });
};

function removeLoaders (nodes) {
    nodes.forEach((node) => {
        node.classList.remove('loader')
    });
};

searchBtn.addEventListener('click', async function (event)  {

    const weather = await getWeather(searchField.value);
    displayLoaders([currentTempNode, feelsLikeNode, humidityNode]);
    displayWeatherForCity(weather);
    removeLoaders([currentTempNode, feelsLikeNode, humidityNode]);

});

async function getWeather(city) {
    const getCoords = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=6bfdc703d6037bd53b9a260e45933b38`, { mode: 'cors' })
    const coordsJson = await getCoords.json();
    let coords = {lat: coordsJson[0].lat, lon: coordsJson[0].lon}
    
    const getWeather = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=6bfdc703d6037bd53b9a260e45933b38`, { mode: 'cors' })
    const weatherJson = await getWeather.json();
    return {
        currentTemp: convertToCelsius(weatherJson.main.temp).toFixed(1),
        feelsLike: convertToCelsius(weatherJson.main.feels_like).toFixed(1),
        humidity: weatherJson.main.humidity,
        weatherDescription: weatherJson.weather[0].main,

    };
};

function convertToCelsius(value) {
    return value - 273.15;
}