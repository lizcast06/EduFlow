const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function importDb() {
  try {
    console.log('Intentando conectar a Railway...');
    const connection = await mysql.createConnection({
      host: 'hayabusa.proxy.rlwy.net',
      user: 'root',
      password: 'BsPuZRpYKYrFPpETBOHJseLToOhmmGVU',
      port: 14758,
      database: 'railway',
      multipleStatements: true
    });

    console.log('¡Conectado a Railway MySQL exitosamente!');
    
    const sqlPath = path.join(__dirname, '../Dump20260717.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Leyendo y ejecutando el archivo SQL... (esto puede tardar unos segundos)');
    await connection.query(sql);
    
    console.log('✅ ¡Importación completada con éxito!');
    await connection.end();
  } catch (error) {
    console.error('❌ Error durante la importación:', error);
  }
}

importDb();
