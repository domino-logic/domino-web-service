'use strict';

const SocketIO = require('socket.io')
const fs = require('fs')
const Messenger = require('./Messenger')

class SocketServer {
  constructor (options) {
    this.options = options || {};
    this.messenger = new Messenger(options)
    this.io = SocketIO(options.port || 6001)
    this.actionQueue = this.options.actionQueue || 'domino_action';
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

  start () {
    console.log(`Starting Socket on port ${this.options.port}`);
    this.io.on('connection', this.initConnection.bind(this));
  }

  initConnection(socket){
    console.log(`New connection...`);
    socket.on('action', this.createAction.bind(this));
  }
}

module.exports = SocketServer;