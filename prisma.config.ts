import { defineConfig } from 'prisma/config'
import { config } from 'dotenv'

// The Prisma CLI doesn't know about Next.js's .env.local convention — load it explicitly.
config({ path: '.env.local' })

// DATABASE_URL_UNPOOLED is required for migrations (prisma migrate dev/deploy)
export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL_UNPOOLED,
  },
  migrations: {
    // Prisma 7: seed command lives here, not in package.json
    seed: 'npx tsx prisma/seed.ts',
  },
})
