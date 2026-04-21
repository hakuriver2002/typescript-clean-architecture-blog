# Personal Blog API + Frontend

Production-ready personal blog with Clean Architecture backend and Next.js frontend.

## Backend stack
- Node.js + Express + TypeScript
- Clean Architecture (`domain`, `application`, `infrastructure`, `interface`)
- Prisma ORM + Supabase PostgreSQL
- JWT access tokens + rotating refresh tokens
- HTTP-only cookie authentication
- Zod validation + centralized error handling

## Authentication model
- `access_token` cookie (HTTP-only, short-lived)
- `refresh_token` cookie (HTTP-only, long-lived, rotated on refresh)
- Refresh tokens are stored hashed in DB and revoked on rotation/logout.

## API endpoints
Base: `/api/v1`

Auth:
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

Posts:
- `GET /posts`
- `GET /posts/slug/:slug`
- `GET /posts/me`
- `POST /posts`
- `PATCH /posts/:id`
- `DELETE /posts/:id`

## Database schema (Prisma)
- `User`: id, fullName, email, passwordHash, googleId, role, status, avatarUrl
- `Article`: id, title, slug, content, excerpt, thumbnailUrl, category, status, isFeatured, viewCount, publishedAt, authorId
- `ArticleReview`: id, articleId, reviewerId, action, note
- `Comment`: id, articleId, userId, parentId, content, status, hiddenById, hiddenReason
- `Notification`: id, userId, type, title, body, isRead, articleId, commentId, actorId
- `ArticleLike`: id, articleId, userId with unique `(articleId, userId)`
- `ArticleBookmark`: id, articleId, userId with unique `(articleId, userId)`
- `AthleteProfile`: id, userId, dateOfBirth, height, weight, club, discipline, currentBelt, coachName, bio, isPublic
- `Achievement`: id, athleteId, tournamentName, level, medal, year, discipline, location, weightCategory
- `Belt`: id, athleteId, belt, achievedAt, examiner, location

## RBAC matrix
| Feature | Admin | Editor | Trainer | Member | Guest |
|---|---|---|---|---|---|
| Read public article | ✅ | ✅ | ✅ | ✅ | ✅ |
| Read internal article | ✅ | ✅ | ✅ | ✅ | ❌ |
| Create article | ✅ | ✅ | ✅ | ❌ | ❌ |
| Review article | ✅ | ✅ | ❌ | ❌ | ❌ |
| Delete any article | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage users | ✅ | ❌ | ❌ | ❌ | ❌ |
| View dashboard | ✅ | ✅ | ❌ | ❌ | ❌ |
| Comment | ✅ | ✅ | ✅ | ✅ | ❌ |
| Like / Bookmark | ✅ | ✅ | ✅ | ✅ | ❌ |
| Athlete profile | ✅ | ✅ | ✅ | ✅ | ❌ (public-only) |

RBAC helper is implemented in [rbac.ts]

## Setup (backend)
1. `npm install`
2. `copy .env.example .env`
3. Set `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`
4. `npm run prisma:generate`
5. `npm run prisma:migrate -- --name init`
6. `npm run dev`

## Setup (frontend)
1. `cd frontend`
2. `npm install`
3. `copy .env.local.example .env.local`
4. Fill `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and bucket name
5. Create Supabase Storage bucket (default: `post-images`) and allow uploads for authenticated/anon as needed by your policy
6. `npm run dev`

## Build
Backend:
- `npm run build`

Frontend:
- `cd frontend && npm run build`
