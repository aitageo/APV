import Veterinario from '../models/Veterinario.models.js';
import { generarToken } from '../middlewares/auth.js';
import { v4 as uuidv4 } from 'uuid'; 

const registrar =  async(req,res) => {
    const { email,nombre } = req.body;
    
    const existeUsuario = await Veterinario.findOne({email});

    if (existeUsuario) {
        console.log(existeUsuario);
        const error = new Error('Usuario ya registrado');
        return res.status(401).send({msg: error.message});
    }
    
     try {
        const token = generarToken({ id: uuidv4(), name: nombre });
        const veterinario = new Veterinario({...req.body,token});
        const veterinarioGuardado = await veterinario.save();
        res.status(200).send({ veterinarioGuardado });
     } catch (error) {
        console.log(error)
     }

}



const ListVeterinarios = async (req, res) => {
    try {
        const allVeterinarios = await Veterinario.find();
        return res.status(200).send({ Allveterinarios: allVeterinarios });
    } catch (error) {
        return res.status(500).send({ msg: 'Error al obtener veterinarios', error: error.message });
    }
};



const perfil = (req,res) => {
    res.json({url: 'Desde perfil Veterinarios'});
}


const login = (req,res) => {
    res.json({url: 'Desde el Login Veterinarios'});
}


const confirmar =  async (req,res) => {
    console.log(req.params)
    const { token } = req.params;

    const usuarioConfirmado = await Veterinario.findOne({token}); 

    if(!usuarioConfirmado){
        const error = new Error('Token no valido');
        return res.status(403).send({status: 'error',msg: error.message});
    }

    try {
        usuarioConfirmado.token = null;
        usuarioConfirmado.confirmado = true;
         await usuarioConfirmado.save();
        res.status(200).send({msg: 'Usuario confirmado corectamente',usuario: usuarioConfirmado});

    } catch (error) {
        console.log(error)
    }

  
}



const autenticar = async (req,res) => {
    console.log(req.body);
    const { email,password } = req.body;

    const usuario = await Veterinario.findOne({email});
    if (usuario) {
        console.log(`Usuario encontrado ${usuario}`);
        res.status(200).send({msg: "Autenticando...",usuario});
    }
    else {
        res.status(404).send({msg:"Usuario no encontrado"});
    }
    if(!usuario.confirmado){
        const error = new Error('Tu cuenta no ha sido confirmada');
        res.status(403).send({msg: error.message});
        
    }
    
    //Revisar password 
    if(await usuario.comprobarPassword(password)){
        console.log('Password correcto');
    }else {
        const error = new Error('Password incorrecto');
        res.status(403).send({msg: error.message});
        
    }
}



export {
    registrar,
    perfil,
    login,
    confirmar,
    ListVeterinarios,
    autenticar
}