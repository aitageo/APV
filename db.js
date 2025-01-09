import mongoose from "mongoose";

const conexion = async () => {
    try {
        const db = await mongoose.connect(process.env.DBSTRING);
        console.log(`Mongodb conectado a la DB ${db.connection.name}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); 

    }
}
export default conexion;