import { DOCKER_ENV } from './docker-env'

export const environment = {
  production: true,
  ethstatsService: DOCKER_ENV.ethstatsService || 'wss://baklava-ethstats.celo-testnet.org',
  blockscoutUrl: DOCKER_ENV.blockscoutUrl || 'https://baklava-blockscout.celo-testnet.org',
  graphqlBlockscoutUrl: DOCKER_ENV.graphqlBlockscoutUrl || 'https://baklava-blockscout.celo-testnet.org/graphiql',
  submenu: {
    blockscout: DOCKER_ENV.submenuBlockscout || 'https://baklava-blockscout.celo-testnet.org/',
    explorer: DOCKER_ENV.submenuExplorer || 'https://celo.org/validators/explore',
  },
}
