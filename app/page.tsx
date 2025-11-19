'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  image?: string;
  url: string;
  category?: string;
  abstract?: string;
}

interface PoetryOrigin {
  title: string;
  dynasty: string;
  author: string;
  content: string[];
  translate?: string[];
}

interface PoetryData {
  id: string;
  content: string;
  popularity?: number;
  origin: PoetryOrigin;
  matchTags?: string[];
  recommendedReason?: string;
  cacheAt?: string;
}

interface BingImage {
  startdate: string;
  fullstartdate: string;
  enddate: string;
  url: string;
  urlbase: string;
  copyright: string;
  copyrightlink: string;
  title: string;
}

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [poetry, setPoetry] = useState<PoetryData | null>(null);
  const [poetryLoading, setPoetryLoading] = useState(true);
  const [poetryExpanded, setPoetryExpanded] = useState(false);
  const [wallpaper, setWallpaper] = useState<BingImage | null>(null);
  const [wallpaperLoading, setWallpaperLoading] = useState(true);
  const [wallpaperModalOpen, setWallpaperModalOpen] = useState(false);

  useEffect(() => {
    fetchNews();
    fetchPoetry();
    // 壁纸延迟2秒加载
    const wallpaperTimer = setTimeout(() => {
      fetchWallpaper();
    }, 2000);
    
    return () => clearTimeout(wallpaperTimer);
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/news?page=1&pageSize=6');
      const result = await response.json();
      if (result.success) {
        setNews(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPoetry = async () => {
    setPoetryLoading(true);
    try {
      const response = await fetch('/api/shici');
      const result = await response.json();
      if (result.success) {
        setPoetry(result.data);
        setPoetryExpanded(false); // 刷新后重置为收起状态
      }
    } catch (error) {
      console.error('Failed to fetch poetry:', error);
    } finally {
      setPoetryLoading(false);
    }
  };

  const fetchWallpaper = async () => {
    setWallpaperLoading(true);
    try {
      const response = await fetch('/api/bing?n=1');
      const result = await response.json();
      if (result.success && result.data.images && result.data.images.length > 0) {
        setWallpaper(result.data.images[0]);
      }
    } catch (error) {
      console.error('Failed to fetch wallpaper:', error);
    } finally {
      setWallpaperLoading(false);
    }
  };

  const handleDownloadWallpaper = async () => {
    if (!wallpaper) return;
    
    try {
      const response = await fetch(wallpaper.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bing-wallpaper-${wallpaper.startdate}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download wallpaper:', error);
      alert('下载失败，请稍后重试');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              今日头条
            </h1>
            <div className="flex items-center gap-4">
              <nav className="flex gap-4">
                <Link href="/" className="text-blue-600 dark:text-blue-400 font-medium">
                  首页
                </Link>
                <Link href="/news" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  更多新闻
                </Link>
              </nav>
              <Link 
                href="/weather" 
                className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg group"
              >
                <span className="text-2xl animate-bounce group-hover:animate-none group-hover:rotate-12 transition-transform duration-300">
                  🌤️
                </span>
                <span className="font-medium">天气</span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-75"></span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            最新资讯
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            实时获取今日头条最新新闻资讯
          </p>
        </div>

        {/* Daily Poetry Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl shadow-lg p-8 md:p-10 border border-purple-100 dark:border-purple-800/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-3xl">📜</span>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  每日诗词
                </h3>
              </div>
              <button
                onClick={fetchPoetry}
                disabled={poetryLoading}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                title="刷新诗词"
              >
                <span className={`text-lg ${poetryLoading ? 'animate-spin' : ''}`}>
                  🔄
                </span>
                <span className="text-sm font-medium hidden sm:inline">
                  {poetryLoading ? '刷新中...' : '刷新'}
                </span>
              </button>
            </div>
            
            {poetryLoading && !poetry ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : poetry ? (
              <div className={`relative space-y-6 ${poetryLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                {/* Poetry Content */}
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-6 md:p-8 border border-purple-200/50 dark:border-purple-700/50">
                  <div className="text-center space-y-4">
                    {/* Poem Title and Author */}
                    <div className="mb-4">
                      <h4 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {poetry.origin.title}
                      </h4>
                      <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                        {poetry.origin.dynasty} · {poetry.origin.author}
                      </p>
                    </div>
                    
                    {/* Poem Lines */}
                    <div className="space-y-3">
                      {poetry.origin.content.map((line, index) => {
                        // 收起状态只显示前两句
                        if (!poetryExpanded && index >= 2) return null;
                        return (
                          <p 
                            key={index}
                            className="text-lg md:text-xl text-gray-800 dark:text-gray-200 leading-relaxed font-medium"
                          >
                            {line}
                          </p>
                        );
                      })}
                      {!poetryExpanded && poetry.origin.content.length > 2 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                          ...
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Translation (if available) - 只在展开时显示 */}
                {poetryExpanded && poetry.origin.translate && poetry.origin.translate.length > 0 && (
                  <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-lg p-5 md:p-6 border border-purple-200/30 dark:border-purple-700/30">
                    <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <span>💭</span>
                      译文
                    </h5>
                    <div className="space-y-2">
                      {poetry.origin.translate.map((line, index) => (
                        <p 
                          key={index}
                          className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed"
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags (if available) - 只在展开时显示 */}
                {poetryExpanded && poetry.matchTags && poetry.matchTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {poetry.matchTags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Expand/Collapse Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => setPoetryExpanded(!poetryExpanded)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-200 dark:hover:bg-purple-800/50 text-purple-700 dark:text-purple-300 rounded-lg transition-all duration-200 text-sm font-medium"
                  >
                    <span className={`transition-transform duration-200 ${poetryExpanded ? 'rotate-180' : ''}`}>
                      {poetryExpanded ? '▲' : '▼'}
                    </span>
                    <span>{poetryExpanded ? '收起' : '展开'}</span>
                  </button>
                </div>
                {poetryLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl">
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">刷新中...</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                暂无诗词数据
              </div>
            )}
          </div>
        </div>

        {/* Daily Wallpaper Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl shadow-lg p-6 md:p-8 border border-orange-100 dark:border-orange-800/50">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-3xl">🖼️</span>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                每日壁纸
              </h3>
            </div>
            
            {wallpaperLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              </div>
            ) : wallpaper ? (
              <div className="space-y-4">
                {/* Wallpaper Card */}
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg overflow-hidden border border-orange-200/50 dark:border-orange-700/50 group cursor-pointer"
                     onClick={() => setWallpaperModalOpen(true)}>
                  <div className="relative w-full min-h-64 md:min-h-80 overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <Image
                      src={wallpaper.url}
                      alt={wallpaper.title}
                      width={1920}
                      height={1080}
                      className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 text-white text-lg font-medium transition-opacity duration-300">
                        点击放大查看
                      </span>
                    </div>
                  </div>
                  <div className="p-5 md:p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-1">
                      {wallpaper.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {wallpaper.copyright}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setWallpaperModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    <span>🔍</span>
                    <span>放大查看</span>
                  </button>
                  <button
                    onClick={handleDownloadWallpaper}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm font-medium border border-gray-300 dark:border-gray-600"
                  >
                    <span>⬇️</span>
                    <span>下载</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                暂无壁纸数据
              </div>
            )}
          </div>
        </div>

        {/* Wallpaper Modal */}
        {wallpaperModalOpen && wallpaper && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 md:p-4 animate-in fade-in duration-200"
            onClick={() => setWallpaperModalOpen(false)}
          >
            <div 
              className="relative w-full max-w-7xl max-h-[95vh] flex flex-col bg-gray-900 rounded-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Bar - Only Close Button */}
              <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent p-4">
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => setWallpaperModalOpen(false)}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                    aria-label="关闭"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Image Container */}
              <div className="flex-1 flex items-center justify-center overflow-hidden bg-black/50 p-2 md:p-4">
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={wallpaper.url}
                    alt={wallpaper.title}
                    width={1920}
                    height={1080}
                    className="max-w-full max-h-[calc(95vh-140px)] object-contain rounded-lg"
                    priority
                  />
                </div>
              </div>

              {/* Footer Bar */}
              <div className="bg-gradient-to-t from-black/80 to-transparent backdrop-blur-sm p-5 md:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 md:gap-6">
                    <div className="flex-1 min-w-0 pr-2 md:pr-4">
                      <h4 className="text-base md:text-lg font-semibold text-white mb-2 md:mb-3">
                        {wallpaper.title}
                      </h4>
                      <p className="text-xs md:text-sm text-white/70 line-clamp-2 leading-relaxed">
                        {wallpaper.copyright}
                      </p>
                    </div>
                    <div className="flex gap-3 flex-shrink-0">
                      <button
                        onClick={handleDownloadWallpaper}
                        className="flex items-center gap-2 px-4 md:px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>下载壁纸</span>
                      </button>
                      <a
                        href={wallpaper.copyrightlink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 md:px-6 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg transition-all duration-200 text-sm font-medium border border-white/20 hover:border-white/30 hover:scale-105"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span>了解更多</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* News Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.id}`}
                className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                {item.image && (
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {item.category && (
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                        {item.category}
                      </span>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {item.source}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>
                  {item.abstract && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                      {item.abstract}
                    </p>
                  )}
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {item.time}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View More Button */}
        {!loading && news.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              href="/news"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              查看更多新闻 →
            </Link>
          </div>
        )}
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
