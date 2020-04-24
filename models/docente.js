var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var docenteSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre	es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    colegio: {
        type: Schema.Types.ObjectId,
        ref: 'Colegio',
        required: [true, 'El id colegio es un campo obligatorio ']
    }
});
module.exports = mongoose.model('Docente', docenteSchema);