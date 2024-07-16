import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { WeatherData, WeatherError } from './types';

export interface WeatherState {
  weatherData: WeatherData | null;
  weatherList: WeatherData[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: WeatherState = {
  weatherData: null,
  weatherList: [],
  status: 'idle',
  error: null,
};

// Thunk to fetch weather by coordinates
export const fetchWeatherByCoords = createAsyncThunk<
  WeatherData,
  { lat: number; lon: number },
  { rejectValue: WeatherError }
>(
  'weather/fetchWeatherByCoords',
  async ({ lat, lon }, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://freetestapi.com/api/v1/weathers?lat=${lat}&lon=${lon}`);
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue({ message: errorData.message });
      }
      const data = await response.json();
      return data[0] as WeatherData; // Assuming the API returns an array and we need the first element
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue({ message: err.message });
      } else {
        return rejectWithValue({ message: 'An unknown error occurred' });
      }
    }
  }
);

// Thunk to search weathers by city name
export const fetchWeather = createAsyncThunk<
  WeatherData,
  string,
  { rejectValue: WeatherError }
>(
  'weather/fetchWeather',
  async (query, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://freetestapi.com/api/v1/weathers?search=${query}`);
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue({ message: errorData.message });
      }
      const data = await response.json();
      return data[0] as WeatherData; // Assuming the API returns an array and we need the first element
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue({ message: err.message });
      } else {
        return rejectWithValue({ message: 'An unknown error occurred' });
      }
    }
  }
);

// Define the slice
const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherByCoords.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWeatherByCoords.fulfilled, (state, action: PayloadAction<WeatherData>) => {
        state.status = 'succeeded';
        state.weatherData = action.payload;
      })
      .addCase(fetchWeatherByCoords.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch weather';
      })
      .addCase(fetchWeather.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWeather.fulfilled, (state, action: PayloadAction<WeatherData>) => {
        state.status = 'succeeded';
        state.weatherData = action.payload;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch weather';
      });
  },
});

export default weatherSlice.reducer;
