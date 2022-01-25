import '../styles/globals.css'
import type { AppProps } from 'next/app'
import getSearchClient from '../helpers/searchClient'

function MyApp({ Component, pageProps }: AppProps) {
  const client = getSearchClient()
  return <Component {...pageProps} client={client} />
}

export default MyApp
