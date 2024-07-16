// src/features/weather/types.ts
export interface Forecast {
    date: string;
    temperature: number;
    weather_description: string;
    humidity: number;
    wind_speed: number;
  }
  
  export interface WeatherData {
    id: number;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    temperature: number;
    weather_description: string;
    humidity: number;
    wind_speed: number;
    forecast: Forecast[];
  }
  
  export interface WeatherError {
    message: string;
  }
  