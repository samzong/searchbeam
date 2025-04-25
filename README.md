# SearchBeam

一个高性能的云端视频搜索API服务，用于代理多平台(如YouTube)的搜索请求。

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 项目简介

SearchBeam是一个轻量级的视频搜索代理API服务，专为需要集成多平台视频搜索功能的应用而设计。目前支持YouTube搜索，未来计划扩展至更多平台。

## 核心特性

- 🚀 高性能：支持多用户高并发访问
- 🔒 安全性：简单Token鉴权机制
- 🔄 缓存优化：内置智能缓存策略，减少重复请求
- 🔌 扩展性：模块化设计，易于扩展支持更多视频平台
- 🌐 云原生：专为Vercel Serverless环境优化

## 技术栈

- Node.js (>=18) + TypeScript
- Fastify框架
- 内存缓存 (lru-cache)
- Jest测试框架

## 快速开始

### 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/searchbeam.git
cd searchbeam

# 安装依赖
npm install
```

### 配置

1. 复制环境变量示例文件
```bash
cp .env.example .env
```

2. 在`.env`文件中配置你的API密钥和认证Token

```
YOUTUBE_API_KEY=your_youtube_api_key
AUTH_TOKENS=token1,token2,token3
```

### 运行

```bash
# 开发模式
npm run dev

# 构建项目
npm run build

# 启动生产服务
npm start
```

## API文档

### 搜索接口

**请求:**

```
GET /search?platform=youtube&q=keyword&pageToken=nextPageToken
```

**参数:**

- `platform` (必填): 搜索平台，目前支持 `youtube`
- `q` (必填): 搜索关键词
- `pageToken` (可选): 分页令牌

**认证:**

在请求头中添加以下字段:

```
Authorization: Bearer your_token
```

或在查询参数中:

```
?token=your_token
```

**响应示例:**

```json
{
  "items": [
    {
      "videoId": "dQw4w9WgXcQ",
      "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "title": "视频标题",
      "thumbnailUrl": "https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg",
      "duration": "3:32",
      "platform": "youtube"
    }
  ],
  "nextPageToken": "CAUQAA",
  "totalResults": 1000
}
```

## 贡献指南

1. Fork本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 开源协议

本项目采用MIT开源协议 - 详情见[LICENSE](LICENSE)文件 