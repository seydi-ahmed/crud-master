const amqp = require('amqplib/callback_api');

module.exports = (req, res) => {
  amqp.connect('amqp://192.168.56.30:5672', (err, conn) => {
    if (err) {
      console.error('❌ Connection error:', err.message);
      return res.status(500).json({error: "RabbitMQ connection failed"});
    }
    
    conn.createChannel((err, channel) => {
      if (err) {
        conn.close();
        return res.status(500).json({error: "Channel creation failed"});
      }

      const queue = 'billing_queue';
      const msg = JSON.stringify(req.body);

      channel.assertQueue(queue, {durable: false});
      channel.sendToQueue(queue, Buffer.from(msg));

      console.log(" [x] Sent %s", msg);
      res.status(200).json({success: true});

      setTimeout(() => {
        channel.close();
        conn.close();
      }, 500);
    });
  });
};