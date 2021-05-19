# Release Process for stats.celo.org

## Versioning

N/A

## Identifying releases

Releases are identified by commit hash.

## Build process

Upon pushes to this github repo, Docker images are built automatically by Google Cloud Build. These builds are tagged with the corresponding commit hash. 

On Google Cloud, in Kubernetes Engine, deployments can be updated by changing the `image` field in the yaml file to match the git commit hash you wish to deploy. The production site is in the `celo-testnet-production` project, in the `rc1-celostats-frontend` workload.

## Testing


## Vulnerability Disclosure


## Dependencies


## Dependents


