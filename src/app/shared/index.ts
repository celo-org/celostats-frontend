export * from './utils'
import * as animations from './animations'
export { animations }

export * from './ethstats.service'

import { EthstatsService } from './ethstats.service'
import { GRAPHQL_PROVIDERS } from './graphql'

export const PROVIDERS = [
  EthstatsService,
  ...GRAPHQL_PROVIDERS,
]
