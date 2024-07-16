import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWeather,
  fetchWeatherByCoords,
} from "../features/weather/weatherSlice";
import type { RootState, AppDispatch } from "../app/store";
import WeatherCard from "./WeatherCard";
import { AiOutlineSearch } from "react-icons/ai";

const debounce = (func: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const SearchWeather: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [cache, setCache] = useState<{ [key: string]: any }>({});
  const dispatch: AppDispatch = useDispatch();
  const weatherData = useSelector(
    (state: RootState) => state.weather.weatherData
  );
  const status = useSelector((state: RootState) => state.weather.status);
  const error = useSelector((state: RootState) => state.weather.error);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log({ latitude, longitude });
          dispatch(fetchWeatherByCoords({ lat: latitude, lon: longitude }));
        },
        (error) => {
          console.error("Error fetching geolocation:", error);
          // Fallback to a default location if geolocation fails
          dispatch(fetchWeather("London"));
        }
      );
    } else {
      // Fallback to a default location if geolocation is not available
      dispatch(fetchWeather("London"));
    }
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    debouncedFetchSuggestions(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query && cache[query]) {
      setSuggestions([]);
      dispatch(fetchWeather(query));
    } else if (query) {
      dispatch(fetchWeather(query));
    }
  };

  const fetchSuggestions = async (query: string) => {
    if (cache[query]) {
      setSuggestions(cache[query]);
    } else {
      try {
        const response = await fetch(`https://freetestapi.com/api/v1/weathers?search=${query}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        if (data.length === 0) {
          setSuggestions([]);
          return;
        }
        setSuggestions(data);
        setCache((prevCache) => ({ ...prevCache, [query]: data }));
      } catch (error) {
        // console.error(error.message);
      }
    }
  };

  const fetchAllData = async () => {
    if (cache["all"]) {
      setSuggestions(cache["all"]);
    } else {
      try {
        const response = await fetch(`https://freetestapi.com/api/v1/weathers`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setSuggestions(data);
        setCache((prevCache) => ({ ...prevCache, ["all"]: data }));
      } catch (error) {
        // console.error(error.message);
      }
    }
  };

  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 300), []);

  const handleSuggestionClick = (suggestion: any) => {
    console.log(suggestion?.city)
    setQuery(suggestion.city);
    setSuggestions([]);
    setShowSuggestions(false);
    dispatch(fetchWeather(suggestion.city));
  };

  const handleFocus = () => {
    if (!query) {
      fetchAllData();
    }
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 100); // Delay to allow click on suggestion
  };

  return (
    <div className="min-h-screen flex flex-col">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row mb-8 w-full max-w-6xl mx-auto relative"
      >
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="p-2 border rounded flex-1 mb-2 sm:mb-0 px-5"
          placeholder="Search by location or city"
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center pr-5 cursor-pointer"
        >
          <div className="absolute inset-y-0 right-0 pr-12 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm sm:leading-5">⎜</span>
          </div>
          <AiOutlineSearch
            className="text-gray-500 hover:text-gray-700"
            size={24}
          />
        </button>
      </form>

        {/* Suggestions List */}
      {/* {showSuggestions && suggestions.length === 0 && query && (
        <p className="absolute bg-white shadow-lg rounded-lg max-w-6xl mx-auto w-full  h-auto overflow-y-scroll text-left p-2 relative">No data found...</p>
      )} */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute bg-white shadow-lg rounded-lg  max-w-6xl mx-auto w-full  h-64 overflow-y-scroll relative">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="cursor-pointer p-2 hover:bg-gray-200"
            >
              {suggestion.city}, {suggestion.country}
            </li>
          ))}
        </ul>
      )}

      {/* Weather Cards */}
      {status === "loading" && (
        <p className="text-center text-white">Loading...</p>
      )}
      {status === "failed" && (
        <p className="text-center text-red-500">Error: {error}</p>
      )}
      {!showSuggestions && status === "succeeded" && weatherData && (
        <div className="w-full max-w-6xl mx-auto space-y-4">
          <WeatherCard weather={weatherData} />
        </div>
      )}
      {status === "succeeded" && !weatherData && (
        <p className="text-center text-white">No data found...</p>
      )}
    </div>
  );
};

export default SearchWeather;
