# nxia-lab Landing Page

Sitio web institucional de `nxia-lab`, una landing page pensada para presentar servicios de IA, datos y automatización de forma clara y directa.

## Vista general

El proyecto está armado como una página estática con:

- Sección hero con propuesta de valor
- Bloque de servicios
- Casos de uso
- Formulario de contacto
- Footer con datos de contacto y navegación

## Archivos principales

- `index.html`: estructura y contenido de la página
- `styles.css`: estilos visuales y layout responsive
- `script.js`: interacciones simples del sitio

## Requisitos

No necesita dependencias ni instalación especial. Solo un navegador moderno.

## Formulario de contacto

El formulario envía mensajes reales a Gmail a través de una función de Vercel.

Variables de entorno requeridas en Vercel:

- `GMAIL_USER`: tu cuenta de Gmail
- `GMAIL_APP_PASSWORD`: contraseña de aplicación de Gmail
- `CONTACT_TO_EMAIL`: destino de los mensajes, por ejemplo `nxialab@gmail.com`

Para que el envío funcione, Gmail debe tener activada la verificación en dos pasos y una contraseña de aplicación creada para este sitio.

## Ejecutar en local

Podés abrir el archivo `index.html` directamente o servir la carpeta con un servidor local.

Ejemplo con Python:

```bash
python -m http.server 8081
```

Luego abrí:

```text
http://127.0.0.1:8081/
```

## Contacto

- Email: `nxialab@gmail.com`

## Estado

Landing page lista para publicar y adaptar con nuevos contenidos o secciones.
