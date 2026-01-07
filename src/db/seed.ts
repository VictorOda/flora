import { sql } from 'drizzle-orm'
import { db } from './index'
import { plants, logs, photos, profiles } from './schema.public'
import { env } from '@/env'
import { createClient } from '@supabase/supabase-js'

/**
 * Safety guard
 */
if (env.DB_SEEDING !== true) {
  console.log('Seeding disabled. Set DB_SEEDING=true to proceed.')
  process.exit(0)
}

const supabaseAdmin = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SECRET)

const USERS = {
  victor: {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'victor@test.com',
    username: 'victor',
    firstName: 'Victor',
    lastName: 'Oda',
  },
  jessica: {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'jessica@test.com',
    username: 'jessica',
    firstName: 'Jessica',
    lastName: 'Andrade',
  },
}

const PLANTS = {
  monstera: {
    id: '10000000-0000-0000-0000-000000000001',
    name: 'Monstera Deliciosa',
    userId: USERS.victor.id,
  },
  snake: {
    id: '10000000-0000-0000-0000-000000000002',
    name: 'Snake Plant',
    userId: USERS.victor.id,
  },
  ficusElastica: {
    id: '10000000-0000-0000-0000-000000000003',
    name: 'Ficus Elastica',
    userId: USERS.victor.id,
  },
  cactus: {
    id: '10000000-0000-0000-0000-000000000004',
    name: 'Cactus',
    userId: USERS.jessica.id,
  },
}

const LOGS = {
  monsteraLog01: {
    id: '20000000-0000-0000-0000-000000000001',
    userId: USERS.victor.id,
    plantId: PLANTS.monstera.id,
    description: 'New leaf unfurled 🌱',
    date: new Date('2024-03-01T12:00:00Z'),
  },
  monsteraLog02: {
    id: '20000000-0000-0000-0000-000000000002',
    userId: USERS.victor.id,
    plantId: PLANTS.monstera.id,
    description: 'Leaf died ☠️',
    date: new Date('2024-03-01T12:00:00Z'),
  },
  ficusLog01: {
    id: '20000000-0000-0000-0000-000000000003',
    userId: USERS.victor.id,
    plantId: PLANTS.ficusElastica.id,
    description: 'Growing like crazy',
    date: new Date('2024-03-01T12:00:00Z'),
  },
  cactusLog01: {
    id: '20000000-0000-0000-0000-000000000004',
    userId: USERS.jessica.id,
    plantId: PLANTS.cactus.id,
    description: 'Leaf died ☠️',
    date: new Date('2024-03-01T12:00:00Z'),
  },
}

const PHOTOS = [
  {
    id: '30000000-0000-0000-0000-000000000001',
    logId: LOGS.monsteraLog01.id,
    path: 'seed/victor/monstera-1.jpg',
    order: 1,
  },
  {
    id: '30000000-0000-0000-0000-000000000002',
    logId: LOGS.monsteraLog01.id,
    path: 'seed/victor/monstera-2.jpg',
    order: 2,
  },
]

async function seed() {
  console.log('Seeding database (deterministic)...')

  /**
   * 1️⃣ Auth users (must exist first)
   */
  for (const user of Object.values(USERS)) {
    await supabaseAdmin.auth.admin.createUser({
      id: user.id,
      email: user.email,
      password: 'password123',
      email_confirm: true,
      user_metadata: {
        username: user.username,
        first_name: user.firstName,
        last_name: user.lastName,
      },
    })
  }

  // await db.execute(sql`
  //   insert into auth.users (id, email, raw_user_meta_data)
  //   values
  //     (${USERS.victor.id}, ${USERS.victor.email}, ${{ username: USERS.victor.username, first_name: USERS.victor.firstName, last_name: USERS.victor.lastName }}),
  //     (${USERS.jessica.id}, ${USERS.jessica.email}, ${{ username: USERS.jessica.username, first_name: USERS.jessica.firstName, last_name: USERS.jessica.lastName }})
  // `)

  console.log('Seeded users')

  /**
   * 2️⃣ Profiles (created by trigger normally but inserted manually here)
   */
  // await db.insert(profiles).values(
  //   Object.values(USERS).map((user) => ({
  //     id: user.id,
  //     username: user.username,
  //     firstName: user.firstName,
  //     lastName: user.lastName,
  //   })),
  // )

  /**
   * 3️⃣ Plants
   */
  await db.insert(plants).values(
    Object.values(PLANTS).map((p) => ({
      id: p.id,
      userId: p.userId,
      name: p.name,
    })),
  )

  console.log('Seeded plants')

  /**
   * 4️⃣ Logs
   */
  await db.insert(logs).values(
    Object.values(LOGS).map((l) => ({
      id: l.id,
      userId: l.userId,
      plantId: l.plantId,
      description: l.description,
      date: l.date,
    })),
  )

  console.log('Seeded logs')

  /**
   * 5️⃣ Photos
   */
  await db.insert(photos).values(PHOTOS)

  console.log('Seeded photos')

  console.log('Deterministic seed completed')
}

seed()
  .catch((err) => {
    console.error('Seed failed', err)
    process.exit(1)
  })
  .finally(() => process.exit(0))
