// config.js
const PROD_URL = "https://proyecto-maiz.onrender.com";
const DEV_URL = "http://127.0.0.1:8000";

// Detecta automáticamente si estamos en producción
const API_URL = window.location.hostname === "proyecto-maiz.onrender.com" ? PROD_URL : DEV_URL;

export { API_URL };