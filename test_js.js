const act = { descripcion: null };
try {
  const result = act.descripcion?.toLowerCase().includes('');
  console.log('Result:', result);
} catch (e) {
  console.log('Error:', e.message);
}
