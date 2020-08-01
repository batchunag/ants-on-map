import express from 'express'
import cors from 'cors'
import axios from 'axios'

const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.post('/map', async (req, res) => {
  const timestamp = Math.round(Date.now() / 1000)
  const { id } = req.body
  const response = await axios.get(`https://strava.com/beacon/${id}`, {
    data: { minimum_timestamp: timestamp - 5 },
    headers: {
      referer: 'strava.com',
      'X-Requested-With': 'XMLHttpRequest',
    },
  })
  res.send(response.data)
})

export default app
// app.listen(3001)
