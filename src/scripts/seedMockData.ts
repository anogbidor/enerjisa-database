// src/scripts/seedMockData.ts
import { pool } from '../db'
import {
  mockDistributors as distributors,
  mockDealers as dealers,
  mockStations as stations,
} from '../mock/mockData'

console.log('📦 Running seedMockData.ts...')

async function seed() {
  const client = await pool.connect()
  const dbName = await client.query('SELECT current_database(), current_user')
  console.log('🔍 Connected to:', dbName.rows[0])

  try {
    console.log('🌱 Seeding mock data...')
    await client.query('BEGIN')

    // Insert Distributors
    for (const distributor of distributors) {
      await client.query(
        `INSERT INTO distributors (name, license_no)
         VALUES ($1, $2)
         ON CONFLICT (license_no) DO NOTHING`,
        [distributor.name, distributor.license_no]
      )
    }

    // Insert or Update Dealers (simulate transfer)
    for (const dealer of dealers) {
      const distributorRes = await client.query(
        `SELECT id FROM distributors WHERE license_no = $1`,
        [dealer.distributor_license_no]
      )
      const distributorId = distributorRes.rows[0]?.id || null

      const dealerRes = await client.query(
        `SELECT id, distributor_id FROM dealers WHERE license_no = $1`,
        [dealer.license_no]
      )

      if (dealerRes.rows.length > 0) {
        const existing = dealerRes.rows[0]

        if (existing.distributor_id !== distributorId) {
          // Simulate dealer transfer
          await client.query(
            `UPDATE dealers SET distributor_id = $1 WHERE id = $2`,
            [distributorId, existing.id]
          )

          console.log(`🔁 Dealer transferred: ${dealer.license_no}`)

          // Log to dealer_history
          await client.query(
            `INSERT INTO dealer_history (
              dealer_id,
              old_distributor_id,
              new_distributor_id
            ) VALUES ($1, $2, $3)`,
            [existing.id, existing.distributor_id, distributorId]
          )
        }
      } else {
        await client.query(
          `INSERT INTO dealers (name, license_no, distributor_id)
           VALUES ($1, $2, $3)
           ON CONFLICT (license_no) DO NOTHING`,
          [dealer.name, dealer.license_no, distributorId]
        )
      }
    }

    // Insert Stations
    for (const station of stations) {
      const distributorRes = await client.query(
        `SELECT id FROM distributors WHERE license_no = $1`,
        [station.distributor_license_no]
      )
      const dealerRes = await client.query(
        `SELECT id FROM dealers WHERE license_no = $1`,
        [station.dealer_license_no]
      )

      const distributorId = distributorRes.rows[0]?.id || null
      const dealerId = dealerRes.rows[0]?.id || null

      await client.query(
        `INSERT INTO stations (
            license_no, name, city, district, address,
            status, license_start, license_end,
            contract_start, contract_end, is_cancelled,
            distributor_id, dealer_id
          ) VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8,
            $9, $10, $11,
            $12, $13
          )
         ON CONFLICT (license_no) DO NOTHING`,
        [
          station.license_no,
          station.name,
          station.city,
          station.district,
          station.address,
          station.status,
          station.license_start,
          station.license_end,
          station.contract_start,
          station.contract_end,
          station.is_cancelled,
          distributorId,
          dealerId,
        ]
      )
    }

    await client.query('COMMIT')
    console.log('✅ Seeding complete.')
  } catch (err: unknown) {
    await client.query('ROLLBACK')
    if (err instanceof Error) {
      console.error('❌ Seeding failed:', err.message)
    } else {
      console.error('❌ Seeding failed:', err)
    }
  } finally {
    client.release()
  }
}

seed().catch((err) => console.error('🔥 Unhandled error in seed:', err.message))
