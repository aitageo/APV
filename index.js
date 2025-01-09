
import express from 'express';
import dotenv from 'dotenv';
import conexion from './db.js';
import  veterinarioRouter from './router/Veterinario.router.js';

const app = express();
dotenv.config();
conexion();

// Habilita el análisis de datos de formularios
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const port = process.env.PORT


app.listen(port,() => {
    console.log(`Servidor corriendo en el puerto ${port}`);
    console.log('Database Enable');
})



// cors:
app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested_With, Content-Type, Accept, Authorization');
    next();
});


// Exports routes:
app.use('/api/veterinario',veterinarioRouter);

