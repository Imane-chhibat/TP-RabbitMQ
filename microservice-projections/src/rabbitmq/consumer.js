const amqp=require('amqplib');

let films=[];

async function startConsumer(){

    const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
    const connection=
    await amqp.connect(rabbitmqUrl);

    const channel=
    await connection.createChannel();

    await channel.assertQueue(
        'films_queue'
    );

    channel.consume('films_queue',(msg)=>{

        const film=
        JSON.parse(msg.content.toString());

        films.push(film);

        channel.ack(msg);
    });
}

function getFilms(){
    return films;
}

module.exports={
    startConsumer,
    getFilms
};