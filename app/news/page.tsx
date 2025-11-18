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

const categories = [
  { id: 'all', name: '全部' },
  { id: '科技', name: '科技' },
  { id: '财经', name: '财经' },
  { id: '体育', name: '体育' },
  { id: '文化', name: '文化' },
  { id: '健康', name: '健康' },
  { id: '教育', name: '教育' }
];

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchNews();
  }, [selectedCategory, page]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/news?category=${selectedCategory}&page=${page}&pageSize=10`
      );
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
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              今日头条
            </Link>
            <nav className="flex gap-4">
              <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                首页
              </Link>
              <Link href="/news" className="text-blue-600 dark:text-blue-400 font-medium">
                新闻
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* News List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
            暂无新闻数据
          </div>
        ) : (
          <div className="space-y-6">
            {news.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.id}`}
                className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  {item.image && (
                    <div className="relative w-full sm:w-48 h-48 sm:h-32 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-2">
                      {item.category && (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                          {item.category}
                        </span>
                      )}
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {item.source}
                      </span>
                      <span className="text-sm text-gray-400 dark:text-gray-500">
                        {item.time}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {item.title}
                    </h2>
                    {item.abstract && (
                      <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                        {item.abstract}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && news.length > 0 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              上一页
            </button>
            <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
              第 {page} 页
            </span>
            <button
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              下一页
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

