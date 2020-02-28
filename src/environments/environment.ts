// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  ethstatsService: 'wss://baklava-ethstats.celo-testnet.org',
  // ethstatsService: 'ws://localhost:3000',
  blockscoutUrl: 'https://baklava-blockscout.celo-testnet.org',
  graphqlBlockscoutUrl: 'https://baklava-blockscout.celo-testnet.org/graphiql',
  submenu: {
    blockscout: 'https://baklava-blockscout.celo-testnet.org/',
    explorer: 'https://celo.org/validators/explore',
  },
  menu: {
    github: 'https://github.com/celo-org',
    blog: 'https://medium.com/CeloHQ',
  },
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error'  // Included with Angular CLI.
