import express from 'express';
import { registrar,perfil,login,confirmar,ListVeterinarios,autenticar } from '../controllers/Veterinario.controller.js';
import { ensureAuth } from '../middlewares/auth.js';

const app = express.Router();


app.post('/',registrar);
app.get('/perfil',perfil);
app.get('/ListVeterinarios',ListVeterinarios);
app.post('/login',login);
app.get('/confirmar/:token',confirmar);
app.post('/autenticar',autenticar);





export default app;