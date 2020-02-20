import { Injectable } from '@angular/core'
import { Query } from 'apollo-angular'
import gql from 'graphql-tag'

export interface CeloValidatorGroup {
  address: string
  name: string
}

export interface AllGroupNamesResponse {
  groups: CeloValidatorGroup[]
}

@Injectable({
  providedIn: 'root'
})
export class AllGroupNamesQueryService extends Query<AllGroupNamesResponse> {
  document = gql`
    query validatorsGroupsNames {
      groups: celoValidatorGroups {
        address
        name
      }
    }
  `
}

export const BLOCKSCOUT_QUERIES_PROVIDERS = [AllGroupNamesQueryService]
