const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorMiddleWare = require('./middleware/error.middleware');
//TO see who tried to accces the server
const morgan = require('morgan');
const userRoute = require('./routes/userRoute');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
  })
);
app.use(cookieParser());
app.use('/api/v1/user', userRoute); //all user related work
app.all('*', (req, res) => {
  res.status(404).send('OOPS! 404 page not found :(');
});
app.use(errorMiddleWare);

module.exports = app;
