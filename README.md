# yt-search-api

A high-performance cloud video search API service that is used to proxy search requests from multiple platforms (such as YouTube).

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Introduction

yt-search-api is a lightweight video search proxy API service designed for applications that need to integrate multi-platform video search capabilities. YouTube search is currently supported, with plans to expand to more platforms in the future.

## Core Features

- 🚀 High Performance: Supports multi-user high-concurrency access
- 🔒 Security: Simple token authentication mechanism
- 🔄 Cache Optimization: Built-in smart caching strategy to reduce duplicate requests
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
