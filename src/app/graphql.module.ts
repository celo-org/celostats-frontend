import { NgModule } from '@angular/core'
import { APOLLO_OPTIONS } from 'apollo-angular'
import { HttpLink } from 'apollo-angular/http'
import { InMemoryCache } from '@apollo/client/cache'

import { environment } from '../environments/environment'

export function createApollo(httpLink: HttpLink) {
  return {
    link: httpLink.create({uri: environment.graphqlBlockscoutUrl}),
    cache: new InMemoryCache(),
  }
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
