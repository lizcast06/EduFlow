require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3001;

async function iniciarServidor() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); // Mantiene sincronizada la BD con los nuevos modelos

    console.log('Conexión a MySQL exitosa.');

    app.listen(PORT, () => {
      console.log(`Servidor EduFlow ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:');
    console.error(error.message);
    process.exit(1);
  }
}

iniciarServidor();