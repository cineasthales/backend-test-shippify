import express from 'express'
import RouteController from '../controllers/RouteController.js'

const app = express()

app.use(express.json())

app.post('/routes', RouteController.generate)

export default app