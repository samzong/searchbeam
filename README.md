# yt-search-api

<div align="center">
  <img src="./yt-search-api.png" alt="yt-search-api logo" width="200" />
  <br />
  <p>High-performance cloud video search API service for proxying search requests from multiple platforms (such as YouTube)</p>
  <p>
    <a href="https://github.com/samzong/yt-search-api/releases"><img src="https://img.shields.io/github/v/release/samzong/yt-search-api" alt="Release Version" /></a>
    <a href="https://github.com/samzong/yt-search-api/blob/main/LICENSE"><img src="https://img.shields.io/github/license/samzong/yt-search-api" alt="MIT License" /></a>
    <a href="https://github.com/samzong/yt-search-api/actions"><img src="https://img.shields.io/github/actions/workflow/status/samzong/yt-search-api/docker-build.yml?branch=main" alt="Build Status" /></a>
    <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen" alt="Node Version" /></a>
  </p>
</div>

## Introduction

yt-search-api is a lightweight video search proxy API service designed for applications that need to integrate multi-platform video search functionality. Currently supports YouTube search, with plans to expand to more platforms in the future.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsamzong%2Fyt-search-api)

## Core Features

- 🚀 High Performance: Supports high concurrency with multiple users
- 🔒 Security: Simple token authentication mechanism
- 🔄 Cache Optimization: Built-in smart caching strategy to reduce repeated requests
- 🔌 Extensibility: Modular design, easy to extend support for more video platforms

## Tech Stack

- Node.js (>=18) + TypeScript
- Fastify framework
- Memory cache (lru-cache)
- Jest testing framework

## API Documentation

### Search Endpoint

**Request:**

```
GET /search?platform=youtube&q=keyword
```

**Parameters:**

- `platform` (required): Search platform, currently supports `youtube`
- `q` (required): Search keyword

**Authentication:**

Add the following field to the request header:

```
Authorization: Bearer your_token
```

**Response Example:**

```json
{
  "items": [
    {
      "videoId": "dQw4w9WgXcQ",
      "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "title": "Video Title",
      "thumbnailUrl": "https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg",
      "duration": "3:32",
      "platform": "youtube"
    }
  ],
  "nextPageToken": "CAUQAA",
  "totalResults": 1000
}
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
