# ft_transcendence

https://github.com/mylastresort/ft_transcendence/assets/69481161/2f115787-b30c-49e8-986c-16892fb4c650


## Overview

ft_transcendence is a comprehensive full-stack web application that recreates the classic Pong game experience with modern web technologies and social features. Built as the capstone project for 42 School's web development track, this application demonstrates proficiency in:

- **Real-time Multiplayer Gaming**: WebSocket-powered Pong game with customizable settings and spectator mode
- **Social Networking**: Friend systems, user profiles, blocking, and real-time status updates
- **Chat System**: Multi-channel chat with private messaging, moderation tools, and administrative controls
- **Authentication & Security**: OAuth2 integration with 42 API, JWT tokens, and optional 2FA
- **Modern Architecture**: Microservices approach with Docker containerization and PostgreSQL database
- **Professional Development Practices**: TypeScript, automated testing, API documentation, and CI/CD ready

The application showcases enterprise-level development patterns while maintaining code quality, security best practices, and scalable architecture suitable for real-world deployment.

A full-stack web application built for 42 School featuring real-time multiplayer Pong game, chat system, user management, and social features. The project demonstrates modern web development practices with TypeScript, NestJS, Next.js, and real-time communication via WebSockets.

 **Note**: This is an educational project developed as part of the 42 School curriculum. It was built to explore and learn modern web development technologies, real-time communication, and full-stack architecture patterns.


## Architecture Overview

The application follows a microservices-like architecture with clear separation between frontend and backend services, orchestrated using Docker Compose.

### High-Level System Architecture
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Docker Compose Environment                        │
├─────────────────────┬─────────────────────┬─────────────────────────────────┤
│      Frontend       │      Backend        │         PostgreSQL              │
│      (Next.js)      │      (NestJS)       │         Database                │
│      Port: 5173     │      Port: 3000     │         Port: 5432              │
│                     │                     │                                 │
│  ┌───────────────┐  │  ┌────────────────┐ │  ┌────────────────────────────┐ │
│  │   Pages       │  │  │ Controllers    │ │  │  Tables                    │ │
│  │   Components  │  │  │ Auth │ Game    │ │  │  User   │ Room   │ Message │ │
│  │   Context     │  │  │ User │ Friends │ │  │  Friend │ Channel          │ │
│  └───────────────┘  │  └────────────────┘ │  └────────────────────────────┘ │
│                     │                     │                                 │
│  WebSocket ─────────┼─────► WebSocket ────┼──────► Real-time Updates        │
│  HTTP Requests ─────┼─────► REST API ─────┼──────► CRUD Operations          │
└─────────────────────┴─────────────────────┴─────────────────────────────────┘
```

### Real-time Communication Architecture
```
Frontend                     Backend                      Database
┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│                      │     │                      │     │                      │
│   Socket Clients     │     │   WebSocket          │     │   Real-time          │
│                      │     │   Gateways           │     │   Data               │
│                      │     │                      │     │                      │
│ ┌──────────────────┐ │ WSS │ ┌──────────────────┐ │Query│ ┌──────────────────┐ │
│ │   Game Client    ├─┼────►│ │   Game           ├─┼────►│ │   Rooms          │ │
│ │                  │ │     │ │   Gateway        │ │     │ │   Players        │ │
│ └──────────────────┘ │     │ └──────────────────┘ │     │ └──────────────────┘ │
│                      │     │                      │     │                      │
│ ┌──────────────────┐ │ WSS │ ┌──────────────────┐ │Query│ ┌──────────────────┐ │
│ │   Chat Client    ├─┼────►│ │   Chat           ├─┼────►│ │   Messages       │ │
│ │                  │ │     │ │   Gateway        │ │     │ │   Channels       │ │
│ └──────────────────┘ │     │ └──────────────────┘ │     │ └──────────────────┘ │
│                      │     │                      │     │                      │
│ ┌──────────────────┐ │ WSS │ ┌──────────────────┐ │Query│ ┌──────────────────┐ │
│ │   User Status    ├─┼────►│ │   User           ├─┼────►│ │   Friends        │ │
│ │   Client         │ │     │ │   Gateway        │ │     │ │   Status         │ │
│ └──────────────────┘ │     │ └──────────────────┘ │     │ └──────────────────┘ │
└──────────────────────┘     └──────────────────────┘     └──────────────────────┘
```

### Authentication & Authorization Flow
```
┌────────────────────┐       ┌────────────────────────────────────────────────────┐
│    User Login      │       │                  Backend Auth                      │
└────────────────────┘       └────────────────────────────────────────────────────┘
         │                                             │
         │ 1. OAuth Request                            │
         ▼                                             │
┌────────────────────┐                                 │
│  42 OAuth Server   │                                 │
└────────────────────┘                                 │
         │                                             │
         │ 2. Authorization Code                       │
         ▼                                             │
┌─────────────────────────────────────────────────────────────────────────────────┐
│                             Auth Service                                        │
│                                                                                 │
│  3. Exchange Code ──► 4. Get User Info ──► 5. Check Database ──► 6. JWT         │
│                                                                                 │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │  42 Strategy   │  │  User Lookup   │  │   2FA Check    │  │   JWT Sign     │ │
│  └────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
         │                                             │
         │ 7. JWT Token (or 2FA Required)              │
         ▼                                             │
┌────────────────────┐                                 │
│    Frontend        │                                 │
│   Auth Context     │                                 │
└────────────────────┘                                 │
         │                                             │
         │ 8. All Subsequent Requests                  │
         ▼                                             ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           Protected Endpoints                                   │
│                                                                                 │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │   Game API     │  │   Chat API     │  │   User API     │  │  Friends API   │ │
│  │  + WSS Auth    │  │  + WSS Auth    │  │                │  │                │ │
│  └────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow Between Modules
```
┌────────────────────────────────────────────────────────────────────────────────┐
│                            Cross-Module Dependencies                           │
└────────────────────────────────────────────────────────────────────────────────┘

Auth Module                   Game Module                   Chat Module
    │                             │                             │
    │ User Authentication         │ Player Creation             │ User Join Channels
    ▼                             ▼                             ▼
┌─────────────┐               ┌─────────────┐               ┌─────────────┐
│    User     │◄─────────────►│   Player    │               │   Member    │
│   Entity    │               │   Entity    │               │   Entity    │
└─────────────┘               └─────────────┘               └─────────────┘
    │                             │                             │
    │ Friend Relationships        │ Game Statistics             │ Message History
    ▼                             ▼                             ▼
┌─────────────┐               ┌─────────────┐               ┌─────────────┐
│   Friend    │               │    Room     │               │   Message   │
│   Entity    │               │   Entity    │               │   Entity    │
└─────────────┘               └─────────────┘               └─────────────┘

Game Invite Flow:
Auth ──► User Status ──► Friends ──────────────► Chat ─────────────► Game
 │                         │                       │                   │
 └─────► Login/Logout ─────┴────────► Online ──────┴─────► Invite ─────┘
                                      Status             Notification
```

## Tech Stack

### Backend
- **Framework**: NestJS (Node.js framework)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + 42 OAuth + 2FA (TOTP)
- **Real-time**: Socket.IO WebSockets
- **Security**: Passport.js, bcrypt, argon2
- **API Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: Next.js (React framework)
- **Language**: TypeScript
- **UI Libraries**: Mantine, NextUI, Arco Design
- **Real-time**: Socket.IO Client
- **Styling**: CSS Modules, Emotion
- **State Management**: React Context API

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database Migrations**: Prisma Migrate
- **Process Management**: PM2 (production)

## Project Structure

```
ft_transcendence/
├── backend/                    # NestJS Backend Service
│   ├── src/
│   │   ├── auth/               # Authentication & Authorization
│   │   │   ├── strategies/     # Passport strategies (42, JWT, etc.)
│   │   │   ├── dto/            # Data Transfer Objects
│   │   │   └── ws-jwt/         # WebSocket JWT guards
│   │   ├── chat/               # Chat System
│   │   │   ├── channel/        # Public/Private channels
│   │   │   └── private/        # Direct messages
│   │   ├── game/               # Pong Game Engine
│   │   ├── friends/            # Social Features
│   │   ├── users/              # User Management
│   │   ├── prisma/             # Database Service
│   │   └── config/             # Configuration
│   ├── prisma/                 # Database Schema & Migrations
│   └── Uploads/                # Static file storage
├── frontend/                   # Next.js Frontend Service
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Next.js pages & API routes
│   │   ├── context/            # React Context providers
│   │   └── config/             # Frontend configuration
│   └── public/                 # Static assets
└── docker-compose.yml          # Service orchestration
```

## Core Modules Implementation

### 1. Authentication Module (`backend/src/auth/`)

**Architecture**: Multi-strategy authentication with JWT and OAuth2

**Key Components**:
- **42 OAuth Strategy**: Integration with 42 School's OAuth system
- **JWT Strategy**: Token-based authentication for API requests
- **2FA Implementation**: TOTP (Time-based One-Time Password) using speakeasy
- **WebSocket Authentication**: Custom middleware for real-time connections

**Security Features**:
- Password hashing with bcrypt (salt rounds: 10)
- JWT token expiration and refresh
- 2FA QR code generation and validation
- WebSocket connection authentication
- CORS protection

### 2. Game Module (`backend/src/game/`)

**Architecture**: Real-time multiplayer game engine using WebSockets

**Key Components**:
- **Game Gateway**: WebSocket handler for real-time game communication
- **Game Service**: Core game logic and state management
- **Player Class**: Player state and behavior management
- **Room System**: Game room creation and management

**Game Features**:
- Real-time paddle movement and ball physics
- Multiple game modes and maps
- Spectator mode
- Game state persistence
- Player statistics and achievements
- Invitation system
- Tournament support

### 3. Chat Module (`backend/src/chat/`)

**Architecture**: Dual-mode chat system supporting both channels and direct messages

**Key Components**:
- **Chat Gateway**: WebSocket handler for real-time messaging
- **Channel Service**: Public/private channel management
- **Private Chat Service**: Direct messaging system
- **Message Persistence**: Database storage with Prisma

**Chat Features**:
- **Channels**: Public, private, and password-protected
- **Direct Messages**: One-on-one conversations
- **Admin Controls**: Kick, ban, mute, promote/demote
- **Message History**: Persistent message storage
- **Real-time Notifications**: Instant message delivery
- **User Status**: Online/offline/in-game indicators

### 4. Friends Module (`backend/src/friends/`)

**Architecture**: Social networking system with friend requests and blocking

**Key Features**:
- **Friend Requests**: Send, accept, decline friend requests
- **Friend Management**: Add, remove friends
- **Blocking System**: Block/unblock users
- **Status Tracking**: Friend online/offline status
- **Notifications**: Real-time friend activity notifications


### 5. User Management (`backend/src/users/`)

**Architecture**: Comprehensive user profile and preference management

**Key Features**:
- **Profile Management**: Avatar, bio, preferences
- **Statistics Tracking**: Game statistics and achievements
- **Account Settings**: Privacy settings, 2FA management
- **Profile Customization**: Custom avatars, status messages

### 6. Database Layer (`backend/prisma/`)

**Architecture**: PostgreSQL with Prisma ORM for type-safe database operations

**Key Features**:
- **Schema Management**: Declarative database schema
- **Migrations**: Version-controlled database changes
- **Type Safety**: Auto-generated TypeScript types
- **Query Builder**: Type-safe database queries
- **Relation Management**: Complex many-to-many relationships

### State Management
- **User Context**: Global user state and authentication
- **WebSocket Context**: Real-time connection management
- **Local State**: Component-level state with React hooks

## Docker Configuration

### Service Architecture
```yaml
services:
  ft_postgres:      # PostgreSQL database
    image: postgres:15.2-alpine
    volumes:
      - ./backend/data/db:/var/lib/postgresql/data
    
  ft_backend:       # NestJS backend
    build: ./backend
    ports: ["3000:3000"]
    depends_on: [ft_postgres]
    
  ft_frontend:      # Next.js frontend
    build: ./frontend
    ports: ["5173:5173"]
    depends_on: [ft_backend]
```

### Container Optimization
- **Multi-stage builds**: Optimized production images
- **Health checks**: Service dependency management
- **Volume mounts**: Persistent data storage
- **Environment variables**: Configuration management

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL (if running locally)

### Environment Setup
Create `.env` files in both `backend/` and `frontend/` directories:

**Backend Environment Variables**:
```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/transcendence"

# 42 OAuth
FORTYTWO_CLIENT_ID=your_client_id
FORTYTWO_CLIENT_SECRET=your_client_secret

# JWT Secrets
AUTH_JWT_SECRET=your_jwt_secret
AUTH_JWT_TOKEN_EXPIRES_IN=1d
TMP_JWT_SECRET=your_temp_jwt_secret
TMP_JWT_TOKEN_EXPIRES_IN=5m

# Domains
FRONTEND_DOMAIN=http://localhost:5173
BACKEND_DOMAIN=http://localhost:3000
```

**Frontend Environment Variables**:
```env
BACKEND_DOMAIN=http://localhost:3000
FRONTEND_DOMAIN=http://localhost:5173
```

### Quick Start
```bash
# Clone the repository
git clone https://github.com/mylastresort/ft_transcendence.git
cd ft_transcendence

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:3000
# API Documentation: http://localhost:3000/api
```

### Development Setup
```bash
# Backend development
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev

# Frontend development
cd frontend
npm install
npm run dev
```

## API Endpoints

### Authentication
- `POST /auth/register` - User registration via 42 OAuth
- `POST /auth/2fa/generate` - Generate 2FA QR code
- `POST /auth/2fa/verify` - Verify 2FA token
- `GET /auth/me` - Get current user profile

### Game
- `GET /game/rooms` - List active game rooms
- `POST /game/create` - Create new game room
- `GET /game/stats/:userId` - Get player statistics
- `GET /game/leaderboard` - Get game leaderboard

### Chat
- `GET /chat/channels` - List available channels
- `POST /chat/channels` - Create new channel
- `GET /chat/private/:userId` - Get private chat history
- `POST /chat/join/:channelId` - Join channel

### Users & Friends
- `GET /users/profile/:userId` - Get user profile
- `PUT /users/profile` - Update user profile
- `POST /friends/request` - Send friend request
- `GET /friends` - Get friends list
- `POST /friends/block` - Block user

## Game Features

### Core Gameplay
- **Real-time Physics**: 60 FPS game loop with smooth ball and paddle movement
- **Multiple Maps**: Different visual themes and layouts
- **Variable Speed**: Adjustable game speed settings
- **Score Tracking**: First to X points wins (configurable)

### Game Modes
- **Classic**: Traditional Pong gameplay
- **Invite Mode**: Private games between friends
- **Tournament**: Bracket-style competitions
- **Spectator**: Watch ongoing games

## Chat System Features

### Channel Types
- **Public Channels**: Open to all users
- **Private Channels**: Invite-only channels
- **Protected Channels**: Password-required channels

### Moderation Tools
- **Roles**: Owner, Administrator, Member
- **Actions**: Kick, Ban, Mute (with time limits)
- **Permissions**: Channel-specific user permissions

### Message Features
- **Real-time Delivery**: Instant message propagation
- **Message History**: Persistent chat logs
- **User Status**: Online/offline indicators
- **Typing Indicators**: Real-time typing status
---

**Built with ❤️ for 42 School's ft_transcendence project**
