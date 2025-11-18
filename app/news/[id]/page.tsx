'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface NewsDetail {
  id: string;
  title: string;
  source: string;
  time: string;
  image?: string;
  url: string;
  category?: string;
  abstract?: string;
  content: string;
  tags?: string[];
  views?: number;
  comments?: number;
}

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchNewsDetail(params.id as string);
    }
  }, [params.id]);

  const fetchNewsDetail = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/news/${id}`);
      const result = await response.json();
      if (result.success) {
        setNews(result.data);
      } else {
        router.push('/news');
      }
    } catch (error) {
      console.error('Failed to fetch news detail:', error);
      router.push('/news');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!news) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              今日头条
            </Link>
            <nav className="flex gap-4">
              <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                首页
              </Link>
              <Link href="/news" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                新闻列表
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          {/* Article Header */}
          <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              {news.category && (
                <span className="px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                  {news.category}
                </span>
              )}
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {news.source}
              </span>
              <span className="text-sm text-gray-400 dark:text-gray-500">
                {news.time}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {news.title}
            </h1>
            {news.abstract && (
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {news.abstract}
              </p>
            )}
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
              {news.views && (
                <span>阅读 {news.views.toLocaleString()}</span>
              )}
              {news.comments && (
                <span>评论 {news.comments}</span>
              )}
            </div>
          </div>

          {/* Article Image */}
          {news.image && (
            <div className="relative w-full h-64 sm:h-96">
              <Image
                src={news.image}
                alt={news.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Article Content */}
          <div className="p-6 sm:p-8">
            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: news.content }}
              style={{
                lineHeight: '1.8',
                color: 'inherit'
              }}
            />
          </div>

          {/* Tags */}
          {news.tags && news.tags.length > 0 && (
            <div className="px-6 sm:px-8 pb-6 sm:pb-8 border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">标签：</span>
                {news.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="px-6 sm:px-8 pb-6 sm:pb-8">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              ← 返回新闻列表
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}

