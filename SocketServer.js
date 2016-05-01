'use strict';

const SocketIO = require('socket.io')
const fs = require('fs')
const DRM = require('domino-rabbitmq-messenger');

class SocketServer {
  constructor (options) {
    this.options = options || {}
    this.messenger = new DRM.Messenger(options)
    this.io = SocketIO(options.port || 6001)
    this.actionQueue = this.options.actionQueue || 'domino_action';
  }

  start (callback) {
    this.messenger.start( (err, messenger) => {
      if(err && callback) return callback(err)

      console.log(`Starting Socket on port ${this.options.port}`);
      this.io.on('connection', this.initConnection.bind(this));

      if(callback) return callback(null, this);
    })
  }

  getActionQueue (actionName) {
    return `${this.actionQueue}.${actionName}`
  }

  createAction (body) {
    this.messenger.publish(
      this.getActionQueue(body.type),
      body
    )
  }

  subscribe (body) {
    console.log(body)
  }

  unsubscribe (body) {
    console.log(body)
  }

  initConnection(socket){
    console.log(`New connection...`);
    socket.on('action', this.createAction.bind(this));
    socket.on('subscribe', this.subscribe.bind(this));
    socket.on('unsubscribe', this.unsubscribe.bind(this));
  }
}

module.exports = SocketServer;