'use strict'

const fs = require('fs');
const http = require('http')
const DRM = require('domino-rabbitmq-messenger')

class HttpServer {
  constructor (options) {
    this.options = options || {}
    this.messenger = new DRM.Messenger(this.options)
    this.server = http.createServer( this.handleRequest.bind(this) )
    this.actionQueue = this.options.actionQueue || 'domino_action'
    this.this.staticFolder = this.options.this.staticFolder

  }

  start (callback) {
    this.messenger.start( (err, messenger) => {
      if(err && callback) return callback(err)

      console.log(`Starting HTTP on port ${this.options.port}`)
      this.server.listen(this.options.port || 3000)

      if(callback) callback(null, this)
    })

    if(this.staticFolder){
      console.log(`Serving static at ${this.staticFolder}`)
    }

    return this
  }

  createAction (params) {
    this.messenger.publish(this.actionQueue, params)
  }

  handlePost(request, response) {
    var params = {}

    response.statusCode = 200
    response.setHeader('Content-Type', 'application/json')
    response.setHeader('X-Powered-By', 'domino')

    params = JSON.parse(Buffer.concat(body).toString())
    this.createAction(params)

    var responseBody = {
      headers: request.headers,
      method: method,
      url: request.url,
      params: params,
      body: {
        status: "ok"
      }
    }

    response.write(JSON.stringify(responseBody))
    response.end()
  }

  handleGet(request, response) {
    response.setHeader('X-Powered-By', 'domino')
    function readFile(err, data) {
      if (err) {
        response.statusCode = 404
        return response.end(`Error loading ${request.url}`)
      }
      response.statusCode = 200
      response.end(data)
    }

    var url = request.url
    if(/\/$/.test(url)){
      url += 'index.html';
    }

    fs.readFile(this.staticFolder + url, readFile)
  }

  handleRequest (request, response) {
    const method = request.method
    const body = []

    if (method === 'GET' && this.staticFolder){
      this.handleGet(request, response)
    }

    request.on('data', function(chunk) {
      body.push(chunk)
    })

    request.on('end', () => {
      if (method === 'POST'){
        this.handlePost(request, response)
      }
    })
  }

}


module.exports = HttpServer