var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Docente = require('../models/docente');
var Colegio = require('../models/colegio');

// default options
app.use(fileUpload());


app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    //Tipos de colección
    var tiposValidos = ['colegios', 'docentes', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'tipo de colección no es válida',
            errors: { message: 'tipo de colección no es válida' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'no selecciono nada',
            errors: { message: 'debe de seleccionar una imagen' }
        });
    }

    //Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //Extensiones aceptadas
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'extension no valida',
            errors: { message: 'las extensiones validas son ' + extensionesValidas.join(', ') }
        });
    }

    //Nombre de archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //Mover el archivo de temp a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;
    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'archivo movido',
        //     extensionArchivo: extensionArchivo
        // });
    })
});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'usuario no existe',
                    errors: { message: "usuario no existe" }
                });
            }
            var pathViejo = './uploads/usuarios/' + usuario.img;

            //Si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo, () => {

                });
            }

            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.password = ":)";
                return res.status(200).json({
                    ok: true,
                    mensaje: 'imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });
            })

        });
    }
    if (tipo === 'docentes') {
        Docente.findById(id, (err, docente) => {
            if (!docente) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'docente no existe',
                    errors: { message: "docente no existe" }
                });
            }
            var pathViejo = './uploads/docentes/' + docente.img;

            //Si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo, () => {

                });
            }

            docente.img = nombreArchivo;
            docente.save((err, docenteActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'imagen de docente actualizada',
                    docente: docenteActualizado
                });
            })

        });
    }
    if (tipo === 'colegios') {
        Colegio.findById(id, (err, colegio) => {
            if (!colegio) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'colegio no existe',
                    errors: { message: "colegio no existe" }
                });
            }
            var pathViejo = './uploads/colegios/' + colegio.img;

            //Si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo, () => {

                });
            }

            colegio.img = nombreArchivo;
            colegio.save((err, colegioActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'imagen de colegio actualizada',
                    colegio: colegioActualizado
                });
            })

        });
    }
}

module.exports = app;