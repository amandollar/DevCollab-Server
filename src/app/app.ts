import express from 'express'
import cors from "cors";
import indexRouter from '../routes/index.routes';
const app = express()

app.use(cors({ origin: '*', credentials: true }))
app.use(express.json())


app.use('/v1/api', indexRouter);

app.get('/', (_, res) => res.send('DevCollab API 🔥'))

export default app
