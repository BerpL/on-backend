var express = require('express');

var app = express();

var Colegio = require('../models/colegio');
var Docente = require('../models/docente');
var Usuario = require('../models/usuario');

// =====================================
// Busqueda por colección
// =====================================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i')

    var promesa;
    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;
        case 'docentes':
            promesa = buscarDocentes(busqueda, regex);
            break;
        case 'colegios':
            promesa = buscarColegios(busqueda, regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda solo son usuarios, docentes o colegios',
                error: { message: 'Tipo de tabla/colección no váildo' }
            });
    }
    promesa.then(data => {
        return res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });
});

// =====================================
// Busqueda general
// =====================================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i')

    Promise.all([buscarColegios(busqueda, regex),
        buscarDocentes(busqueda, regex),
        buscarUsuarios(busqueda, regex)

    ]).then(respuestas => {
        res.status(200).json({
            ok: true,
            colegios: respuestas[0],
            docentes: respuestas[1],
            usuarios: respuestas[2]
        });
    });

});

function buscarColegios(busqueda, regex) {
    return new Promise((resolve, reject) => {

        Colegio.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, colegios) => {
                if (err) {
                    reject('Error al cargar colegios', err);
                } else {
                    resolve(colegios)
                }
            });

    });
}

function buscarDocentes(busqueda, regex) {
    return new Promise((resolve, reject) => {

        Docente.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('colegio')
            .exec((err, docentes) => {
                if (err) {
                    reject('Error al cargar docentes', err);
                } else {
                    resolve(docentes)
                }
            });

    });
}

function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });

    });
}

module.exports = app;