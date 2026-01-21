##?? Resumen Preliminar del Proyecto (Frontend)

Este documento consolida la visión, arquitectura y stack tecnológico para el repositorio `DemeArizOil-Frontend`.

#### 1\. Visión del Proyecto y Flujo de Usuario

El frontend de DemeArizOil es la interfaz gráfica (SPA) que permite a los usuarios interactuar con la API del backend. Proporcionará las Vistas para:

  * **Autenticación:** Una vista de Login que, al tener éxito, guarda el token JWT en el estado global (Pinia) y lo utiliza en todas las peticiones futuras.
  * **Personalización:** Inmediatamente después del login, la aplicación adaptará su **idioma** (ES/FR/EN) y **tema** (Claro/Oscuro/Tierra) basándose en las preferencias (`user_language`, `user_theme`) guardadas en el perfil del usuario del backend.
  * **Gestión de Datos:** Vistas de tipo CRUD (Crear, Leer, Actualizar, Borrar) para las entidades principales del backend: `Productos`, `Clientes`, `Proveedores`, `Almacenes`.
  * **Operaciones:** Vistas de formulario complejas para registrar las operaciones de `Compra` y `Venta`.
  * **Trazabilidad:** Vistas de solo lectura para consultar `Movimientos` y `Albaranes`.

#### 2\. Stack Tecnológico (Frontend)

El stack se selecciona priorizando **versiones estables y LTS (Long-Term Support)** de las herramientas.

| Categoría | Herramienta | Versión / Detalle Clave |
| :--- | :--- | :--- |
| **Plataforma** | **Node.js** | **20.x (LTS)**. |
| **Framework** | Vue 3 | Versión Estable (Composition API). |
| **Lenguaje** | TypeScript | Tipado estricto. |
| **Build Tool** | Vite | Versión Estable. Servidor HMR y build. |
| **Gestión de Estado** | Pinia | Almacén central para el token, usuario, tema e idioma. |
| **Routing** | Vue Router | Gestión de vistas y navegación. |
| **Internacionalización** | vue-i18n | Para gestionar los textos en ES, FR, EN. |
| **Cliente HTTP** | Axios | Para consumir la API del backend. |
| **Entorno** | Docker | Opcional, con `Dockerfile` y `.devcontainer` para desarrollo. |
| **Calidad Código**| ESLint, Prettier | Linting y formateo de código. |
| **Estilos** | SCSS / Variables CSS | Estructura para gestionar temas dinámicos (Claro, Oscuro, Tierra). |

#### 3\. Estructura del Proyecto (`DemeArizOil-Frontend/`)

```
?? DemeArizOil-Frontend/
+-- ?? .devcontainer/
¦   +-- ?? devcontainer.json (Configuración para Dev Containers)
¦   +-- ?? Dockerfile        (Dockerfile de desarrollo Node.js 20.x LTS)
+-- ?? public/
¦   +-- ... (Assets estáticos)
+-- ?? src/
¦   +-- ?? assets/     (Imágenes, fuentes)
¦   +-- ?? components/ (Componentes reusables, ej: Button.vue, Modal.vue)
¦   +-- ?? composables/ (Lógica reutilizable, ej: useApi.ts)
¦   +-- ?? i18n/       (Archivos de traducción: es.json, fr.json, en.json)
¦   +-- ?? router/     (Configuración de Vue Router, ej: index.ts)
¦   +-- ?? services/   (Configuración de Axios, ej: api.ts)
¦   +-- ?? store/      (Módulos de Pinia, ej: auth.store.ts, settings.store.ts)
¦   +-- ?? styles/     (Estilos globales y temas: _main.scss, _light.scss, _dark.scss, _earth.scss)
¦   +-- ?? types/      (Interfaces TypeScript, ej: product.types.ts)
¦   +-- ?? views/      (Vistas de página, ej: LoginView.vue, ProductListView.vue)
¦   +-- ?? App.vue     (Componente raíz, gestiona el tema y el idioma)
¦   +-- ?? main.ts     (Punto de entrada, inicializa Vue, Pinia, Router, i18n)
+-- ?? .env.example
+-- ?? .gitignore
+-- ?? index.html
+-- ?? package.json
+-- ?? tsconfig.json
+-- ?? vite.config.ts
```

#### 4\. Gestión de Estado y Tipos (Pinia + TypeScript)

El "corazón" del frontend será análogo al esquema de la base de datos, pero desde la perspectiva del cliente:

  * **`src/types/` (Tipos):** Contendrá interfaces TypeScript (ej. `ProductRead`, `UserRead`) que deben coincidir exactamente con los esquemas Pydantic del backend para garantizar la seguridad de tipos.
  * **`src/store/` (Estado):** Contendrá los "almacenes" (stores) de Pinia.
      * **`auth.store.ts`:** Responsable de guardar el `token: string | null` y `user: UserRead | null`. Gestionará las acciones de `login()` y `logout()`.
      * **`settings.store.ts`:** Gestionará el estado global del **idioma** (ej. `es`) y el **tema** (ej. `theme-dark`). Reaccionará a los datos cargados desde `auth.store` y permitirá al usuario cambiar estas preferencias, persistiéndolas en el backend.
      * **Módulos de CRUD (ej. `product.store.ts`):** Gestionará el estado de las listas de productos, la carga, y las acciones para `fetchProducts()`, `createProduct()`, etc.

#### 5\. Arranque y Flujo de Desarrollo

1.  **Clonar** el repositorio.
2.  **Instalar dependencias** con `npm install`.
3.  **Configurar `.env.local`** (basado en `.env.example`) para apuntar al backend (`VITE_API_BASE_URL`).
4.  **Ejecutar** el servidor de desarrollo con `npm run dev`.
5.  (Alternativa) **Abrir en Dev Container** en VS Code para un entorno Dockerizado.

-----

## ?? **Resumen Completo - Frontend (DemeArizOil-Frontend)**

### ?? **Propósito General**

El frontend de **DemeArizOil** proporciona una **SPA moderna** (Single Page Application) para la interacción con el sistema backend, centrada en la **usabilidad**, la **internacionalización (i18n)** y la **consistencia visual** con los valores de la marca.

---

### ?? **Stack Tecnológico (LTS / Estable)**

| Componente           | Tecnología                   | Versión / Tipo | Propósito                           |
| -------------------- | ---------------------------- | -------------- | ----------------------------------- |
| Lenguaje             | **TypeScript**               | Última estable | Tipado estático y mantenibilidad    |
| Framework            | **Vue 3** (Composition API)  | Estable        | Desarrollo de componentes reusables |
| Build Tool           | **Vite**                     | Estable        | Compilación rápida y moderna        |
| Estado Global        | **Pinia**                    | Estable        | Manejo de estado centralizado       |
| Routing              | **Vue Router 4**             | Estable        | Navegación SPA                      |
| Internacionalización | **vue-i18n**                 | Estable        | Soporte multiidioma                 |
| Cliente HTTP         | **Axios**                    | Estable        | Comunicación con API Backend        |
| Estilos              | **SCSS / Tailwind opcional** | Estable        | Tematización y estilos adaptables   |
| Testing              | **Vitest / Cypress**         | Estables       | Pruebas unitarias y E2E             |
| Entorno              | **Node.js 20.x LTS**         | LTS            | Ejecución y build confiables        |
| Despliegue           | **Nginx + Docker**           | Estable        | Hosting de la aplicación compilada  |

---

### ?? **Estructura del Proyecto**

```
src/
+-- assets/           # Imágenes, fuentes, estilos globales
+-- components/       # Componentes reutilizables
+-- composables/      # Hooks reutilizables (Composition API)
+-- layouts/          # Layouts globales (principal, login, error)
+-- router/           # Configuración de rutas (Vue Router)
+-- stores/           # Estado global (Pinia)
+-- i18n/             # Archivos de idioma
+-- services/         # Comunicación con API (Axios)
+-- views/            # Páginas principales
+-- App.vue           # Componente raíz
+-- main.ts           # Punto de entrada
```

---

### ?? **Temas y Diseño**

* **3 temas principales**: Claro, Oscuro y Tierra.
* Sistema dinámico de cambio de tema con persistencia (localStorage).
* Soporte para diseño responsivo móvil/escritorio.

---

### ?? **Internacionalización (i18n)**

* Idiomas principales: **es**, **en**, **fr**.
* Archivos de traducción por módulo (`/i18n/{lang}/`).
* Detección automática del idioma por navegador.

---

### ?? **Autenticación**

* Integración directa con endpoints de FastAPI (`/auth/login`, `/auth/refresh`).
* Tokens JWT almacenados en `localStorage` o `cookies seguras`.
* Redirección automática si el token expira.

---

### ?? **Principios de Diseño**

1. Componentización extrema (todo reutilizable).
2. Uso mínimo de dependencias externas.
3. Consistencia con la API backend.
4. Mantenimiento del estado entre recargas.
5. Modularidad, escalabilidad y documentación interna.

---

### ?? **Testing**

* **Vitest** ? pruebas unitarias de componentes.
* **Cypress** ? pruebas de interfaz completas (E2E).
* Cobertura mínima: **80%**.

---

### ?? **Despliegue**

El frontend se compila con Vite y se sirve mediante **Nginx** dentro de un contenedor Docker.
El `Dockerfile` de producción genera una imagen optimizada y cacheable.

---