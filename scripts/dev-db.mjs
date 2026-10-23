// Embedded Postgres for local development without Docker.
// Same credentials and port as the postgres service in docker-compose.yml.
import EmbeddedPostgres from 'embedded-postgres'
import { existsSync } from 'node:fs'
import path from 'node:path'

const databaseDir = path.resolve('.pgdata')
const firstRun = !existsSync(path.join(databaseDir, 'PG_VERSION'))

const pg = new EmbeddedPostgres({
  databaseDir,
  user: 'kezhia',
  password: 'kezhia',
  port: 5432,
  persistent: true,
  onLog: () => {},
})

if (firstRun) await pg.initialise()
await pg.start()
if (firstRun) await pg.createDatabase('kezhia')

console.log('Postgres is running on postgres://kezhia:***@127.0.0.1:5432/kezhia (Ctrl+C to stop)')

const stop = async () => {
  await pg.stop()
  process.exit(0)
}
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
