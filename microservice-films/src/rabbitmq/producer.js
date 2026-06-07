const amqp=require('amqplib');

let channel;

async function initRabbitMQ(){
    const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
    const connection=await amqp.connect(rabbitmqUrl);
    channel=await connection.createChannel();

    await channel.assertQueue('films_queue',{
        durable:true
    });
}

async function publishFilm(film){
    channel.sendToQueue(
        'films_queue',
        Buffer.from(JSON.stringify(film))
    );
}

module.exports={
    initRabbitMQ,
    publishFilm
};