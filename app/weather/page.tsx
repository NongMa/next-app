'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface WeatherData {
  city: string;
  FeelsLikeC: string;
  temp_C: string;
  temp_F: string;
  observation_time: string;
  localObsDateTime?: string;
  precipMM: string;
  weatherDesc: string;
  humidity: string;
  pressure: string;
  visibility: string;
  winddir16Point: string;
  windspeedKmph: string;
  windspeedMiles: string;
}

const COMMON_CITIES = [
  { name: '北京', value: 'Beijing' },
  { name: '上海', value: 'Shanghai' },
  { name: '广州', value: 'Guangzhou' },
  { name: '深圳', value: 'Shenzhen' },
  { name: '杭州', value: 'Hangzhou' },
  { name: '武汉', value: 'Wuhan' },
  { name: '成都', value: 'Chengdu' },
  { name: '西安', value: 'Xian' },
  { name: '南京', value: 'Nanjing' },
  { name: '重庆', value: 'Chongqing' },
];

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string>('Shenzhen');
  const [customCity, setCustomCity] = useState<string>('');

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(cityName)}`);
      const result = await response.json();
      
      if (result.success) {
        setWeather(result.data);
      } else {
        setError(result.error || '获取天气数据失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error('Failed to fetch weather:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (selectedCity: string) => {
    setCity(selectedCity);
    setCustomCity('');
  };

  const handleCustomCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCity.trim()) {
      setCity(customCity.trim());
    }
  };

  const getWindDirection = (dir: string) => {
    const directions: { [key: string]: string } = {
      'N': '北风',
      'NE': '东北风',
      'E': '东风',
      'SE': '东南风',
      'S': '南风',
      'SW': '西南风',
      'W': '西风',
      'NW': '西北风',
    };
    return directions[dir] || dir;
  };

  const getWeatherIcon = (weatherDesc: string): string => {
    if (!weatherDesc) return '🌤️';
    
    const desc = weatherDesc.toLowerCase();
    
    // 晴天相关
    if (desc.includes('sunny') || desc.includes('晴') || desc.includes('clear')) {
      return '☀️';
    }
    
    // 多云相关
    if (desc.includes('cloudy') || desc.includes('多云') || desc.includes('cloud')) {
      if (desc.includes('partly') || desc.includes('少云') || desc.includes('partially')) {
        return '⛅';
      }
      return '☁️';
    }
    
    // 阴天
    if (desc.includes('overcast') || desc.includes('阴')) {
      return '☁️';
    }
    
    // 雨相关
    if (desc.includes('rain') || desc.includes('雨')) {
      if (desc.includes('heavy') || desc.includes('大') || desc.includes('暴雨')) {
        return '🌧️';
      }
      if (desc.includes('shower') || desc.includes('阵雨')) {
        return '🌦️';
      }
      if (desc.includes('light') || desc.includes('小') || desc.includes('小雨')) {
        return '🌦️';
      }
      return '🌧️';
    }
    
    // 雪相关
    if (desc.includes('snow') || desc.includes('雪')) {
      if (desc.includes('heavy') || desc.includes('大')) {
        return '❄️';
      }
      return '🌨️';
    }
    
    // 雾/霾
    if (desc.includes('fog') || desc.includes('mist') || desc.includes('雾') || desc.includes('霾')) {
      return '🌫️';
    }
    
    // 雷暴
    if (desc.includes('thunder') || desc.includes('storm') || desc.includes('雷')) {
      return '⛈️';
    }
    
    // 冰雹
    if (desc.includes('hail') || desc.includes('冰雹')) {
      return '🌨️';
    }
    
    // 默认多云
    return '🌤️';
  };

  const getDetailIcon = (type: string): string => {
    const icons: { [key: string]: string } = {
      'humidity': '💧',
      'pressure': '🌡️',
      'visibility': '👁️',
      'winddir': '🧭',
      'windspeed': '💨',
      'precip': '🌧️',
    };
    return icons[type] || '📊';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                ← 返回首页
              </Link>
              <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                天气查询
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* City Selection */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            选择城市
          </h2>
          
          {/* Common Cities */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">常用城市：</p>
            <div className="flex flex-wrap gap-2">
              {COMMON_CITIES.map((item) => (
                <button
                  key={item.value}
                  onClick={() => handleCityChange(item.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    city === item.value
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Custom City Input */}
          <form onSubmit={handleCustomCitySubmit} className="flex gap-2">
            <input
              type="text"
              value={customCity}
              onChange={(e) => setCustomCity(e.target.value)}
              placeholder="输入城市名称（如：Wuhan, Beijing）"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              查询
            </button>
          </form>
        </div>

        {/* Weather Display */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : weather ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            {/* Main Weather Card */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-6 md:p-8 text-white">
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                {/* Left Section - City and Time */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">{weather.city}</h2>
                  <p className="text-blue-100 text-xs md:text-sm mb-4">
                    {weather.localObsDateTime || weather.observation_time}
                  </p>
                  
                  {/* Temperature and Weather Icon Row */}
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
                    <div className="text-7xl md:text-8xl animate-pulse">
                      {getWeatherIcon(weather.weatherDesc)}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl md:text-6xl font-light">{weather.temp_C}</span>
                        <span className="text-2xl md:text-3xl text-blue-100">°C</span>
                      </div>
                      <p className="text-lg md:text-xl mt-1 text-blue-50">{weather.weatherDesc}</p>
                    </div>
                  </div>
                </div>
                
                {/* Right Section - Feels Like */}
                <div className="text-center md:text-right bg-white/10 dark:bg-white/5 rounded-xl px-6 py-4 backdrop-blur-sm">
                  <p className="text-blue-100 text-xs md:text-sm mb-1">体感温度</p>
                  <p className="text-3xl md:text-4xl font-semibold">{weather.FeelsLikeC}°C</p>
                </div>
              </div>
            </div>

            {/* Weather Details */}
            <div className="p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                详细信息
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl md:text-2xl">{getDetailIcon('humidity')}</span>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">湿度</p>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {weather.humidity}<span className="text-base md:text-lg text-gray-500 dark:text-gray-400 ml-1">%</span>
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl md:text-2xl">{getDetailIcon('pressure')}</span>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">气压</p>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {weather.pressure}
                    <span className="text-base md:text-lg text-gray-500 dark:text-gray-400 ml-1">hPa</span>
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl md:text-2xl">{getDetailIcon('visibility')}</span>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">能见度</p>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {weather.visibility}
                    <span className="text-base md:text-lg text-gray-500 dark:text-gray-400 ml-1">km</span>
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl md:text-2xl">{getDetailIcon('winddir')}</span>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">风向</p>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {getWindDirection(weather.winddir16Point)}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl md:text-2xl">{getDetailIcon('windspeed')}</span>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">风速</p>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {weather.windspeedKmph}
                    <span className="text-base md:text-lg text-gray-500 dark:text-gray-400 ml-1">km/h</span>
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl md:text-2xl">{getDetailIcon('precip')}</span>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">降水量</p>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {weather.precipMM}
                    <span className="text-base md:text-lg text-gray-500 dark:text-gray-400 ml-1">mm</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 dark:text-gray-400">
            © 2024 今日头条新闻资讯系统
          </p>
        </div>
      </footer>
    </div>
  );
}

