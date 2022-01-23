import { useState } from 'react';
import styles from '../styles/Hit.module.css';
import Image from 'next/image';
import StarIcon from '../public/star.svg'
import StarIconFilled from '../public/star-filled.svg'
import getSearchClient from '../helpers/searchClient';
import Button from '@mui/material/Button';


type GeoLocation = {
  lat: number;
  lng: number;
}

type HighlightResult = {
  food_type: {
    matchLevel: string;
    matchedWords: string[];
    value: string;
  }
}

export type Restaurant = {
  __position: number;
  _geoloc: GeoLocation;
  _highlightResult: HighlightResult;
  address: string;
  area: string;
  city: string;
  country: string;
  dining_style: string;
  food_type: string;
  image_url: string;
  mobile_reserve_url: string;
  name: string;
  neighborhood: string;
  objectID: string;
  phone: string;
  phone_number: string;
  postal_code: string;
  payment_options: string[];
  price: number;
  price_range: string;
  reserve_url: string;
  reviews_count: number;
  stars_count: number;
  state: string;
}

type Props = {
  hit: Restaurant;
}

const Stars = ({ keyId = '', filled = false }) => {
  const Icon = filled ? StarIconFilled : StarIcon
  return (
    <div className={styles.starsContainer}>
      {[...Array(5)].map((_, i) => {
        return <Icon className={styles.star} key={`star${keyId}_${i}`} width='15px' height='15px' />
      })}
    </div>
  )
}


const Hit = ({ hit }: Props) => {
  const [deleted, setDeleted] = useState(false);
  const client = getSearchClient(true);
  const index = client.initIndex('dev_restaurants')
  // index.searchForFacetValues('food_type', '*').then(({ facetHits }) => {
  //   console.log(facetHits);
  // });
  const deleteEntry = () => {
    index.deleteObject(hit.objectID).then(response => {
      console.log('response', response);
      setDeleted(true);
    }).catch(error => {
      console.log('error', error)
    })
  }
  // console.log('hit', hit);
  const priceMarker = '$';

  const renderStars = () => {
    const width = (hit.stars_count / 5) * 100
    return (
      <div className={styles.rating}>
        <Stars />

        <div className={styles.starsHighlight} style={ {width} }>
          <Stars keyId='_highlight' filled />
        </div>
        <span>{`(${hit.stars_count})`}</span>
      </div>
    )
  }

  if (deleted) {
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <Image className={styles.image} src={hit.image_url} alt="" width={75} height={75} />
      </div>
      <div className={styles.content}>
        <div className={styles.mainContent}>
          <span>{hit.name}</span>
          <span>{hit.dining_style}</span>
          <span>{hit.food_type}</span>
          <div className={styles.price}>
            <span><strong>{`${priceMarker.repeat(hit.price)}`}</strong> {`(${hit.price_range})`}</span>
            {renderStars()}
            
          </div>
        </div>
        <div className={styles.restaurantInfo}>
          <span>Tel: {hit.phone_number}</span>
          <span>{`${hit.address}, ${hit.city}, ${hit.state}, ${hit.country}`}</span>
          <Button variant="outlined" onClick={deleteEntry}>Delete</Button>
        </div>
      </div>
    </div>
  )
}

export default Hit;