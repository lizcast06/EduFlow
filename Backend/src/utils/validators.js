function isEmpty(value) {
  return value === undefined || value === null || String(value).trim() === '';
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).trim());
}

function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 6;
}

function isValidPriority(prioridad) {
  return ['Alta', 'Media', 'Baja'].includes(prioridad);
}

function isValidUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
}

function isPositiveInteger(value) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0;
}

module.exports = {
  isEmpty,
  isValidEmail,
  isValidPassword,
  isValidPriority,
  isValidUrl,
  isPositiveInteger
};