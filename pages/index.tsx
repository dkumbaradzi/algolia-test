import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css';
import SearchBar from '../components/SearchBar';
import { InstantSearch, SearchBox, Hits, RefinementList, Configure, DynamicWidgets } from 'react-instantsearch-dom';
import getSearchClient from '../helpers/searchClient';

const Home: NextPage = () => {
  const client = getSearchClient();
  return (
    <div className={styles.container}>
      <Head>
        <title>Algolia Test</title>
        <meta name="description" content="Algolia prototype application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='container'>
        {client && (
          <InstantSearch searchClient={client} indexName="dev_restaurants">
            <div>
              <SearchBar />
              <Configure facets={['*']} maxValuesPerFacet={20} />
              <RefinementList attribute="food_type" />
              <Hits />
            </div>
          </InstantSearch>
        )}
      </div>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home
