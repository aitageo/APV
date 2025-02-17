import express from 'express';
import { 
    registrar,perfil,confirmar,
    ListVeterinarios,login,
    enviarCodigoRecuperacion
} 

from '../controllers/Veterinario.controller.js';
import { ensureAuth } from '../middlewares/auth.js';

const app = express.Router();


app.post('/',registrar);
app.get('/confirmar/:token',confirmar);
app.get('/perfil',ensureAuth,perfil);
app.post('/login',login);
app.get('/ListVeterinarios',ListVeterinarios);
app.post('/olvide-password',enviarCodigoRecuperacion);




export default app;