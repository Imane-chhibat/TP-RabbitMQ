const {getFilms}=
require('../rabbitmq/consumer');

exports.getFilms=(req,res)=>{
    res.json(getFilms());
};