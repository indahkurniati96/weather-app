import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
    Sun,
    CloudSun,
    CloudRain,
    Star,
    StarOff,
    Search,
} from "lucide-react";

type WeatherCondition = "Sunny" | "Cloudy" | "Rainy";

type ForecastDay = {
    day: string;
    minTemp: number;
    maxTemp: number;
    condition: WeatherCondition;
};

type Weather = {
    temp: number;
    condition: WeatherCondition;
    humidity: number;
    windSpeed: number;
    feelsLike: number;
    forecast: ForecastDay[];
};

type WeatherData = {
    [key: string]: Weather;
};

const getConditionFromTemp = (temp: number): WeatherCondition => {
    if (temp >= 30) return "Sunny";
    if (temp >= 25) return "Cloudy";
    return "Rainy";
};

const generateForecast = (): ForecastDay[] => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    return days.map((day) => {
        const minTemp = Math.floor(Math.random() * 6) + 22;
        const maxTemp = minTemp + Math.floor(Math.random() * 6);
        return {
            day,
            minTemp,
            maxTemp,
            condition: getConditionFromTemp(maxTemp),
        };
    });
};

// Dummy 
const temperatureByCity: { [key: string]: number } = {
    Jakarta: 33,
    Tangerang: 28,
    Bandung: 24,
    Semarang: 27,
    Surabaya: 31,
    Yogyakarta: 26,
    Bali: 30,
    Medan: 29,
    Makassar: 24,
};

const countryByCity: { [key: string]: string } = {
    Jakarta: "Indonesia",
    Tangerang: "Indonesia",
    Bandung: "Indonesia",
    Semarang: "Indonesia",
    Surabaya: "Indonesia",
    Yogyakarta: "Indonesia",
    Bali: "Indonesia",
    Medan: "Indonesia",
    Makassar: "Indonesia",
};

const WeatherIcon: React.FC<{ condition: WeatherCondition }> = ({ condition }) => {
    switch (condition) {
        case "Sunny":
            return <Sun style={{ color: "#FFD700" }} className="w-20 h-20" />;
        case "Cloudy":
            return <CloudSun style={{ color: "#9CA3AF" }} className="w-20 h-20" />;
        case "Rainy":
            return <CloudRain style={{ color: "#3B82F6" }} className="w-20 h-20" />;
        default:
            return null;
    }
};

const ForecastIcon: React.FC<{ condition: WeatherCondition }> = ({ condition }) => {
    switch (condition) {
        case "Sunny":
            return <Sun style={{ color: "#FFD700" }} className="w-8 h-8" />;
        case "Cloudy":
            return <CloudSun style={{ color: "#9CA3AF" }} className="w-8 h-8" />;
        case "Rainy":
            return <CloudRain style={{ color: "#3B82F6" }} className="w-8 h-8" />;
        default:
            return null;
    }
};

export default function WeatherApp() {
    const [weatherData, setWeatherData] = useState<WeatherData>({});
    const [searchCity, setSearchCity] = useState("");
    const [selectedWeather, setSelectedWeather] = useState<Weather | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [greeting, setGreeting] = useState("Good Morning");

    const updateGreeting = () => {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 12) {
            setGreeting("Good Morning");
        } else if (hour >= 12 && hour < 17) {
            setGreeting("Good Afternoon");
        } else if (hour >= 17 && hour < 21) {
            setGreeting("Good Evening");
        } else {
            setGreeting("Good Night");
        }
    };

    useEffect(() => {
        updateGreeting();
    }, []);
    useEffect(() => {
        const generatedData: WeatherData = Object.fromEntries(
            Object.entries(temperatureByCity).map(([city, temp]) => {
                const humidity = Math.floor(Math.random() * 50) + 30; 
                const windSpeed = Math.floor(Math.random() * 10) + 1;
                const feelsLike = temp - Math.random() * 3;

                return [
                    city,
                    {
                        temp,
                        condition: getConditionFromTemp(temp),
                        humidity,
                        windSpeed,
                        feelsLike,
                        forecast: generateForecast(),
                    },
                ];
            })
        );
        setWeatherData(generatedData);
    }, []);

    useEffect(() => {
        const storedFavorites = localStorage.getItem("favorites");
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const city = e.target.value;
        setSearchCity(city);

        const matchedCity = Object.keys(weatherData).find(
            (c) => c.toLowerCase() === city.toLowerCase()
        );

        if (matchedCity) {
            setSelectedWeather(weatherData[matchedCity]);
        } else {
            setSelectedWeather(null);
        }
    };

    const handleToggleFavorite = () => {
        const city = Object.keys(weatherData).find(
            (c) => c.toLowerCase() === searchCity.toLowerCase()
        );
        if (!city) return;

        setFavorites((prev) =>
            prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
        );
    };

    const isFavorite = favorites.includes(
        Object.keys(weatherData).find((c) => c.toLowerCase() === searchCity.toLowerCase()) || ""
    );

    function capitalizeFirstLetter(str: string) {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    if (Object.keys(weatherData).length === 0) {
        return <p className="text-gray-500">Loading weather data...</p>;
    }

    return (
        <div className="p-8">
            <div className="bg-[#04518d] px-4 py-6 rounded-md mb-6">
                <h1 className="text-2xl text-[#FFFFFF] mb-4">{greeting}, INDAH</h1>
                <div className="flex items-center justify-between bg-[#FFFFFF] mt-2 p-3 rounded-md mb-3">
                    <div className="flex items-center gap-2 text-white">
                        <WeatherIcon condition={weatherData["Tangerang"].condition} />
                        <div>
                            <p className="text-lg font-semibold">Tangerang</p>
                            <h5 className="text-xl mt-1">
                                <strong>{weatherData["Tangerang"].temp}°C</strong>
                            </h5>
                            <p className="text-md mt-1">
                                {weatherData["Tangerang"].condition}
                            </p>

                            <div className="flex gap-4 mt-2 text-sm sm:block sm:space-y-2">
                                <div>
                                    <strong>Humidity:</strong> {weatherData["Tangerang"].humidity}%
                                </div>
                                <div>
                                    <strong>Wind Speed:</strong> {weatherData["Tangerang"].windSpeed} km/h
                                </div>
                                <div>
                                    <strong>Feels Like:</strong> {weatherData["Tangerang"].feelsLike.toFixed(1)}°C
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <Input
                        placeholder="Search for a city (e.g., Jakarta)"
                        value={searchCity}
                        onChange={handleInputChange}
                        className="w-full pr-10"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
            </div >

            {
                selectedWeather ? (
                    <div className="mb-6 border p-6 rounded-lg" >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-4 text-lg">
                                <WeatherIcon condition={selectedWeather.condition} />
                                <div>
                                    <strong>{capitalizeFirstLetter(searchCity)}</strong>
                                    <p className="text-sm text-gray-600">
                                        {countryByCity[capitalizeFirstLetter(searchCity)] || ""}
                                    </p>

                                    <div className="flex items-center gap-2 mt-1">
                                        <h5 className="text-xl">
                                            <strong>{selectedWeather.temp.toFixed(1)}°C</strong>
                                        </h5>
                                        <p className="text-md">
                                            {selectedWeather.condition}
                                        </p>
                                    </div>

                                    <div className="flex gap-4 mt-2 text-sm sm:block sm:space-y-2">
                                        <div>
                                            <strong>Humidity:</strong> {selectedWeather.humidity.toFixed(0)}%
                                        </div>
                                        <div>
                                            <strong>Wind Speed:</strong> {selectedWeather.windSpeed.toFixed(1)} km/h
                                        </div>
                                        <div>
                                            <strong>Feels Like:</strong> {selectedWeather.feelsLike.toFixed(1)}°C
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button onClick={handleToggleFavorite}>
                                {isFavorite ? (
                                    <Star className="w-6 h-6 text-[#FFD700]" />
                                ) : (
                                    <StarOff className="w-6 h-6 text-gray-400" />
                                )}
                            </button>
                        </div>

                        <div className="grid grid-cols-5 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 xs:grid-cols-1 gap-4 mt-4 ">
                            {selectedWeather.forecast.map((day) => (
                                <div
                                    key={day.day}
                                    className="flex flex-col items-center gap-1 border rounded-md p-2 text-sm"
                                >
                                    <p>{day.day}</p>
                                    <ForecastIcon condition={day.condition} />
                                    <p>
                                        {day.minTemp}°C / {day.maxTemp}°C
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    searchCity && (
                        <p className="text-center text-md text-gray-600 mt-6">
                            City not found. Please try another city.
                        </p>
                    )
                )
            }
            {
                favorites.length > 0 && (
                    <div>
                        <h2 className="text-lg mb-2 font-semibold">Favorites</h2>
                        <div className="space-y-4">
                            {favorites.map((city) => {
                                const weather = weatherData[city];
                                if (!weather) return null;

                                const handleRemoveFavorite = () => {
                                    setFavorites((prev) => prev.filter((c) => c !== city));
                                };

                                return (
                                    <div
                                        key={city}
                                        className="border rounded-md p-4 flex flex-col gap-4 bg-white"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 text-lg">
                                                <WeatherIcon condition={weather.condition} />
                                                <div>
                                                    <strong>{city}</strong>
                                                    <p className="text-sm text-gray-600">
                                                        {countryByCity[city] || ""}
                                                    </p>

                                                    <div className="flex items-center gap-2 mt-1">
                                                        <h5 className="text-xl">
                                                            <strong> {weather.temp.toFixed(1)}°C</strong>
                                                        </h5>
                                                        <p className="text-md">
                                                            {weather.condition}
                                                        </p>
                                                    </div>

                                                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                                        <div>
                                                            <strong>Humidity:</strong> {weather.humidity.toFixed(0)}%
                                                        </div>
                                                        <div>
                                                            <strong>Wind Speed:</strong> {weather.windSpeed.toFixed(1)} km/h
                                                        </div>
                                                        <div>
                                                            <strong>Feels Like:</strong> {weather.feelsLike.toFixed(1)}°C
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <button onClick={handleRemoveFavorite} aria-label={`Remove ${city} from favorites`}>
                                                <Star className="w-6 h-6 text-[#FFD700] transition-colors" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-5 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 xs:grid-cols-1 gap-4 mt-4">
                                            {weather.forecast.map((day) => (
                                                <div
                                                    key={day.day}
                                                    className="flex flex-col items-center gap-1 border rounded-md p-2 text-sm"
                                                >
                                                    <p>{day.day}</p>
                                                    <ForecastIcon condition={day.condition} />
                                                    <h5>
                                                        {day.minTemp}°C / {day.maxTemp}°C
                                                    </h5>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )
            }

        </div >
    );
}
