import axios from 'axios'
// eslint-disable-next-line no-unused-vars
import { StravaLocation } from '../types/strava'

export default async (id: string): Promise<StravaLocation> => {
  const response = await axios.post(
    'https://asia-northeast1-surakh-store.cloudfunctions.net/app/map',
    { id },
  )
  return response.data
}
