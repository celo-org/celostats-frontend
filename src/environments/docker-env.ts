export const DOCKER_ENV = {
  ethstatsService: '%%DOCKER_ENV%%ETHSTATS_SERVICE%%',
  blockscoutUrl: '%%DOCKER_ENV%%BLOCKSCOUT_URL%%',
  graphqlBlockscoutUrl: '%%DOCKER_ENV%%GRAPHQL_BLOCKSCOUT_URL%%',
  submenuExplorer: '%%DOCKER_ENV%%SUBMENU_EXPLORER%%',
  submenuBlockscout: '%%DOCKER_ENV%%SUBMENU_BLOCKSCOUT%%',
}

Object.entries(DOCKER_ENV)
  .filter(([variable, value]) => value.match(/%%DOCKER_ENV%%/))
  .forEach(([variable]) => delete DOCKER_ENV[variable])
