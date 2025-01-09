import jwt from 'jwt-simple';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const ensureAuth = (req, res, next) => {
    const error = new Error('No autorizado');

    if (!req.headers.authorization) {
        return res.status(403).send({ msg: error.message });
    }

    let token = req.headers.authorization.replace(/['"]+/g, '').replace('Bearer ', '');

    try {
        const payload = jwt.decode(token, process.env.SECRET);

        const fechaActual = Math.floor(new Date().getTime() / 1000);

        if (payload.exp <= fechaActual) {
            return res.status(403).send({ msg: 'El token ha expirado' });
        }

        req.user = payload;

        next();
    } catch (error) {
        return res.status(500).send({ msg: 'Token inválido o corrupto' });
    }
};

const generarToken = (user) => {
    const payload = {
        sub: user.id, 
        name: user.name,
        iat: Math.floor(new Date().getTime() / 1000),
        exp: Math.floor(new Date().getTime() / 1000) + 60 * 60, // Expira en 1 hora
        jti: uuidv4() // Identificador único
    };

    return jwt.encode(payload, process.env.SECRET);
};

export { ensureAuth, generarToken };
