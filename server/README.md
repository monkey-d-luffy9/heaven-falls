# Loyalty Game Hub - Backend API

Express.js API with Prisma ORM and PostgreSQL database.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL (Neon recommended for Vercel)
- **Authentication**: JWT

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

Create a free PostgreSQL database at [Neon](https://neon.tech):

1. Create account at https://neon.tech
2. Create a new project
3. Copy the connection string

### 3. Configure Environment

Update `.env` with your database URL:

```env
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
```

### 4. Initialize Database

```bash
# Push schema to database
npm run db:push

# Seed initial data
npm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Server runs at http://localhost:5001

## Database Commands

| Command | Description |
|---------|-------------|
| `npm run db:push` | Push schema changes to database |
| `npm run db:migrate` | Create and run migrations |
| `npm run db:seed` | Seed database with initial data |
| `npm run db:studio` | Open Prisma Studio (database GUI) |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update profile

### Games
- `GET /api/games` - Get all games
- `GET /api/games/status` - Get games with cooldown status
- `POST /api/games/:id/play` - Play a game

### Bonuses
- `GET /api/bonuses` - Get all bonuses with status
- `POST /api/bonuses/:id/claim` - Claim a bonus

### User
- `GET /api/user` - Get user transactions
- `GET /api/user/achievements` - Get achievements
- `GET /api/user/referrals` - Get referral stats
- `GET /api/user/vip` - Get VIP info

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

### Admin (requires admin role)
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/users` - List users
- `POST /api/admin/users` - Create user
- `POST /api/admin/users/:id/bonus` - Add bonus to user
- `GET/POST/PUT/DELETE /api/admin/games` - Game management
- `GET/POST/PUT /api/admin/bonuses` - Bonus management

## Deploy to Vercel

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Deploy

```bash
vercel
```

### 3. Add Environment Variables

In Vercel dashboard, add:
- `DATABASE_URL` - Your Neon PostgreSQL connection string
- `JWT_SECRET` - A secure random string
- `NODE_ENV` - Set to `production`

## Default Admin

After seeding:
- **Username**: admin
- **Password**: admin123
