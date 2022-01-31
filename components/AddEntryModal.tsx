import { ChangeEvent, useState } from 'react'
import { SelectChangeEvent } from '@mui/material'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

import styles from '../styles/AddEntryModal.module.css'

const formFields = [
  {
    name: 'name',
    label: 'Restaurant Name',
    type: 'text',
  },
  {
    name: 'food_type',
    label: 'Food Type',
    type: 'text',
  },
  {
    name: 'stars_count',
    label: 'Stars Count',
    type: 'text',
    error: (value: string | null) => {
      if (!value) {
        return false
      }

      const number = parseFloat(value)
      const isValid = number >= 0 && number <= 5

      return !isValid
    },
    helperText: 'Enter a value between 0 and 5',
  },
  {
    name: 'address',
    label: 'Address',
    type: 'text',
  },
  {
    name: 'area',
    label: 'Area',
    type: 'text',
  },
  {
    name: 'city',
    label: 'City',
    type: 'text',
  },
  {
    name: 'neighborhood',
    label: 'Neighborhood',
    type: 'text',
  },
  {
    name: 'postal_code',
    label: 'Postal Code',
    type: 'text',
  },
  {
    name: 'state',
    label: 'State',
    type: 'text',
  },
  {
    name: 'country',
    label: 'Country',
    type: 'text',
  },
  {
    name: 'dining_style',
    label: 'Dining Style',
    type: 'text',
  },
  {
    name: 'payment_options',
    label: 'Payment Options',
    type: 'select',
    options: ['AMEX', 'Visa'],
  },
  {
    name: 'phone',
    label: 'Phone Number',
    type: 'text',
  },
]

export const AddEntryModal = () => {
  const [open, setOpen] = useState(false)

  const initialFormState: { [key: string]: any } = formFields.reduce(
    (acc, item) => {
      return {
        ...acc,
        [item.name]: item.type === 'select' ? [] : null,
      }
    },
    {
      _geoloc: {
        lat: 40.755684,
        lng: -73.968704,
      },
      price_range: '$30 and under',
      price: 2,
      image_url: 'https://www.opentable.com/img/restimages/74749.jpg',
      mobile_reserve_url: 'http://mobile.opentable.com/opentable/?restId=74749',
    }
  )

  const [formState, setFormState] = useState(initialFormState)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onSelectChange = (event: SelectChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setFormState({
      ...formState,
      [name]: value as string,
    })
  }

  const onFieldChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    setFormState({
      ...formState,
      [field]: e.currentTarget.value,
      phone_number: formState.phone,
      rounded_stars_count: parseInt(formState.stars_count, 10),
    })
  }

  const onSubmit = async () => {
    const isValid = Object.values(formState).every((value) => value !== null)

    if (!isValid) {
      return false
    }

    await fetch('/api/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formState),
    })
      .then((response) => {
        if (response.status === 200) {
          setOpen(false)
        }
      })
      .catch((e) => {
        throw new Error(`Error: ${e}`)
      })
  }

  return (
    <div className={styles.modalContainer}>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Restaurant
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Restaurant</DialogTitle>
        <DialogContent>
          <DialogContentText>Fill out the form below to add a new restaurant</DialogContentText>
          {formFields.map((field) => {
            if (field.type === 'select') {
              return (
                <Box sx={{ minWidth: 120 }} key={`select-${field.name}`}>
                  <FormControl fullWidth>
                    <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
                    <Select
                      multiple
                      labelId={`${field.name}-label`}
                      id={field.name}
                      name={field.name}
                      value={formState[field.name]}
                      label={field.label}
                      onChange={onSelectChange}
                    >
                      {field.options?.map((option) => {
                        return (
                          <MenuItem key={`${option}_${field.name}`} value={option}>
                            {option}
                          </MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>
                </Box>
              )
            }

            return (
              <TextField
                key={`text-${field.name}`}
                margin="dense"
                id={field.name}
                value={formState[field.name]}
                label={field.label}
                type={field.type}
                fullWidth
                variant="standard"
                onChange={(e) => onFieldChange(e, field.name)}
                error={field.error && field.error(formState[field.name])}
                helperText={field.helperText}
              />
            )
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={onSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default AddEntryModal
