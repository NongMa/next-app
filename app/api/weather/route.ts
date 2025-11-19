import { NextResponse } from 'next/server';

// 天气数据类型定义
export interface WeatherData {
  city: string;
  FeelsLikeC: string;
  FeelsLikeF: string;
  temp_C: string;
  temp_F: string;
  observation_time: string;
  localObsDateTime?: string;
  precipMM: string;
  precipInches?: string;
  weatherDesc: string | Array<{ value: string }>;
  humidity: string;
  pressure: string;
  pressureInches?: string;
  visibility: string;
  visibilityMiles?: string;
  winddir16Point: string;
  winddirDegree?: string;
  windspeedKmph: string;
  windspeedMiles: string;
  cloudcover?: string;
  uvIndex?: string;
  weatherCode?: string;
  weatherIconUrl?: Array<{ value: string }>;
}

interface WeatherApiResponse {
  status: number;
  message: string;
  data: WeatherData;
}

const API_KEY = '738b541a5f7a';
const API_BASE_URL = 'https://whyta.cn/api/tianqi';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') || 'Shenzhen';

    const response = await fetch(`${API_BASE_URL}?key=${API_KEY}&city=${encodeURIComponent(city)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const result: WeatherApiResponse = await response.json();

    if (result.status !== 1) {
      return NextResponse.json(
        { success: false, error: result.message || '获取天气数据失败' },
        { status: 400 }
      );
    }

    // 处理 weatherDesc，确保统一格式
    let weatherDesc = '';
    if (Array.isArray(result.data.weatherDesc)) {
      weatherDesc = result.data.weatherDesc[0]?.value || '';
    } else {
      weatherDesc = result.data.weatherDesc || '';
    }

    return NextResponse.json({
      success: true,
      data: {
        ...result.data,
        weatherDesc,
      },
    });
  } catch (error) {
    console.error('Error fetching weather:', error);
    return NextResponse.json(
      { success: false, error: '获取天气数据失败，请稍后重试' },
      { status: 500 }
    );
  }
}

