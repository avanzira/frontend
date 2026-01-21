# Continuacion Frontend DemeArizOil

## Contexto del backend
- Base URL: https://demeoil.pythonanywhere.com
- Prefijo API: /api
- Ejemplo salud backend: GET / -> {"app":"DemeArizOil Backend","status":"running"}
- Endpoints publicos:
  - POST /api/auth/login
  - POST /api/auth/refresh
- Resto requiere JWT con Authorization: Bearer <access_token>
- Formato de error:
  {
    "error": "ErrorName",
    "message": "Detalle legible"
  }

## Convenciones CRUD
- GET /resource/ -> lista
- GET /resource/<id> -> detalle
- POST /resource/ -> create (201)
- PUT /resource/<id> -> update (200)
- DELETE /resource/<id> -> soft delete (200)
- POST /resource/<id>/restore -> restore (200)

## Auth
- POST /api/auth/login
  - Body: {"username":"admin","password":"admin123"}
  - Respuesta: {"access_token":"...","refresh_token":"...","user":{...}}
- POST /api/auth/refresh
  - Respuesta: {"access_token":"...","refresh_token":"..."}
- No hay /auth/me. Se usa el user del login.

## Users
- POST /api/users/
  - Body: {"username":"...","password":"...","rol":"ADMIN","email":"..."}
- PUT /api/users/<id> (para preferencias):
  - user_language, user_theme (y otros campos a confirmar)
- POST /api/users/change-password
  - Endpoint dedicado para cambiar password (no se envia password en PUT)

## Products
- POST /api/products/
  - Body: {"name":"...","unit_measure":"ud","is_inventory":true}
- Respuesta incluye: name, unit_measure, is_inventory, cost_average

## Customers
- POST /api/customers/
  - Body: {"name":"...","phone":"...","email":"...","address":"..."}
- Crea StockLocation automaticamente (customer_<id>_stock)

## Suppliers
- POST /api/suppliers/
  - Body: {"name":"...","phone":"...","email":"...","address":"..."}
- Crea CashAccount automaticamente (supplier_<id>_cash)

## Purchase Notes (albaranes compra)
- POST /api/purchase_notes/ (DRAFT)
  - Body: {"supplier_id":1,"date":"YYYY-MM-DD","paid_amount":0}
- POST /api/purchase_notes/<id>/lines
  - Body: {"product_id":1,"quantity":10,"unit_price":100,"total_price":1000}
- POST /api/purchase_notes/<id>/confirm
- Salida: supplier_id, date, status, total_amount, paid_amount

## Sales Notes (albaranes venta)
- POST /api/sales_notes/ (DRAFT)
  - Body: {"customer_id":1,"date":"YYYY-MM-DD","paid_amount":0}
- POST /api/sales_notes/<id>/lines
  - Body: {"product_id":1,"quantity":7,"unit_price":300,"total_price":2100}
- POST /api/sales_notes/<id>/confirm
- Salida: customer_id, date, status, total_amount, paid_amount

## Stock Locations
- POST /api/stock_locations/
  - Body: {"name":"custom_location"}
- No se permite crear manualmente DEME_STOCK

## Stock Product Locations
- POST /api/stock_product_locations/
  - Body: {"product_id":1,"stock_location_id":1,"quantity":0}

## Stock Deposit Notes
- POST /api/stock_deposit_notes/
  - Body:
    {
      "from_stock_location_id": 1,
      "to_stock_location_id": 2,
      "product_id": 1,
      "quantity": 5,
      "date": "YYYY-MM-DD",
      "notes": "..."
    }
- POST /api/stock_deposit_notes/<id>/confirm

## Cash Accounts
- POST /api/cash_accounts/
  - Body: {"name":"custom_cash","balance":0}

## Cash Transfer Notes
- POST /api/cash_transfer_notes/
  - Body:
    {
      "from_cash_account_id": 1,
      "to_cash_account_id": 2,
      "amount": 500,
      "date": "YYYY-MM-DD",
      "notes": "..."
    }
- POST /api/cash_transfer_notes/<id>/confirm

## Backup
- GET /api/backup -> descarga backup.sqlite3
- POST /api/backup -> multipart form con file

## Requisitos UI
- Login con username y password
- Menu principal con secciones
  1) Crear entidades: usuarios, clientes, proveedores, productos
  2) Crear documentos: albaranes compra/venta, transferencias cash, depositos stock
  3) Ver informes: listado de stocks, cash, entidades, albaranes, etc.
- Listados con filtros
- Albaranes: DRAFT -> CONFIRMED con lineas
- Transferencias/depositos: una sola linea
- Roles: por ahora todos pueden todo; mas adelante restringir USER

## Preguntas abiertas
1) Confirmar refresh token en header: Authorization: Bearer <refresh_token> (no en body)
2) Confirmar campos exactos aceptados por PUT /api/users/<id> para preferencias
3) Definir filtros minimos por listado (estado, fecha, nombre, etc.)
4) Orden y prioridad de secciones del menu
5) Atributos completos de cada entidad para formularios

## Models y schema (v3.0)
Fuente: models_schema_v3.0.md (backend)

### BaseModel (campos comunes)
- id, created_at, updated_at, deleted_at, is_active
- created_by, updated_by (FK users.id)

### Enums
- UserRole: ADMIN | USER
- DocumentStatus: DRAFT | CONFIRMED
- StockMovementType: PURCHASE | SALE | TRANSFER | ADJUSTMENT (no persistido)

### Entidades
User (users)
- username, email, rol
- user_language, user_theme
- hash_password, last_login, password_changed_at

Product (products)
- name, unit_measure, is_inventory, cost_average

Customer (customers)
- name, phone, email, address

Supplier (suppliers)
- name, phone, email, address
- regla: 1 CashAccount asociado

### Aggregates
StockLocation (stock_locations)
- name

StockProductLocation (stock_product_locations)
- stock_location_id, product_id, quantity
- unique(stock_location_id, product_id), quantity >= 0

CashAccount (cash_accounts)
- name, balance
- reglas: empresa/banco balance >= 0; supplier balance <= 0
- deudas viven aqui (no en documentos)

### Documentos
PurchaseNote (purchase_notes)
- supplier_id, date, status, total_amount, paid_amount
- regla: total_amount >= paid_amount

PurchaseNoteLine (purchase_note_lines)
- purchase_note_id, product_id, quantity, unit_price, total_price

SalesNote (sales_notes)
- customer_id, date, status, total_amount, paid_amount
- regla: total_amount == paid_amount

SalesNoteLine (sales_note_lines)
- sales_note_id, product_id, quantity, unit_price, total_price

StockDepositNote (stock_deposit_notes)
- from_stock_location_id, to_stock_location_id, date, product_id, quantity, status, notes

CashTransferNote (cash_transfer_notes)
- from_cash_account_id, to_cash_account_id, amount, date, status, notes
- regla: amount > 0

### Exclusiones
- No hay models/tablas de StockMovement ni CashMovement
- Auth y Backup no forman parte del schema

## backend.json (insights extra)
- Env: TOKEN_EXPIRE_MINUTES=60, REFRESH_EXPIRE_DAYS=30 (JWT_SECRET_KEY definido)
- Tests confirman rutas CRUD con prefijo settings.API_PREFIX (por defecto /api)
- Endpoints de lineas:
  - POST /api/purchase_notes/<id>/lines
  - DELETE /api/purchase_notes/lines/<line_id>
  - POST /api/sales_notes/<id>/lines
  - DELETE /api/sales_notes/lines/<line_id>
- Flujo tipico (segun test_100_full_flow_basic):
  - Crear purchase_note (draft) -> agregar lineas -> actualizar paid_amount -> confirmar
  - Crear stock_deposit_note -> confirmar
  - Crear sales_note -> agregar lineas -> actualizar paid_amount -> confirmar
  - Crear cash_transfer_note -> confirmar
- Payloads minimos en tests:
  - Customers/Suppliers: solo name
  - Products: name, unit_measure, is_inventory
  - CashAccount: name, balance
  - StockLocation: name
  - StockDepositNote: from_stock_location_id, to_stock_location_id, product_id, quantity
  - CashTransferNote: from_cash_account_id, to_cash_account_id, amount

## Cambios recientes en frontend
### API y auth
- Login usa JSON (no form-urlencoded)
- Refresh token en header Authorization: Bearer <refresh_token>
- BaseURL por defecto: /api con proxy de Vite hacia pythonanywhere
- .env usa VITE_API_BASE_URL=/api

### i18n
- Todos los textos visibles migrados a i18n con keys
- Footer con interpolacion: "© {year} DemeArizOil"
- Texto demo del login queda fijo (no traducido)
- Instancia i18n exportada y actualizada en runtime desde settings.store

### UI base
- Componentes base creados:
  - BaseButton, BaseCard, SectionTitle, LandingGrid
- Componentes extra:
  - FeaturePlaceholder, GenericReportTable
- Tema earth actualizado y nuevas variables de tema (surface, border, primary, muted, danger)

### Navegacion y vistas
- Nueva estructura:
  - /app (Landing principal)
  - /app/entities (Landing entidades)
  - /app/documents (Landing documentos)
  - /app/reports (Landing informes)
- Subrutas placeholder:
  - /app/entities/me (Settings actual)
  - /app/entities/users, products, customers, suppliers
  - /app/documents/purchase-notes, sales-notes, stock-deposits, cash-transfers
- Login redirige a /app
- Nav incluye Inicio, Entidades, Documentos, Informes, Perfil, Salir

## Pendiente siguiente paso
- Implementar CRUD reales (elegir entidad prioritaria)
- Definir tablas/columnas reales para informes
- Revisar estilo final y extraer mas componentes si hace falta
