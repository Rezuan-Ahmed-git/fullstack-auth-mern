import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import connect from './database/connection.js';

const app = express();

/** middlewares */
app.use([express.json(), cors(), morgan('dev')]);
app.disable('x-powered-by'); //less hacker know about our stack

const port = 8080;

/** HTTP GET Request */
app.get('/', (req, res) => {
  res.status(200).json('Home GET Request');
});

/** start server only when we have valid connection */
connect()
  .then(() => {
    try {
      app.listen(port, () => {
        console.log(`Server connected to http://localhost:${port}`);
      });
    } catch (error) {
      console.log('Cannot connect to the server');
    }
  })
  .catch((error) => {
    console.log('Invalid database connection');
  });
