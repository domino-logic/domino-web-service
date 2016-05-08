'use strict';

const SocketIO = require('socket.io')
const fs = require('fs')
const DRM = require('domino-rabbitmq-messenger');

class SocketServer {
  constructor (options) {
    this.options = options || {}
    this.messenger = new DRM.Messenger(this.options)
    this.io = SocketIO(this.options.port || this.options.app)
    this.actionQueue = this.options.actionQueue || 'domino_action';
  }

  start (callback) {
    this.messenger.start( (err, messenger) => {
      if(err && callback) return callback(err)

      console.log(`Starting Socket...`);
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

  subscribe (eventQueue, key) {
    eventQueue.subscribe(key)
    console.log(`Subscribed to ${key}`)
  }

  unsubscribe (eventQueue, key) {
    eventQueue.unsubscribe(key)
    console.log(`Unsubscribed to ${key}`)
  }

  initConnection(socket){
    console.log(`New connection...`);

    const eventQueue = this.messenger.eventQueue()

    eventQueue.onUpdate( (body) => socket.emit('change', body) )

    socket.on('action', this.createAction.bind(this));
    socket.on('subscribe', this.subscribe.bind(this, eventQueue));
    socket.on('unsubscribe', this.unsubscribe.bind(this, eventQueue));
  }
}

module.exports = SocketServer;