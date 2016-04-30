'use strict';


const http = require('http');
const Messenger = require('./Messenger')

class HttpServer {
  constructor (options) {
    this.options = options || {};
    this.publish_queue = this.options.publish_queue || 'domino_action';

    this.server = http.createServer( this.handleRequest.bind(this) )
    this.messenger = new Messenger(options)
  }

  start () {
    console.log(`Starting HTTP on port ${this.options.port}`);
    this.server.listen(this.options.port || 3000);
  }

  createAction (params) {
    this.messenger.publish(this.publish_queue, params)
  }

  getTemplate () {

  }

  handleRequest (request, response) {
    const method = request.method;
    const body = [];


    request.on('data', function(chunk) {
      body.push(chunk);
    })

    request.on('end', () => {
      var params = {};

      if (method === 'POST'){
        params = JSON.parse(Buffer.concat(body).toString());
        this.createAction(params)
      }

      if (method === 'GET'){

      }

      response.statusCode = 200;
      response.setHeader('Content-Type', 'application/json');
      response.setHeader('X-Powered-By', 'domino');

      var responseBody = {
        headers: request.headers,
        method: method,
        url: request.url,
        params: params,
        body: {
          status: "ok"
        }
      };

      response.write(JSON.stringify(responseBody));
      response.end();
    })
  }

}


module.exports = HttpServer