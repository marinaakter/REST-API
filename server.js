import express from 'express';
import mongoose from 'mongoose';
import { APP_PORT, DB_URL } from './config';
import errorHandler from './middlewares/errorHandler';
import routes from './routes';


const app = express();


app.use(express.json());
app.use('/api',routes)


//database connection
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (err) => {
  console.error.bind(err);
});
db.once("open", () => {
  console.log("Database connected...");
});




app.use(errorHandler)
app.listen(APP_PORT, ()=> console.log(`Listening on Port ${APP_PORT}`));