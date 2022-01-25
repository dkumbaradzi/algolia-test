import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useCallback, PointerEvent } from 'react'
import { SearchClient } from 'algoliasearch'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import SearchBar from '../../components/SearchBar'
import Hit from '../../components/Hit'
import AddEntryModal from '../../components/AddEntryModal'
import { InstantSearch, Hits, RefinementList, Configure, Pagination } from 'react-instantsearch-dom'

type SearchStateType = {
  query: string
  page: number
  refinementList?: {
    food_type: string[]
  }
}

type Props = {
  client: SearchClient
}

const Home: NextPage<Props> = ({ client }: Props) => {
  const router = useRouter()

  const onPageChange = useCallback(
    (evt: PointerEvent<HTMLAnchorElement>) => {
      const { params, ...queryParams } = router.query

      router.push(
        {
          pathname: `/search/${evt.currentTarget.innerText}`,
          query: queryParams,
        },
        undefined,
        { shallow: true }
      )
    },
    [router]
  )

  useEffect(() => {
    if (router) {
      const paginationLinks = Array.prototype.slice.call(
        document.getElementsByClassName('ais-Pagination-link')
      )

      for (let i = 0; i < paginationLinks.length; i++) {
        const element = paginationLinks[i]
        element.addEventListener('click', onPageChange)
      }

      return () => {
        for (let i = 0; i < paginationLinks.length; i++) {
          const element = paginationLinks[i]
          element.removeEventListener('click', onPageChange)
        }
      }
    }
  }, [router, onPageChange])

  const onSearchStateChange = (searchState: SearchStateType) => {
    const { refinementList } = searchState
    const { params, ...otherParams } = router.query
    const { food_type, ...queryParams } = otherParams
    const combinedParams = {
      ...queryParams,
      ...(refinementList && refinementList.food_type && refinementList.food_type.length
        ? {
            food_type: refinementList.food_type.join(','),
          }
        : {}),
    }

    router.push(
      {
        pathname: `/search/${searchState.page}`,
        query: combinedParams,
      },
      undefined,
      { shallow: true }
    )
  }

  const page = (router && router.query && router.query.params && router.query.params[1]) || 1
  const foodTypeParam = (router && router.query && router.query.food_type) || []
  const defaultRefinements =
    typeof foodTypeParam === 'string' ? foodTypeParam.split(',') : foodTypeParam

  return (
    <div className={styles.container}>
      <Head>
        <title>Algolia Test</title>
        <meta name="description" content="Algolia prototype application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {client && (
          <InstantSearch
            onSearchStateChange={onSearchStateChange}
            searchClient={client}
            indexName="dev_restaurants"
          >
            <div>
              <SearchBar />
              <Configure facets={['*']} maxValuesPerFacet={20} />
              <div className={styles.content}>
                <div className={styles.sidebar}>
                  <AddEntryModal />
                  <RefinementList
                    attribute="food_type"
                    showMore
                    showMoreLimit={20}
                    defaultRefinement={defaultRefinements}
                  />
                </div>
                <div className={styles.resultsContainer}>
                  <Hits hitComponent={Hit} />
                  <Pagination className={styles.paginationContainer} defaultRefinement={page} />
                </div>
              </div>
            </div>
          </InstantSearch>
        )}
      </main>

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
