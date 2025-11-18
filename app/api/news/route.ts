import { NextResponse } from 'next/server';

// 新闻数据类型定义
export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  image?: string;
  url: string;
  category?: string;
  abstract?: string;
}

// 模拟今日头条新闻数据获取
// 实际使用时，可以替换为真实的今日头条数据抓取逻辑
async function fetchToutiaoNews(): Promise<NewsItem[]> {
  // 这里可以接入真实的今日头条数据
  // 由于今日头条没有公开API，可以通过以下方式：
  // 1. 使用RSS feed（如果可用）
  // 2. 使用第三方聚合服务
  // 3. 后端爬虫服务（需遵守robots.txt和相关法规）
  
  // 当前返回模拟数据，实际使用时替换为真实数据源
  const mockNews: NewsItem[] = [
    {
      id: '1',
      title: '科技前沿：人工智能在医疗领域的突破性应用',
      source: '科技日报',
      time: '2024-01-15 10:30',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
      url: '/news/1',
      category: '科技',
      abstract: '最新研究显示，AI技术在疾病诊断和治疗方案制定方面取得重大进展...'
    },
    {
      id: '2',
      title: '经济观察：2024年全球经济展望与投资机会',
      source: '财经周刊',
      time: '2024-01-15 09:15',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
      url: '/news/2',
      category: '财经',
      abstract: '专家分析认为，新兴市场将迎来新的增长机遇...'
    },
    {
      id: '3',
      title: '体育快讯：国际足球赛事精彩回顾',
      source: '体育时报',
      time: '2024-01-15 08:45',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
      url: '/news/3',
      category: '体育',
      abstract: '昨晚进行的国际足球比赛中，多支强队展现出色表现...'
    },
    {
      id: '4',
      title: '文化视角：传统文化在现代社会的传承与创新',
      source: '文化周刊',
      time: '2024-01-14 20:20',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      url: '/news/4',
      category: '文化',
      abstract: '探讨如何在新时代背景下传承和发扬优秀传统文化...'
    },
    {
      id: '5',
      title: '健康生活：冬季养生小贴士',
      source: '健康时报',
      time: '2024-01-14 18:30',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
      url: '/news/5',
      category: '健康',
      abstract: '专家建议，冬季应注意保暖和营养均衡...'
    },
    {
      id: '6',
      title: '教育资讯：在线教育平台的新发展趋势',
      source: '教育观察',
      time: '2024-01-14 16:15',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
      url: '/news/6',
      category: '教育',
      abstract: '随着技术发展，在线教育正在改变传统学习方式...'
    }
  ];

  return mockNews;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    let news = await fetchToutiaoNews();

    // 按分类筛选
    if (category && category !== 'all') {
      news = news.filter(item => item.category === category);
    }

    // 分页处理
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedNews = news.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedNews,
      total: news.length,
      page,
      pageSize
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { success: false, error: '获取新闻数据失败' },
      { status: 500 }
    );
  }
}

