# Manual de Usuario — DemeArizOil Frontend

## Acceso y navegacion

- Iniciar sesion con usuario y password.
- Tras login se abre el panel principal con tres secciones:
  - Entidades
  - Documentos
  - Informes
- La barra superior muestra accesos rapidos:
  - Inicio, Entidades, Documentos, Informes, Perfil, Salir.

## Perfil

- Ruta: /app/profile
- Permite actualizar:
  - Usuario, email
  - Idioma y tema
- El cambio de idioma y/o tema aplica al instante al guardar.
- Cambio de contraseña:
  - Usa el endpoint dedicado /users/change-password
  - La contraseña debe tener al menos 6 caracteres

## Entidades

- Landing con accesos:
  - Usuarios (solo ADMIN)
  - Productos
  - Clientes
  - Proveedores

## Usuarios (solo ADMIN)

- Lista con filtros por rol y estado (activo/inactivo)
- Crear usuario:
  - username, email, rol (default USER), password
  - user_language, user_theme (opcionales)
- Editar usuario:
  - username, email, rol, user_language, user_theme
  - No permite cambiar password desde edicion
- Cambiar contraseña:
  - Usa /users/change-password
  - TODO cambiar la contraseña de otro usuario desde el panel, añadiendo el nombre o id ¿Es posible con esta API?
- Desactivar y restaurar usuario (soft delete / restore)

## Documentos

- Landing con accesos:
  - Albaranes de compra
  - Albaranes de venta
  - Depositos de stock
  - Transferencias de cash

## Informes

- Landing con listados base para compras, ventas, transferencias y depositos.
