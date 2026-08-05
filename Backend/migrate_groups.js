const sequelize = require('./src/config/database');
(async () => {
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS grupo (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        codigo_acceso VARCHAR(20) UNIQUE NOT NULL,
        docente_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_grupo_docente FOREIGN KEY (docente_id) REFERENCES usuario(id) ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS grupo_estudiante (
        grupo_id INT NOT NULL,
        estudiante_id INT NOT NULL,
        fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (grupo_id, estudiante_id),
        CONSTRAINT fk_ge_grupo FOREIGN KEY (grupo_id) REFERENCES grupo(id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_ge_estudiante FOREIGN KEY (estudiante_id) REFERENCES usuario(id) ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);

    try {
      await sequelize.query('ALTER TABLE asignacion ADD COLUMN calificacion FLOAT NULL, ADD COLUMN retroalimentacion TEXT NULL');
    } catch(e) {
      if(e.message && e.message.includes('Duplicate column name')) {
        console.log('Columns calificacion already exist');
      } else {
        throw e;
      }
    }

    try {
      await sequelize.query('ALTER TABLE actividad ADD COLUMN grupo_id INT NULL, ADD CONSTRAINT fk_actividad_grupo FOREIGN KEY (grupo_id) REFERENCES grupo(id) ON DELETE SET NULL ON UPDATE CASCADE');
    } catch(e) {
      if(e.message && e.message.includes('Duplicate key name')) {
        console.log('Column grupo_id already exists');
      } else if (e.message && e.message.includes('Duplicate column name')) {
        console.log('Column grupo_id already exists');
      } else {
        throw e;
      }
    }

    console.log('Database altered successfully');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    process.exit(0);
  }
})();
