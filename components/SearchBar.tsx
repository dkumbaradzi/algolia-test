import { useCallback, FormEvent } from 'react'
import { useRouter } from 'next/router'
import { SearchBox } from 'react-instantsearch-dom'
import styles from '../styles/SearchBar.module.css'

const SearchBar = () => {
  const router = useRouter()
  const { params, ...queryParams } = router.query
  const currentRefinement = queryParams.q ? queryParams.q.toString() : ''

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const form = e.currentTarget
      const searchInput = form.querySelector('input[type="search"]') as HTMLInputElement

      if (searchInput) {
        router.push(
          {
            pathname: '/search/1',
            query: {
              ...queryParams,
              q: searchInput.value,
            },
          },
          undefined,
          { shallow: true }
        )
      }
      console.log(e.currentTarget)
    },
    [router, queryParams]
  )

  const onReset = useCallback(() => {
    const { q, ...otherParams } = queryParams;
    router.push(
      {
        pathname: '/search/1',
        query: {
          ...otherParams
        },
      },
      undefined,
      { shallow: true }
    )
  }, [router, queryParams])

  return (
    <SearchBox
      defaultRefinement={currentRefinement}
      onSubmit={onSubmit}
      onReset={onReset}
      className={styles.container}
    />
  )
}

export default SearchBar
