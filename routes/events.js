/*
    Events routes
    'api/events'
*/
const { Router }= require('express');
const { check }= require('express-validator');
const { validateFields } = require('../middlewares/validators-fields');
const { validateJWT } = require('../middlewares/validators-jwt');
const {getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const {isDate} = require('../helpers/isDate');

const router = Router();

//Todas tienen que pasar por la validacion del JWT para que solo el usuario que crea puede modificar los eventos
router.use(validateJWT);

//Obtener eventos
router.get('/', getEvents);

//Crear un nuevo evento
router.post('/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria').custom(isDate),
        check('end', 'La fecha de fin es obligatoria').custom(isDate),
        validateFields
    ],
    createEvent
);



//Actualizar evento
router.put('/:id', updateEvent);


//eliminar evento
router.delete('/:id', deleteEvent);


module.exports = router;