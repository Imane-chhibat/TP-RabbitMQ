const {publishFilm}=require('../rabbitmq/producer');

exports.addFilm=async(req,res)=>{
    const film=req.body;

    await publishFilm(film);

    res.json({
        message:"Film envoyé à RabbitMQ",
        film
    });
};