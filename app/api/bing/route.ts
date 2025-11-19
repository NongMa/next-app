import { NextResponse } from 'next/server';

// 壁纸数据类型定义
export interface BingImage {
  startdate: string;
  fullstartdate: string;
  enddate: string;
  url: string;
  urlbase: string;
  copyright: string;
  copyrightlink: string;
  title: string;
}

export interface BingData {
  images: BingImage[];
}

interface BingApiResponse {
  status: number;
  message: string;
  data: BingData;
}

const API_KEY = '738b541a5f7a';
const API_BASE_URL = 'https://whyta.cn/api/bing';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const n = searchParams.get('n') || '1';
    const count = parseInt(n) > 8 ? 8 : parseInt(n) < 1 ? 1 : parseInt(n);

    const response = await fetch(`${API_BASE_URL}?key=${API_KEY}&n=${count}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Bing API error: ${response.status}`);
    }

    const result: BingApiResponse = await response.json();

    if (result.status !== 1) {
      return NextResponse.json(
        { success: false, error: result.message || '获取壁纸数据失败' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error('Error fetching bing wallpaper:', error);
    return NextResponse.json(
      { success: false, error: '获取壁纸数据失败，请稍后重试' },
      { status: 500 }
    );
  }
}

