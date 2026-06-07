const router=require('express').Router();
const controller=
require('../controllers/projectionController');

router.get('/',controller.getFilms);

module.exports=router;