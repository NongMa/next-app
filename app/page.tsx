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

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              今日头条
            </h1>
            <nav className="flex gap-4">
              <Link href="/" className="text-blue-600 dark:text-blue-400 font-medium">
                首页
              </Link>
              <Link href="/news" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                更多新闻
              </Link>
            </nav>
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
