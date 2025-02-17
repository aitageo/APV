import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const Veterinarioschema = mongoose.Schema({
    nombre : {
        type: String,
        required: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },
    email: {
        type:String,
        required: true,
        unique: true,
        trim: true
    }, 
    telefono : {
        type: String,
        default: null,
        trim: true,
    },
    web: {
        type:String,
        default: null
    },
    token: {
       type:String,
       default: null
    },
    confirmado: {
        type: Boolean,
        default:false
    },

    codigoRecuperacion: {
        type: String,
        default: null,
    },
    codigoExpiracion: {
        type: Date,
        default: null,
    },

});

//esta funcion hashea la contraseña del usuario
Veterinarioschema.pre('save', async function(next){
    console.log('Antes de almacenar');
    if (!this.isModified('password')) {
        next();//pasa al siguiente middleware
    }

    const salt =  await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log(this.password);
 
});


Veterinarioschema.methods.comprobarPassword = async function (password) {
    return await bcrypt.compare(password,this.password);
}


const Veterinario = mongoose.model('Veterinario',Veterinarioschema);

export default Veterinario;