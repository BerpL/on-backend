var express = require('express');

var mdAutentication = require('../middlewares/autentication');

var app = express();

var Docente = require('../models/docente');

// =====================================
// Obtener todos los docentes
// =====================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Docente.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('colegio')
        .exec((err, docentes) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error cargando docentes',
                    errors: err
                });
            }
            Docente.countDocuments({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    docentes: docentes,
                    total: conteo
                });
            })

        })

});

// =====================================
// Actualizar docente
// =====================================    
app.put('/:id', mdAutentication.varificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Docente.findById(id, (err, docente) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar docente',
                errors: err
            });
        }

        if (!docente) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el docente con el id ' + id + ' no existe',
                errors: { message: 'no existe un docente con ese ID' }
            });
        }
        docente.nombre = body.nombre;
        docente.usuario = req.usuario._id;
        docente.colegio = body.colegio;

        docente.save((err, docenteGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error al actualizar docente',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                docente: docenteGuardado
            });
        });

    });
});


// =====================================
// Crear un nuevo docente
// =====================================
app.post('/', mdAutentication.varificaToken, (req, res, next) => {
    var body = req.body;

    var docente = new Docente({
        nombre: body.nombre,
        usuario: req.usuario._id,
        colegio: body.colegio
    });

    docente.save((err, docenteGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al crear docente',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            docente: docenteGuardado,
        });
    });

});

// =====================================
// Borrar un docente por el id
// =====================================
app.delete('/:id', mdAutentication.varificaToken, (req, res) => {

    var id = req.params.id;

    Docente.findByIdAndRemove(id, (err, docenteBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al borrar docente',
                errors: err
            });
        }
        if (!docenteBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'no existe un docente con ese ID',
                errors: { message: 'no existe un docente con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            docente: docenteBorrado
        });

    });

});

module.exports = app;