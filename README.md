# 今日头条新闻资讯浏览系统

这是一个基于 Next.js 16 构建的新闻资讯浏览系统，设计用于展示今日头条的新闻内容。

## 功能特性

- 📰 **新闻列表浏览** - 支持分类筛选和分页浏览
- 📄 **新闻详情页面** - 完整的新闻内容展示
- 🎨 **现代化UI设计** - 响应式布局，支持深色模式
- 🔍 **分类筛选** - 支持科技、财经、体育、文化、健康、教育等多个分类
- ⚡ **高性能** - 基于 Next.js App Router，服务端渲染优化

## 技术栈

- **框架**: Next.js 16
- **语言**: TypeScript
- **样式**: Tailwind CSS 4
- **UI**: 响应式设计，支持深色模式

## 开始使用

首先，安装依赖：

```bash
npm install
```

然后，运行开发服务器：

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看效果。

## 项目结构

```
app/
├── api/
│   └── news/          # 新闻API路由
│       ├── route.ts   # 新闻列表API
│       └── [id]/      # 新闻详情API
├── news/              # 新闻页面
│   ├── page.tsx       # 新闻列表页
│   └── [id]/          # 新闻详情页
├── page.tsx           # 首页
├── layout.tsx         # 根布局
└── globals.css        # 全局样式

lib/
└── toutiao.ts         # 今日头条数据获取工具（待实现）
```

## 接入真实数据

当前系统使用模拟数据。要接入真实的今日头条数据，需要：

1. **修改 API 路由** (`app/api/news/route.ts` 和 `app/api/news/[id]/route.ts`)
2. **实现数据获取逻辑** (`lib/toutiao.ts`)

### 可选的实现方式：

1. **RSS Feed** - 如果今日头条提供RSS订阅
2. **第三方API服务** - 使用提供今日头条数据的第三方服务
3. **后端爬虫服务** - 部署独立的后端服务进行数据抓取（需遵守robots.txt和相关法律法规）

### 注意事项

- 遵守相关法律法规和网站使用条款
- 尊重数据来源的知识产权
- 避免对目标网站造成过大压力
- 注意数据安全和用户隐私保护

## 构建生产版本

```bash
npm run build
npm start
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
