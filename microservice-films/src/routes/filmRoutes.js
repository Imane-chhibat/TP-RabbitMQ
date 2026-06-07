const router=require('express').Router();
const filmController=require('../controllers/filmController');

router.post('/',filmController.addFilm);

module.exports=router;