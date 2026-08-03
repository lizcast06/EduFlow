const mysql = require('mysql2/promise');

async function testDb() {
  try {
    const connection = await mysql.createConnection({
      host: 'hayabusa.proxy.rlwy.net',
      user: 'root',
      password: 'BsPuZRpYKYrFPpETBOHJseLToOhmmGVU',
      port: 14758,
      database: 'railway',
    });

    console.log('Conectado a Railway MySQL.');
    
    const [rows] = await connection.query('SELECT * FROM rol');
    console.log('Roles en DB:', rows);

    const [rows2] = await connection.query('SELECT * FROM rol WHERE nombre = "Estudiante"');
    console.log('Rol Estudiante:', rows2);
    
    await connection.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

testDb();
