#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../app.js';
import Debug from 'debug';
const debug = Debug('cloud-invoice-backend:server');
import http from 'http';

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * 連接池設定
 */

import sql from 'mssql';

const config = {
  user: 'web',
  password: '123456',
  server: 'localhost',
  database: 'cloud_invoice',
  options: {
    trustServerCertificate: true // change to true for local dev / self-signed certs
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

const appPool = new sql.ConnectionPool(config);

appPool.connect().then((pool) => {
  app.locals.db = pool;
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
  const host = server.address().address;
  // const port = server.address().port;
  console.log(host, port)
}).catch(function (err) {
  console.error('Error creating connection pool', err)
});

/**
 * Listen on provided port, on all network interfaces.
 */

// server.listen(port);
// server.on('error', onError);
// server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
