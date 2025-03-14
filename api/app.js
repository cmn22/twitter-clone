// Import necessary modules
require('dotenv').config(); // Make sure you load environment variables

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const usersRoutes = require('./routes/user');
const feedRoutes = require('./routes/feed');
const notificationRoutes = require('./routes/notification');
const chatRoutes = require('./routes/chat');
const searchRoutes = require('./routes/search');

const { errorLogger, errorResponder } = require('./middlewares/error-handler');
const { NODE_ENV, COOKIE_SECRET } = require('./utils/config');

const app = express();

const isDev = NODE_ENV === 'development';

app.use(morgan('dev'));
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin',
    },
  })
);
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      'img-src': ["'self'", 'https: data:'],
      'script-src': ["'self'", 'accounts.google.com'],
      'default-src': ["'self'", '*.google.com'],
    },
  })
);

if (isDev) {
  app.use(
    cors({
      origin: 'http://localhost:3000',
      optionsSuccessStatus: 200,
      credentials: true,
    })
  );
}

app.use(express.json({ type: 'application/json' }));
app.use(cookieParser(COOKIE_SECRET));

if (!isDev) {
  app.use(express.static(path.join(__dirname, 'public')));
}

app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/search', searchRoutes);

if (!isDev) {
  app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
  });
}

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use(errorLogger);
app.use(errorResponder);

// Set the port and start the server
const PORT = 5001; // Use the port from .env or fallback to 5000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});