<
### 📄 README.md (Frontend)

# DemeArizOil - Frontend UI 🖥️

Este repositorio contiene el frontend de la aplicación **DemeArizOil**, una Single Page Application (SPA) construida con **Vue 3**, **Vite** y **TypeScript**. Esta aplicación consume la API RESTful del [repositorio backend](https://www.google.com/search?q=https://github.com/tu-usuario/DemeArizOil-Backend).

## ✨ Características

  - **Framework Moderno**: Construido con **Vue 3** (Composition API).
  - **Build Rápido**: Empaquetado y servidor de desarrollo ultrarrápido gracias a **Vite**.
  - **Tipado Estricto**: Código robusto y mantenible con **TypeScript**.
  - **Gestión de Estado**: Estado global centralizado con **Pinia**.
  - **Routing**: Vistas y navegación gestionadas por **Vue Router**.
  - **Consumo de API**: Cliente HTTP (`axios`) preconfigurado para interactuar con el backend de FastAPI.
  - **Multi-idioma (i18n)**: Soporte completo para Inglés, Francés y Español, seleccionable por el usuario y vinculado a su perfil.
  - **Temas Dinámicos**: Múltiples paletas de colores (Claro, Oscuro, Tierra) que el usuario puede elegir y persistir en su perfil.

## 🛠️ Stack Tecnológico

El stack se selecciona priorizando versiones **estables y LTS (Long-Term Support)**.

  - **Plataforma**: **Node.js 20.x (LTS)**
  - **Framework**: Vue 3 (Estable)
  - **Lenguaje**: TypeScript
  - **Build Tool**: Vite (Estable)
  - **Gestión de Estado**: Pinia
  - **Routing**: Vue Router v4
  - **Internacionalización (i18n)**: vue-i18n
  - **Cliente HTTP**: Axios
  - **Estilos**: SCSS (para la lógica de temas dinámicos)

-----

## 🚀 Cómo Empezar

Este proyecto está diseñado para ejecutarse localmente o dentro de un contenedor Docker.

### Prerrequisitos

  - [Node.js](https://nodejs.org/) (**v20.x LTS** recomendado)
  - [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Opcional, pero recomendado para consistencia)
  - El [Backend de DemeArizOil](https://www.google.com/search?q=https://github.com/tu-usuario/DemeArizOil-Backend) debe estar ejecutándose (`http://localhost:8000`).

### 1\. Configuración Inicial

1.  **Clonar el repositorio:**

    ```bash
    git clone [URL_DE_ESTE_REPOSITORIO_FRONTEND]
    cd DemeArizOil-Frontend
    ```

2.  **Instalar dependencias:**

    ```bash
    npm install
    ```

3.  **Crear el archivo de entorno:**
    Copia el archivo de ejemplo `.env.example` y renómbralo a `.env.local`.

    ```bash
    cp .env.example .env.local
    ```

    (El archivo ya está preconfigurado para apuntar a `VITE_API_BASE_URL=http://localhost:8000/api/v1`)

### 2\. Ejecución (Modo Desarrollo)

1.  **Ejecutar el servidor de Vite:**

    ```bash
    npm run dev
    ```

2.  Abre tu navegador en la dirección que indique la terminal (usualmente `http://localhost:5173`).

-----

## 🐳 (Alternativa) Ejecución con Docker

Puedes usar la configuración de Dev Containers para desarrollar dentro de un contenedor, de forma análoga al backend.

1.  Abre la carpeta `DemeArizOil-Frontend` en VS Code.
2.  Asegúrate de tener la extensión [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).
3.  Haz clic en **"Reopen in Container"**.
4.  VS Code construirá el contenedor de `Dockerfile` e instalará las dependencias.
5.  Una vez dentro, abre una terminal de VS Code y ejecuta `npm run dev`.