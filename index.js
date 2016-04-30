'use strict';

const DWS = module.exports = {};
const HttpServer = require('./HttpServer');
const SocketServer = require('./SocketServer');

DWS.createSocketServer = function(options, fn){
  return new SocketServer(options, fn);
}

DWS.createHttpServer = function(options, fn){
  return new HttpServer(options, fn);
}

