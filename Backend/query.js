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
    
    const [estados] = await connection.query('SELECT * FROM estado');
    console.log('Estados en DB:', estados);

    const [actividades] = await connection.query('SELECT * FROM actividad');
    console.log('Actividades:', actividades);
    
    await connection.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

testDb();
