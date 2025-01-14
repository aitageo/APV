import Veterinario from '../models/Veterinario.models.js';
import { generarJsonToken } from '../middlewares/auth.js';
import { generarToken,generarId } from '../middlewares/auth.js';
import { v4 as uuidv4 } from 'uuid'; 

const registrar =  async(req,res) => {
    const { email } = req.body;
    
    const existeUsuario = await Veterinario.findOne({email});

    if (existeUsuario) {
        console.log(existeUsuario);
        const error = new Error('Usuario ya registrado');
        return res.status(401).send({msg: error.message});
    }
    
     try {
        const token = generarToken({ id: uuidv4()});
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
    console.log(req.headers.authorization);
    const { veterinario } = req;
    res.json({url: 'Desde perfil Veterinarios',perfil: veterinario});
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
        // usuarioConfirmado.token = null;
        usuarioConfirmado.confirmado = true;
         await usuarioConfirmado.save();
        res.status(200).send({msg: 'Usuario confirmado corectamente',usuario: usuarioConfirmado});

    } catch (error) {
        console.log(error)
    }

  
}



const login = async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;

    const usuario = await Veterinario.findOne({ email });

    if (!usuario) {
        return res.status(404).send({ msg: "Usuario no encontrado" });
    }

    if (!usuario.confirmado) {
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).send({ msg: error.message });
    }

    const passwordCorrecto = await usuario.comprobarPassword(password);
    if (!passwordCorrecto) {
        const error = new Error('Password incorrecto');
        return res.status(403).send({ msg: error.message });
    }

    console.log('Usuario autenticado correctamente');
    const token = generarToken(usuario.id);
    console.log(token);

    return res.send({ Login: usuario });
};



const olvidePassword = async (req,res) => {
    const { email } = req.body;

    const existeVeterinario = await Veterinario.findOne({email});
    const error = new Error('El usuario no existe');
    if (!existeVeterinario) {
        return res.statu(404).send({msg: error.message })
    }


    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save();
        res.send({msg: "Hemos enviado un email con las instrucciones"});
    } catch (error) {
        console.log(error);
    }
  
};


const comprobarToken = (req,res) => {
  
};



const nuevoPassword = (req,res) => {
  
}



export {
    registrar,
    perfil,
    confirmar,
    ListVeterinarios,
    login,
    olvidePassword,
    comprobarToken,
    nuevoPassword
}