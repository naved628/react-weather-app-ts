import React from 'react';
import { WeatherData } from '../features/weather/types';
import { WiDaySunny, WiHumidity, WiStrongWind, WiThermometer } from 'react-icons/wi';
import { MdDateRange } from 'react-icons/md';

interface WeatherCardProps {
  weather: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  return (
    <div className="bg-gray-800 text-white p-6 py-16 rounded-lg shadow-lg mb-4 flex items-center justify-evenly">
      <div >
      <h2 className="text-2xl mb-2">{weather.city}, {weather.country}</h2>
      <div className="flex items-center mb-4">
        <WiDaySunny className="text-yellow-300 text-3xl mr-2" />
        <p>{weather.weather_description}</p>
      </div>
      <div className="flex items-center mb-4">
        <WiThermometer className="text-red-500 text-3xl mr-2" />
        <p>Temperature: {weather.temperature}°C</p>
      </div>
      <div className="flex items-center mb-4">
        <WiHumidity className="text-blue-500 text-3xl mr-2" />
        <p>Humidity: {weather.humidity}%</p>
      </div>
      <div className="flex items-center mb-4">
        <WiStrongWind className="text-gray-500 text-3xl mr-2" />
        <p>Wind Speed: {weather.wind_speed} m/s</p>
      </div>
      </div>
      <div className="flex flex-col">
  <h2 className="text-2xl mb-2 text-center">Forecast</h2>
  <div className="flex flex-wrap justify-center space-x-2">
    {weather.forecast.map((f) => (
      <div
        key={f.date}
        className="bg-gray-700 p-4 rounded-lg mb-2 w-72 transform transition-all duration-300 hover:shadow-xl hover:bg-gray-600"
      >
        <div className="flex items-center mb-2">
          <MdDateRange className="text-yellow-300 text-2xl mr-2" />
          <p>{f.date}</p>
        </div>
        <div className="flex items-center mb-2">
          <WiDaySunny className="text-yellow-300 text-2xl mr-2" />
          <p>{f.weather_description}</p>
        </div>
        <div className="flex items-center mb-2">
          <WiThermometer className="text-red-500 text-2xl mr-2" />
          <p>Temperature: {f.temperature}°C</p>
        </div>
        <div className="flex items-center mb-2">
          <WiHumidity className="text-blue-500 text-2xl mr-2" />
          <p>Humidity: {f.humidity}%</p>
        </div>
        <div className="flex items-center mb-2">
          <WiStrongWind className="text-gray-500 text-2xl mr-2" />
          <p>Wind Speed: {f.wind_speed} m/s</p>
        </div>
      </div>
    ))}
  </div>
</div>


      </div>
  );
};

export default WeatherCard;
