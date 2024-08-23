const {response} = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT }= require('../helpers/jwt');


const createUser = async(req, res = response) => {

    const {email, password} = req.body;
    try {
        let user = await User.findOne({ email: email});
        if ( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado',
            });
        }


        user = new User(req.body);

        //Encriptar pass
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);
    
        await user.save();
        //Generar JWT
        const token = await generateJWT(user.id, user.name);


        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
        })
    }
}


const loginUser = async(req, res = response) => {

    const {email, password} = req.body;


    try {
        let user = await User.findOne({ email: email});
        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña no son correctas.',
            });
        }
        //Confirmar password
        const validPassword = bcrypt.compareSync(password, user.password);
        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña no son correctas',
            });
        }

        //Generar JWT 
        const token = await generateJWT(user.id, user.name);

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
        })
    }
    
}

const revalidToken = async(req, res = response) => {

    const {uid, name} = req;

    //Generar JWT
    const token = await generateJWT(uid, name);

    res.json({
        ok: true,
        token
    })
}


module.exports = {
    createUser,
    loginUser,
    revalidToken,
};