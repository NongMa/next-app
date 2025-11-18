import { NextResponse } from 'next/server';
import type { NewsItem } from '../route';

// 新闻详情类型
export interface NewsDetail extends NewsItem {
  content: string;
  tags?: string[];
  views?: number;
  comments?: number;
}

// 模拟获取新闻详情
async function fetchNewsDetail(id: string): Promise<NewsDetail | null> {
  // 实际使用时，这里应该从今日头条获取真实数据
  const mockDetails: Record<string, NewsDetail> = {
    '1': {
      id: '1',
      title: '科技前沿：人工智能在医疗领域的突破性应用',
      source: '科技日报',
      time: '2024-01-15 10:30',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200',
      url: '/news/1',
      category: '科技',
      abstract: '最新研究显示，AI技术在疾病诊断和治疗方案制定方面取得重大进展...',
      content: `
        <p>人工智能技术在医疗健康领域的应用正在快速发展，为传统医疗模式带来革命性变化。</p>
        
        <h2>诊断精度的提升</h2>
        <p>最新的AI诊断系统在多种疾病的识别准确率上已经超过了经验丰富的医生。通过深度学习算法，系统能够分析医学影像，识别早期病变，为患者争取宝贵的治疗时间。</p>
        
        <h2>个性化治疗方案</h2>
        <p>基于大数据和机器学习，AI系统能够根据患者的基因信息、病史和实时生理数据，制定个性化的治疗方案，提高治疗效果，减少副作用。</p>
        
        <h2>药物研发加速</h2>
        <p>AI技术在药物研发中的应用大大缩短了新药从发现到上市的时间。通过模拟分子结构和预测药物相互作用，AI帮助科研人员更快地找到有效的药物候选。</p>
        
        <h2>远程医疗支持</h2>
        <p>结合5G和AI技术，远程医疗变得更加智能和高效。患者可以通过智能设备进行初步诊断，AI系统提供专业建议，让优质医疗资源覆盖更广泛的人群。</p>
        
        <p>专家表示，虽然AI技术在医疗领域展现出巨大潜力，但人机协作仍然是未来医疗发展的主要方向。医生的专业判断和人文关怀是AI无法替代的。</p>
      `,
      tags: ['人工智能', '医疗健康', '科技创新'],
      views: 12580,
      comments: 342
    },
    '2': {
      id: '2',
      title: '经济观察：2024年全球经济展望与投资机会',
      source: '财经周刊',
      time: '2024-01-15 09:15',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200',
      url: '/news/2',
      category: '财经',
      abstract: '专家分析认为，新兴市场将迎来新的增长机遇...',
      content: `
        <p>2024年全球经济在多重因素影响下呈现出复杂多变的态势，投资者需要密切关注市场动态，把握投资机会。</p>
        
        <h2>全球经济增长预期</h2>
        <p>国际货币基金组织最新预测显示，2024年全球经济增长将保持在3%左右。虽然增速有所放缓，但整体仍保持稳定增长态势。</p>
        
        <h2>新兴市场投资机会</h2>
        <p>随着全球经济格局的变化，新兴市场国家展现出强劲的增长潜力。特别是在科技、新能源、消费升级等领域，投资机会丰富。</p>
        
        <h2>风险与挑战</h2>
        <p>地缘政治风险、通胀压力、债务问题等仍然是需要关注的重要因素。投资者需要做好风险管理，保持投资组合的多样性。</p>
        
        <h2>投资建议</h2>
        <p>专家建议，投资者应该关注长期价值，选择具有核心竞争力的优质资产，同时保持足够的流动性以应对市场波动。</p>
      `,
      tags: ['经济', '投资', '全球市场'],
      views: 8920,
      comments: 156
    }
  };

  return mockDetails[id] || null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Next.js 16中params可能是Promise，需要await
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;
    const newsDetail = await fetchNewsDetail(id);

    if (!newsDetail) {
      return NextResponse.json(
        { success: false, error: '新闻不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: newsDetail
    });
  } catch (error) {
    console.error('Error fetching news detail:', error);
    return NextResponse.json(
      { success: false, error: '获取新闻详情失败' },
      { status: 500 }
    );
  }
}

