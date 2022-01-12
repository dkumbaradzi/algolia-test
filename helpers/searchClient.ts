import algoliasearch, { SearchClient } from 'algoliasearch';

let client: SearchClient | undefined;

const getSearchClient = () => {
  const ssrMode = typeof window === undefined;
  if (!client || ssrMode) {
    client = algoliasearch(
      'OILU3UE8SF',
      '7e49325517d6df4fbda1469b1fd8b261'
    );
  }

  return client;
}

export default getSearchClient;