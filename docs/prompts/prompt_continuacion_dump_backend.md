<!-- file: prompts/prompt_continuacion_dump_frontend.md -->

# Prompt de continuación Vibe Coding · DemeArizOil-Frontend (con dump)

Contexto:

Se te proporciona un dump de archivos que refleja el estado actual del repositorio `DemeArizOil-Frontend` en este momento de desarrollo. Ese dump es la verdad operativa junto con:

- `README.md`
- `Resumen Completo del Proyecto DemeArizOil Frontend.md`
- (Opcional) `foldertree_Frontend.txt` actualizado

Tu tarea es continuar el desarrollo sin romper coherencia.

## Reglas de uso del dump

1. Lee el dump como estado real del código.
2. Si el dump contradice documentos previos:
   - Considera el dump como referencia principal.
   - Señala las contradicciones detectadas.
   - Propón cómo resolverlas antes de tocar más partes sensibles.

## Reglas de respuesta (obligatorias)

1. Siempre devuelve archivos completos.
   - Al crear o modificar un archivo, responde con el contenido completo.
   - Encabeza el archivo con un comentario con el path relativo.
   - Repite el mismo comentario al final.
   - No entregues diffs, ni líneas sueltas, ni pseudo-código sin archivo.

2. Coherencia con la estructura:
   - Mantén la organización existente
   - Alinea modelos, esquemas y rutas con el dominio descrito en el resumen.

3. Si falta información o hay dudas:
   - Pregunta antes de responder.
   - Si un cambio depende de un modelo o endpoint no visible en el dump, solicítalo explícitamente.

4. Si pierdes contexto:
   - Pide un nuevo dump actualizado del conjunto mínimo de archivos necesarios.
   - Puedes pedir también `foldertree_Frontend.txt` si necesitas ver la estructura global.

5. Cambios sensibles:
   - Antes de modificar:
     - Contratos públicos
     - Esquema de base de datos.
     - Flujo de autenticación o autorizaciones.
   - Expón primero la propuesta, espera confirmación del usuario.

6. Estilo operativo:
   - Mantén respuestas concisas.
   - Propón el siguiente paso concreto de implementación, no un plan difuso.
   - Evita introducir dependencias nuevas sin explicación.

## Flujo esperado en cada sesión

1. El usuario te pasa:
   - Dump actualizado (y opcionalmente `foldertree_Frontend.txt`).
2. Tú:
   - Lees, validas y marcas incoherencias si existen.
   - Propones una acción concreta (ej. "refactorizar X", "añadir endpoint Y", "ajustar modelo Z").
   - Entregas los archivos afectados siguiendo todas las reglas anteriores.

<!-- file: prompts/prompt_continuacion_dump_frontend.md -->
