'use strict';

const amqp = require('amqplib/callback_api')


class Messenger {
  constructor (options) {
    this.options = options || {}
    this.assertedQueues = {}

    const amqp_url = this.options.amqp || 'amqp://localhost';

    amqp.connect(amqp_url, this.initAMQP.bind(this))
  }

  initAMQP (err, conn) {
    if (err){
      console.error(err);
      process.exit(1);
    }

    conn.createChannel( (err, publish_channel) => {
      this.publish_channel = publish_channel;
    });
  }

  publish (queue, json) {
    this.assertQueue(queue);

    const message = new Buffer(JSON.stringify(json));

    this.publish_channel.sendToQueue(
      queue,
      message,
      {persistent: true}
    );

    console.log(`Published message to ${queue}: `, json.payload);
  }

  assertQueue (queue) {
    if (queue in this.assertedQueues)
      return

    this.publish_channel.assertQueue(queue, {durable: true});
    this.assertedQueues[queue] = true;
  }
}

module.exports = Messenger