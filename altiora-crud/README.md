# Altiora Eventos - Laboratorio IV

Aplicación web de una sola página desarrollada con React para gestionar solicitudes de eventos de la empresa ficticia Altiora Eventos.

## Funcionalidades

- **Create:** registrar solicitudes de eventos.
- **Read:** consultar las solicitudes almacenadas en la API.
- **Update:** editar la información de una solicitud.
- **Delete:** eliminar una solicitud.
- Interfaz adaptable construida con Bootstrap.
- Helper `helpFetch.js` para centralizar las peticiones HTTP.
- Hooks `useState` y `useEffect` para manejar el estado y cargar los datos.

## Tecnologías

React 18, Vite, Bootstrap 5, Fetch API y json-server 0.17.4.

## Requisitos

Node.js 18 o superior y npm.

## Instalación y ejecución

1. Clonar el repositorio y entrar a la carpeta:

   ```bash
   git clone URL_DEL_REPOSITORIO
   cd programacionWeb/altiora-crud
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Iniciar el frontend y la API:

   ```bash
   npm start
   ```

4. Abrir el frontend en http://localhost:5173. La API queda disponible en http://localhost:3001/solicitudes.

En GitHub Codespaces, los puertos 5173 y 3001 se reenvían automáticamente.

## Estructura

```text
altiora-crud/
├── db.json
├── index.html
├── package.json
├── README.md
└── src/
    ├── index.jsx
    ├── Negocio.jsx
    ├── styles.css
    └── helpers/
        └── helpFetch.js
```

## Modelo de datos

Cada solicitud contiene cliente, teléfono, tipo de evento, fecha, número de invitados, presupuesto estimado y estado. Los registros iniciales son datos ficticios de demostración.

## Puertos

- 5173: servidor de desarrollo de Vite (React).
- 3001: API REST de json-server.

## Nota académica

Este proyecto implementa el CRUD solicitado en el Laboratorio IV. Los cambios realizados con json-server se guardan en el archivo local db.json durante la ejecución.