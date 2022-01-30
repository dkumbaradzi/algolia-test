import algoliasearch, { SearchClient } from 'algoliasearch'

let client: SearchClient | undefined
let adminClient: SearchClient | undefined

const getSearchClient = (admin = false) => {
  const key = admin ? process.env.ALGOLIA_ADMIN_KEY : process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY

  if (!key) {
    return null
  }

  const ssrMode = typeof window === undefined
  if (!client || ssrMode || admin) {
    client = algoliasearch('OILU3UE8SF', key)
  }

  return client
}

export const getAdminClient = (apiKey: string) => {
  const ssrMode = typeof window === undefined
  if (!adminClient || ssrMode) {
    adminClient = algoliasearch('OILU3UE8SF', apiKey)
  }

  return adminClient
}

export default getSearchClient
