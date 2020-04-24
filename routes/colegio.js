var express = require('express');

var mdAutentication = require('../middlewares/autentication');

var app = express();

var Colegio = require('../models/colegio');

// =====================================
// Obtener todos los colegios
// =====================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Colegio.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec((err, colegios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error cargando colegios',
                    errors: err
                });
            }
            Colegio.countDocuments({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    colegios: colegios,
                    total: conteo
                });
            })

        })

});

// =====================================
// Actualizar colegio
// =====================================    
app.put('/:id', mdAutentication.varificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Colegio.findById(id, (err, colegio) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar colegio',
                errors: err
            });
        }

        if (!colegio) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el colegio con el id ' + id + ' no existe',
                errors: { message: 'no existe un colegio con ese ID' }
            });
        }
        colegio.nombre = body.nombre;
        colegio.usuario = req.usuario._id;

        colegio.save((err, colegioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error al actualizar colegio',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                colegio: colegioGuardado
            });
        });

    });
});


// =====================================
// Crear un nuevo colegio
// =====================================
app.post('/', mdAutentication.varificaToken, (req, res, next) => {
    var body = req.body;

    var colegio = new Colegio({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    colegio.save((err, colegioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al crear colegio',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            colegio: colegioGuardado,
        });
    });

});

// =====================================
// Borrar un colegio por el id
// =====================================
app.delete('/:id', mdAutentication.varificaToken, (req, res) => {

    var id = req.params.id;

    Colegio.findByIdAndRemove(id, (err, colegioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al borrar colegio',
                errors: err
            });
        }
        if (!colegioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'no existe un colegio con ese ID',
                errors: { message: 'no existe un colegio con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            colegio: colegioBorrado
        });

    });

});

module.exports = app;