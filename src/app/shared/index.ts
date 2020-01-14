export * from './utils'

export * from './ethstats.service'

import { EthstatsService } from './ethstats.service'

export const PROVIDERS = [
  EthstatsService,
]
