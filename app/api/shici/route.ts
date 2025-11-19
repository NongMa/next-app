import { NextResponse } from 'next/server';

// 诗词数据类型定义
export interface PoetryOrigin {
  title: string;
  dynasty: string;
  author: string;
  content: string[];
  translate?: string[];
}

export interface PoetryData {
  id: string;
  content: string;
  popularity?: number;
  origin: PoetryOrigin;
  matchTags?: string[];
  recommendedReason?: string;
  cacheAt?: string;
}

interface PoetryApiResponse {
  status: string;
  data: PoetryData;
  token?: string;
  warning?: string | null;
}

const API_KEY = '738b541a5f7a';
const API_BASE_URL = 'https://whyta.cn/api/shici';

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}?key=${API_KEY}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Poetry API error: ${response.status}`);
    }

    const result: PoetryApiResponse = await response.json();

    if (result.status !== 'success') {
      return NextResponse.json(
        { success: false, error: '获取诗词数据失败' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error('Error fetching poetry:', error);
    return NextResponse.json(
      { success: false, error: '获取诗词数据失败，请稍后重试' },
      { status: 500 }
    );
  }
}

