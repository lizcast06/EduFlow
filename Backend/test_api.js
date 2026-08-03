async function testApi() {
  try {
    const res = await fetch('https://eduflow-production-9be1.up.railway.app/api/actividades');
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(error.message);
  }
}

testApi();
