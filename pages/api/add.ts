import type { NextApiRequest, NextApiResponse } from 'next'
import { getAdminClient } from '../../helpers/searchClient'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(400).send({ message: 'Only POST requests allowed' })
    return
  }

  const apiKey = process.env.ALGOLIA_ADMIN_KEY || ''
  if (!apiKey.length) {
    res.status(500)
  }
  const adminClient = getAdminClient(apiKey)

  if (!adminClient) {
    res.status(500)
  }

  const index = adminClient?.initIndex('dev_restaurants')

  if (!index) {
    res.status(500)
  }

  const formState = req.body

  index
    .saveObject(formState, {
      autoGenerateObjectIDIfNotExist: true,
    })
    .then((response) => {
      res.status(200).json(response)
      res.end()
    })
    .catch(() => {
      res.status(400)
    })
}
