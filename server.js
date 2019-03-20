const Sentry = require('@sentry/node');
const express = require('express');
const parseurl = require('parseurl');
const path = require('path');

const app = express();
app.set('trust proxy', true);

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENVIRONMENT
  });
}

// The Sentry request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());
app.use((_, res, next) => {
  res.set('X-Robots-Tag', 'noindex, nofollow');
  next();
});
app.use(express.static(path.join(__dirname, '_site')));

app.get('/', (_, res) => res.redirect(301, '/docs/v3/'));

// The Sentry error handler must be before any other error middleware
app.use(Sentry.Handlers.errorHandler());
app.use((_, res) => {
  res.status(404).sendFile(`${__dirname}/_site/404.html`);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${listener.address().port}`);
});
