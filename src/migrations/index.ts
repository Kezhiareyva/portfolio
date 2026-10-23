import * as migration_20261023_181301_initial from './20261023_181301_initial'

export const migrations = [
  {
    up: migration_20261023_181301_initial.up,
    down: migration_20261023_181301_initial.down,
    name: '20261023_181301_initial',
  },
]
