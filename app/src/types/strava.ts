/* eslint-disable camelcase */
export interface StravaLocation {
  streams: {
    timestamp?: number[]
    latlng?: [number, number][]
  }
  live_activity_id: number
  athlete_id: number
  update_time: number
  utc_offset: number
  activity_type: number
  status: number
  stats: {
    distance: number
    moving_time: number
    elapsed_time: number
  }
  battery_level: number
  source_app: 'Strava'
}
