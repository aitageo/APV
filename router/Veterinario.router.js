import express from 'express';
import { 
    registrar,perfil,confirmar,
    ListVeterinarios,login,olvidePassword,
    comprobarToken,nuevoPassword
} 

from '../controllers/Veterinario.controller.js';
import { ensureAuth } from '../middlewares/auth.js';

const app = express.Router();


app.post('/',registrar);
app.get('/confirmar/:token',confirmar);
app.get('/perfil',ensureAuth,perfil);
app.post('/login',login);
app.get('/ListVeterinarios',ListVeterinarios);
app.post('olvide-password',olvidePassword);
app.get('olvide-password/:token',comprobarToken);
app.post('olvide-password/:token',nuevoPassword);




export default app;