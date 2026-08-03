# EduFlow

Educational management platform for academic administration, student tracking, attendance, grades, schedules, and agile project management. Built as a scalable software engineering project.

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React** (v19) con **Vite**
- **Tailwind CSS** (v4) para el diseño y estilos
- **React Router DOM** para la gestión de rutas
- **Recharts** para la visualización de gráficos y datos
- **Axios** para el consumo de la API
- **Lucide React** para la iconografía

### Backend
- **Node.js** con **Express** para la API REST
- **Sequelize (ORM)** para la interacción con la base de datos
- **JWT (JSON Web Tokens)** para la autenticación y autorización
- **Bcryptjs** para el encriptado de contraseñas

### Base de Datos
- **MySQL**

---

## ⚙️ Requisitos Previos

Asegúrate de tener instalados los siguientes programas en tu entorno de desarrollo local:

- [Node.js](https://nodejs.org/) (se recomienda la versión 18 o superior)
- [MySQL](https://www.mysql.com/) (Servidor MySQL corriendo localmente)
- [Git](https://git-scm.com/) (Opcional, para clonar el repositorio)

---

## 🚀 Instalación y Ejecución Local

Sigue estos pasos para configurar y levantar el proyecto en tu máquina local.

### 1. Obtener el proyecto
Si estás usando Git, clona el repositorio. Si ya lo tienes localmente, ve a la carpeta raíz del proyecto (`EduFlow`).
```bash
git clone <URL_DEL_REPOSITORIO>
cd EduFlow
```

### 2. Configurar la Base de Datos MySQL
1. Inicia tu servidor MySQL (puedes usar XAMPP, WAMP, o el servicio nativo de MySQL).
2. Crea una base de datos vacía llamada `gestor_actividades`.
3. Importa el archivo de volcado de base de datos incluido en la raíz del proyecto (`Dump20260717.sql`) para crear la estructura de tablas y cargar los datos iniciales. 
   
   Desde la línea de comandos (reemplaza `root` por tu usuario si es distinto):
   ```bash
   mysql -u root -p gestor_actividades < Dump20260717.sql
   ```
   *Alternativa: Puedes importar este archivo usando herramientas gráficas como MySQL Workbench, DBeaver o phpMyAdmin.*

### 3. Configurar y Levantar el Backend
1. Abre una terminal y navega a la carpeta del backend:
   ```bash
   cd Backend
   ```
2. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```
3. Configura las variables de entorno. Crea un archivo `.env` en la raíz de la carpeta `Backend` con el siguiente contenido (ajusta la contraseña de la BD según tu configuración local):
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=gestor_actividades
   DB_USER=root
   DB_PASSWORD=tu_contraseña_aqui # Deja vacío si tu root no tiene contraseña
   
   DB_LOGGING=false
   PORT=3001
   
   JWT_SECRET=eduflow_secret_key
   JWT_EXPIRES_IN=2h
   ```
4. Inicia el servidor backend en modo desarrollo:
   ```bash
   npm run dev
   ```
   El backend estará escuchando peticiones en `http://localhost:3001`.

### 4. Configurar y Levantar el Frontend
1. Abre **otra** terminal (manteniendo el backend corriendo) y navega a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```
3. Inicia la aplicación frontend en modo desarrollo:
   ```bash
   npm run dev
   ```
   El frontend estará disponible normalmente en `http://localhost:5173`. Abre esa URL en tu navegador para interactuar con la plataforma.

---

## 📁 Estructura Principal del Proyecto

```text
EduFlow/
├── Backend/                 # API REST (Node.js, Express, Sequelize)
│   ├── src/                 # Código fuente (Controladores, modelos, rutas)
│   ├── package.json         # Dependencias del backend
│   └── .env                 # Variables de entorno (no incluido en git)
├── frontend/                # Interfaz de Usuario (React, Vite, Tailwind)
│   ├── src/                 # Componentes, vistas, contextos de React
│   ├── package.json         # Dependencias del frontend
│   └── vite.config.js       # Configuración del empaquetador Vite
├── Dump20260717.sql         # Backup de la estructura/datos de MySQL
└── README.md                # Este archivo de documentación
```
