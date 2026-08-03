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

    const [usuarios] = await connection.query('SELECT id, nombre, email, rol_id FROM usuario');
    console.log('Usuarios:', usuarios);
    
    await connection.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

testDb();
