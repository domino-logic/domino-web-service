'use strict';


const cluster = require('cluster')
const numCPUs = require('os').cpus().length
const DWS = require('./index');


if(cluster.isMaster){
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  new DWS.createSocketServer({port: 6001}).start()
  new DWS.createSocketServer({port: 6002}).start()
  new DWS.createSocketServer({port: 6003}).start()
  new DWS.createSocketServer({port: 6004}).start()

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`)
  });
}

else
  new DWS.createHttpServer({port: 8081}).start()
