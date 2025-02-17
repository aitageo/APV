import nodemailer from "nodemailer";
import Veterinario from '../models/Veterinario.models.js';
import { generarToken,generarId } from '../middlewares/auth.js';
import { v4 as uuidv4 } from 'uuid'; 
import dotenv from 'dotenv';

dotenv.config();

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



const enviarCodigoRecuperacion = async (req, res) => {
    const { email } = req.body;

    const usuario = await Veterinario.findOne({ email });
    if (!usuario) {
        return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const codigoRecuperacion = Math.floor(100000 + Math.random() * 900000).toString();
    const expiracion = Date.now() + 10 * 60 * 1000;

    usuario.codigoRecuperacion = codigoRecuperacion;
    usuario.codigoExpiracion = expiracion;
    await usuario.save();

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: usuario.email,
        subject: "Código de recuperación",
        text: `Tu código de recuperación es: ${codigoRecuperacion}. Este código expira en 10 minutos.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ msg: "Correo enviado con éxito" });
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        res.status(500).json({ msg: "Error al enviar el correo" });
    }
};






export {
    registrar,
    perfil,
    confirmar,
    ListVeterinarios,
    login,
    enviarCodigoRecuperacion
    
}