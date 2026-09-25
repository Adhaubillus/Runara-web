# Guía · Tu primera página web con la terminal y VS Code

Esta carpeta es la página web de **Runara by Adhara**. Esta guía te lleva de cero a verla funcionando en tu computador, entender cómo está hecha y cambiarla tú misma. Síguela en orden la primera vez.

---

## 1. Qué hay en la carpeta

```
runara-web/
├── index.html          ← el CONTENIDO: textos, secciones, orden de la página
├── css/
│   └── styles.css      ← el DISEÑO: colores, tipografías, tamaños, animaciones
├── js/
│   ├── productos.js    ← el CATÁLOGO: lista de productos (aquí editas prendas)
│   └── main.js         ← el MOVIMIENTO: animaciones, filtros, ventana de detalle
├── assets/
│   ├── img/            ← fotos (sacadas del manual de marca)
│   ├── brand/          ← logo, símbolo del corazón y favicon en vector (SVG)
│   └── fonts/          ← tipografías Cormorant Garamond y DM Sans
├── package.json        ← atajo para abrir la página con un comando
└── GUIA.md             ← este archivo
```

Toda página web tiene estas tres capas:

| Capa | Lenguaje | Piensa en ella como… |
|---|---|---|
| Estructura | **HTML** | El esqueleto y los textos |
| Estilo | **CSS** | La ropa: color, tipografía, espacio |
| Comportamiento | **JavaScript** | El movimiento y las reacciones a clics y al scroll |

---

## 2. Prepara tu computador (una sola vez)

Necesitas tres programas gratuitos:

1. **VS Code**: el editor donde escribes código. Ya tienes el instalador en Descargas (`VSCodeUserSetup-x64...exe`). Si no lo has instalado, ábrelo y marca la opción **"Agregar a PATH"** durante la instalación.
2. **Node.js (versión LTS)**: descárgalo en [nodejs.org](https://nodejs.org). Te permite usar herramientas de desarrollo desde la terminal.
3. **Git** (opcional pero recomendado): descárgalo en [git-scm.com](https://git-scm.com). Guarda versiones de tu trabajo.

Después de instalarlos, **cierra y vuelve a abrir** VS Code.

### Comprueba que todo quedó bien

Abre VS Code y abre la terminal con **Ctrl + ñ** (o menú *Terminal → Nuevo terminal*). En Windows la terminal se llama **PowerShell**. Escribe cada línea y presiona Enter:

```powershell
node -v
npm -v
git --version
```

Si cada comando responde con un número de versión (por ejemplo `v22.11.0`), estás lista. Si alguno dice *"no se reconoce como nombre de un cmdlet"*, ese programa no quedó instalado o necesitas reiniciar VS Code.

---

## 3. Abre el proyecto desde la terminal

```powershell
cd $HOME\Documents\runara-web
code .
```

- `cd` significa *change directory*: te mueve a esa carpeta. `$HOME` es tu carpeta de usuario (`C:\Users\adhar`).
- `code .` abre la carpeta actual (`.` significa "aquí") en VS Code.

---

## 4. Mira la página en vivo

### Opción A: la extensión Live Server (la más fácil)

1. En VS Code, ve a **Extensiones** (Ctrl + Shift + X).
2. Busca **Live Server** (de Ritwick Dey) e instálala. VS Code puede sugerírtela sola porque está en las recomendaciones del proyecto.
3. Abre `index.html` y haz clic en **Go Live**, abajo a la derecha.

Se abre tu navegador en `http://127.0.0.1:5500`. **Cada vez que guardes un archivo (Ctrl + S), la página se recarga sola.**

### Opción B: desde la terminal

```powershell
npm run dev
```

Hace lo mismo que Live Server. Para detenerlo, presiona **Ctrl + C** en la terminal.

> ¿Por qué no basta con abrir el `index.html` con doble clic? Funciona casi todo, pero algunos navegadores bloquean recursos cuando la página se abre como archivo suelto. Un servidor local se comporta como un sitio real.

---

## 5. Comandos de terminal que vas a usar siempre

| Comando (PowerShell) | Qué hace |
|---|---|
| `pwd` | Muestra en qué carpeta estás |
| `ls` | Lista lo que hay en la carpeta |
| `cd nombre` | Entra a una carpeta |
| `cd ..` | Sube una carpeta |
| `mkdir nueva-carpeta` | Crea una carpeta |
| `ni archivo.html` | Crea un archivo vacío (*New-Item*) |
| `code .` | Abre la carpeta actual en VS Code |
| `cls` | Limpia la pantalla |
| **Tab** | Autocompleta nombres de carpetas y archivos |
| **↑** | Repite el comando anterior |
| **Ctrl + C** | Detiene lo que esté corriendo |

---

## 6. Tus primeros cambios (ejercicios)

Haz estos cambios con la página abierta en Live Server para ver el efecto al guardar.

### Ejercicio 1: cambia un color de la marca
Abre `css/styles.css`. Arriba verás las **variables de marca**:

```css
:root {
  --vino: #3c070a;
  --burdeos: #631620;
  --carmin: #9a2028;
  ...
}
```

Cambia `--carmin` por `#c0392b`, guarda y mira cómo cambia en toda la página. Luego déjalo como estaba. **Por eso usamos variables: un solo cambio actualiza todo.**

### Ejercicio 2: cambia el nombre de un producto
Abre `js/productos.js` y cambia `nombre: "Body Encaje Nocturno"` por el nombre real. Guarda. La tarjeta y la ventana de detalle se actualizan solas.

### Ejercicio 3: agrega un producto nuevo
1. Pon la foto en `assets/img/` (por ejemplo `prod-bralette.jpg`, vertical, idealmente 900 × 1200 px).
2. En `js/productos.js`, copia un bloque completo `{ ... },` y pégalo debajo.
3. Cambia `id`, `nombre`, `linea`, `imagen` y los textos.

Si la página se queda en blanco, casi siempre es una **coma faltante** entre productos o una **comilla sin cerrar**.

### Ejercicio 4: cambia el título de la portada
En `index.html` busca `Más que` (Ctrl + F) y cambia el texto.

---

## 7. Cómo funciona el movimiento

- **Pantalla de entrada**: al cargar, el `<body>` tiene la clase `is-loading`. Cuando las imágenes terminan de cargar, JavaScript la quita y el telón sube (CSS `clip-path`).
- **Aparición al hacer scroll**: los elementos con `data-anim` empiezan invisibles. Un `IntersectionObserver` (en `main.js`) detecta cuándo entran en pantalla y les pone la clase `is-visible`. El CSS hace la transición.
- **Parallax**: las imágenes con `data-parallax` se desplazan un poco más lento que el scroll.
- **"Un día en la vida"**: en computador, el scroll vertical mueve las tarjetas en horizontal. En celular se deslizan con el dedo.
- **Catálogo**: `main.js` recorre la lista `PRODUCTOS` y construye el HTML de cada tarjeta. Los filtros esconden o muestran tarjetas según su `linea`.
- **Accesibilidad**: si alguien activó "reducir movimiento" en su sistema, las animaciones se apagan solas.

### Tu mejor amiga: las herramientas de desarrollo
En el navegador presiona **F12**. Con la flecha (arriba a la izquierda) haz clic en cualquier parte de la página y verás su HTML y su CSS. Puedes cambiar valores ahí mismo para probar. Esos cambios no se guardan; cuando te guste algo, llévalo al archivo en VS Code. El ícono de celular 📱 te muestra cómo se ve en móvil.

---

## 8. Guarda versiones con Git

Git es como un "guardar partida". Desde la terminal, dentro de la carpeta del proyecto:

```powershell
git init                              # solo la primera vez
git add .
git commit -m "Primera versión de la página Runara"
```

Cada vez que termines un cambio importante:

```powershell
git add .
git commit -m "Describe aquí lo que cambiaste"
```

---

## 9. Publícala en internet

La forma más rápida es **Netlify Drop**: entra a [app.netlify.com/drop](https://app.netlify.com/drop) y arrastra la carpeta `runara-web`. En segundos tienes un enlace público. Después puedes conectar tu dominio `runara.com`.

Otras opciones gratuitas: GitHub Pages y Vercel (las dos funcionan con Git).

---

## 10. Antes de publicar

- [ ] **Nombres y descripciones de productos**: los actuales son provisionales (`js/productos.js`).
- [ ] **Fotos**: las actuales salen del manual de marca. Reemplázalas por fotos reales de las prendas y de las modelos, con su consentimiento para uso web.
- [ ] **Formulario del círculo fundador**: hoy solo muestra un mensaje de agradecimiento y no guarda los correos. Para guardarlos, conecta un servicio como [Formspree](https://formspree.io), Brevo o Mailchimp.
- [ ] **Afirmaciones de sostenibilidad**: publica solo lo que puedas demostrar (la SIC exige que las afirmaciones ambientales sean veraces y comprobables).
- [ ] **Tallas**: confirma el rango real antes de mostrarlo.
- [ ] **Enlaces**: verifica que `runara.com` y `@runara.by.adhara` estén registrados a nombre de la marca.

---

## Próximos pasos para aprender

1. Cambia textos y colores hasta sentirte cómoda con HTML y CSS.
2. Crea una segunda página (`producto.html` o `nosotras.html`) copiando la estructura de `index.html`.
3. Aprende Flexbox y Grid (las dos formas de acomodar elementos en CSS). Juegos para practicar: *Flexbox Froggy* y *Grid Garden*.
4. Cuando quieras vender en línea, evalúa Shopify o WooCommerce y reutiliza este diseño.
