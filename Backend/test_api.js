const jwt = require('jsonwebtoken');

// Generate token for Docente (id: 2)
const token = jwt.sign({ id: 2, email: 'pacheco@escuela.com' }, 'eduflow_secret_key');

async function testApi() {
  try {
    const res = await fetch('https://eduflow-production-9be1.up.railway.app/api/actividades', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(error.message);
  }
}

testApi();
