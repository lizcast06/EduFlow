const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const actividadRoutes = require('./routes/actividad.routes');
const estadoRoutes = require('./routes/estado.routes');
const evidenciaRoutes = require('./routes/evidencia.routes');
const comentarioRoutes = require('./routes/comentario.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const historialRoutes = require('./routes/historial.routes');

const {
  notFoundHandler,
  errorHandler
} = require('./middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API EduFlow funcionando correctamente'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/actividades', actividadRoutes);
app.use('/api/estados', estadoRoutes);
app.use('/api', evidenciaRoutes);
app.use('/api', comentarioRoutes);
app.use('/api', historialRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/usuarios', usuarioRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;