// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();

// Body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())

// Server index config
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));

// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var colegioRoutes = require('./routes/colegio');
var docenteRoutes = require('./routes/docente');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');


// Conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/ondb', {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }, (err, res) => {

        if (err) throw err;

        console.log('Base de datos: \x1b[41m%s\x1b[0m',
            'online ');
    })
    // mongoose.connection.openUri('mongodb://localhost:27017/ondb', (err, res) => {

//     if (err) throw err;

//     console.log('Base de datos: \x1b[41m%s\x1b[0m',
//         'online ');
// });

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/colegio', colegioRoutes);
app.use('/docente', docenteRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);

app.use('/', appRoutes);


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[41m%s\x1b[0m',
        'online ');
});