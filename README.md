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

## 技术栈

- Node.js (>=18) + TypeScript
- Fastify框架
- 内存缓存 (lru-cache)
- Jest测试框架

## API文档

### 搜索接口

**请求:**

```
GET /search?platform=youtube&q=keyword
```

**参数:**

- `platform` (必填): 搜索平台，目前支持 `youtube`
- `q` (必填): 搜索关键词

**认证:**

在请求头中添加以下字段:

```
Authorization: Bearer your_token
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
