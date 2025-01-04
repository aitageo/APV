
import express from 'express';
import dotenv from 'dotenv';
import conexion from './db.js';

const app = express();
dotenv.config();
conexion();

const port = process.env.PORT
app.use('/',(req,res) => {
        res.send('Hola mundo');  
})

app.listen(port,() => {
    console.log(`Servidor corriendo en el puerto ${port}`);
    console.log('Database Enable');
})