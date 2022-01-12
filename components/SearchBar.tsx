import { useEffect, useState } from 'react';
import { SearchBox } from 'react-instantsearch-dom';
import styles from '../styles/SearchBar.module.css'
import getSearchClient from '../helpers/searchClient';
import { SearchClient } from 'algoliasearch';

const SearchBar = () => {
  console.log();

  return (
      <SearchBox className={styles.container} />
  )
}

export default SearchBar;