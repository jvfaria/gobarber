import express from 'express';
import routes from './routes/index';
import './database';
import 'reflect-metadata';

const app = express();
app.use(express.json());
app.use(routes);

app.listen(3333, () => {
  // eslint-disable-next-line no-console
  console.log('Skull is running on port: 3333');
});
