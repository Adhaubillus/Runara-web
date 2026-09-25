/* ══════════════════════════════════════════════════════════════
   RUNARA by Adhara · Interacción y movimiento
   Cada bloque es independiente y empieza con un comentario que
   explica qué hace. Lee de arriba hacia abajo.
   ══════════════════════════════════════════════════════════════ */

// Atajos para buscar elementos en el HTML
const $ = (selector, contexto = document) => contexto.querySelector(selector);
const $$ = (selector, contexto = document) => [...contexto.querySelectorAll(selector)];

// ¿La persona pidió menos movimiento en su sistema? Lo respetamos.
const menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const esEscritorio = () => window.innerWidth > 860;

/* ─── 1. Pantalla de entrada ──────────────────────────────────
   Muestra el corazón unos segundos y luego descubre la página. */
function iniciarEntrada() {
  const mostrar = () => {
    document.body.classList.remove("is-loading");
    setTimeout(() => document.body.classList.add("is-listo"), 250);
  };
  const espera = menosMovimiento ? 0 : 1500;
  if (document.readyState === "complete") setTimeout(mostrar, espera);
  else window.addEventListener("load", () => setTimeout(mostrar, espera));
  // Por si alguna imagen tarda demasiado: nunca esperar más de 3,5 s
  setTimeout(mostrar, 3500);
}

/* ─── 2. Navegación ───────────────────────────────────────────
   Cambia de color al bajar y se esconde si sigues bajando;
   reaparece en cuanto subes. */
function iniciarNavegacion() {
  const nav = $("[data-nav]");
  let ultimaPosicion = 0;

  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > window.innerHeight * 0.85);
    nav.classList.toggle("is-oculto", y > ultimaPosicion && y > window.innerHeight * 1.2);
    ultimaPosicion = y;
  }, { passive: true });

  // Menú del celular
  const boton = $("[data-menu-btn]");
  const menu = $("[data-menu]");
  const alternar = (abrir) => {
    menu.classList.toggle("is-abierto", abrir);
    boton.setAttribute("aria-expanded", abrir);
    document.body.classList.toggle("sin-scroll", abrir);
    nav.classList.toggle("is-scrolled", abrir || window.scrollY > window.innerHeight * 0.85);
    if (abrir) nav.style.color = "var(--marfil)"; else nav.style.color = "";
    if (abrir) nav.style.background = "transparent"; else nav.style.background = "";
  };
  boton.addEventListener("click", () => alternar(!menu.classList.contains("is-abierto")));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => alternar(false)));
}

/* ─── 3. Catálogo de productos ────────────────────────────────
   Toma la lista PRODUCTOS (js/productos.js) y crea una tarjeta
   por cada producto. Así el HTML no se repite seis veces.      */
const guardados = new Set(leerGuardados());

function leerGuardados() {
  try { return JSON.parse(localStorage.getItem("runara-guardados")) || []; }
  catch { return []; }
}
function escribirGuardados() {
  try { localStorage.setItem("runara-guardados", JSON.stringify([...guardados])); } catch {}
}

function tarjetaProducto(p) {
  const guardado = guardados.has(p.id);
  return `
    <article class="producto" data-id="${p.id}" data-linea="${p.linea}" tabindex="0" aria-label="${p.nombre}">
      <figure class="producto__img">
        ${p.etiqueta ? `<span class="producto__etiqueta">${p.etiqueta}</span>` : ""}
        <button class="producto__guardar ${guardado ? "is-guardado" : ""}" data-guardar="${p.id}"
                aria-label="Guardar ${p.nombre}" aria-pressed="${guardado}">
          <svg><use href="#i-corazon"/></svg>
        </button>
        <img src="${p.imagen}" alt="${p.nombre}" loading="lazy" />
        <span class="producto__ver">Ver detalle</span>
      </figure>
      <h3 class="producto__nombre">${p.nombre}</h3>
      <p class="producto__meta"><span>${p.resumen}</span><span class="producto__estado">Preventa</span></p>
    </article>`;
}

function iniciarCatalogo() {
  const contenedor = $("[data-productos]");
  contenedor.innerHTML = PRODUCTOS.map(tarjetaProducto).join("");
  actualizarContador(false);

  // Clic en una tarjeta: abre el detalle. Clic en el corazón: guarda.
  contenedor.addEventListener("click", (e) => {
    const corazon = e.target.closest("[data-guardar]");
    if (corazon) { e.stopPropagation(); alternarGuardado(corazon.dataset.guardar); return; }
    const tarjeta = e.target.closest(".producto");
    if (tarjeta) abrirDetalle(tarjeta.dataset.id);
  });
  contenedor.addEventListener("keydown", (e) => {
    const tarjeta = e.target.closest(".producto");
    if (tarjeta && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); abrirDetalle(tarjeta.dataset.id); }
  });

  // Filtros
  const botones = $$("[data-filtro]");
  const marcador = $("[data-marcador]");
  const moverMarcador = (boton) => {
    marcador.style.width = `${boton.offsetWidth}px`;
    marcador.style.height = `${boton.offsetHeight}px`;
    marcador.style.transform = `translate(${boton.offsetLeft}px, ${boton.offsetTop}px)`;
  };
  botones.forEach((b) => b.addEventListener("click", () => filtrar(b.dataset.filtro)));
  window.addEventListener("resize", () => moverMarcador($(".filtro.is-activo")));
  requestAnimationFrame(() => moverMarcador($(".filtro.is-activo")));

  function filtrar(linea) {
    botones.forEach((b) => {
      const activo = b.dataset.filtro === linea;
      b.classList.toggle("is-activo", activo);
      b.setAttribute("aria-selected", activo);
      if (activo) moverMarcador(b);
    });
    const tarjetas = $$(".producto", contenedor);
    // 1) desaparecen todas  2) se muestran las que coinciden, una tras otra
    tarjetas.forEach((t) => t.classList.add("is-saliendo"));
    setTimeout(() => {
      let i = 0;
      tarjetas.forEach((t) => {
        const coincide = linea === "todo" || t.dataset.linea === linea;
        t.hidden = !coincide;
        t.classList.remove("is-saliendo");
        if (coincide) {
          t.classList.add("is-entrando");
          setTimeout(() => t.classList.remove("is-entrando"), 60 + i++ * 90);
        }
      });
    }, 380);
  }

  // Botones "Ver bodies / Ver tangas" en la sección Líneas
  $$("[data-filtro-ir]").forEach((b) =>
    b.addEventListener("click", () => {
      $("#coleccion").scrollIntoView({ behavior: menosMovimiento ? "auto" : "smooth" });
      setTimeout(() => filtrar(b.dataset.filtroIr), 500);
    })
  );
}

function alternarGuardado(id) {
  const producto = PRODUCTOS.find((p) => p.id === id);
  const ahora = !guardados.has(id);
  ahora ? guardados.add(id) : guardados.delete(id);
  escribirGuardados();
  $$(`[data-guardar="${id}"]`).forEach((b) => {
    b.classList.toggle("is-guardado", ahora);
    b.setAttribute("aria-pressed", ahora);
  });
  actualizarContador(true);
  mostrarAviso(ahora ? `${producto.nombre} guardado para la preventa` : `${producto.nombre} quitado de tu lista`);
  const btnDetalle = $("[data-d-agregar]");
  if (btnDetalle.dataset.id === id) btnDetalle.textContent = ahora ? "Guardado ✦" : "Guardar para la preventa";
}

function actualizarContador(animar) {
  const c = $("[data-contador]");
  c.textContent = guardados.size;
  c.classList.toggle("is-visible", guardados.size > 0);
  if (animar) { c.classList.remove("is-pulso"); void c.offsetWidth; c.classList.add("is-pulso"); }
}

$("[data-abrir-lista]").addEventListener("click", () => {
  if (!guardados.size) { mostrarAviso("Toca el ♡ de una prenda para guardarla"); return; }
  const nombres = PRODUCTOS.filter((p) => guardados.has(p.id)).map((p) => p.nombre);
  mostrarAviso(`Tu lista: ${nombres.join(" · ")}`);
});

/* ─── 4. Ventana de detalle ─────────────────────────────────── */
const detalle = $("[data-detalle]");

function abrirDetalle(id) {
  const p = PRODUCTOS.find((x) => x.id === id);
  if (!p) return;
  $("[data-d-img]").src = p.imagen;
  $("[data-d-img]").alt = p.nombre;
  $("[data-d-linea]").textContent = { bodies: "Línea Bodies", tangas: "Línea Tangas", sets: "Sets y regalo" }[p.linea];
  $("[data-d-nombre]").textContent = p.nombre;
  $("[data-d-desc]").textContent = p.descripcion;
  $("[data-d-detalles]").innerHTML = p.detalles.map((d) => `<li>${d}</li>`).join("");
  $("[data-d-tallas]").innerHTML = p.tallas.map((t) => `<button class="talla" type="button">${t}</button>`).join("");
  const btn = $("[data-d-agregar]");
  btn.dataset.id = p.id;
  btn.textContent = guardados.has(p.id) ? "Guardado ✦" : "Guardar para la preventa";

  detalle.classList.add("is-abierto");
  detalle.setAttribute("aria-hidden", "false");
  document.body.classList.add("sin-scroll");
  setTimeout(() => $(".detalle__cerrar").focus(), 100);
}

function cerrarDetalle() {
  detalle.classList.remove("is-abierto");
  detalle.setAttribute("aria-hidden", "true");
  document.body.classList.remove("sin-scroll");
}

$$("[data-cerrar]", detalle).forEach((el) => el.addEventListener("click", cerrarDetalle));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrarDetalle(); });
$("[data-d-tallas]").addEventListener("click", (e) => {
  const t = e.target.closest(".talla");
  if (!t) return;
  $$(".talla", detalle).forEach((x) => x.classList.toggle("is-activa", x === t));
});
$("[data-d-agregar]").addEventListener("click", (e) => alternarGuardado(e.currentTarget.dataset.id));

/* ─── 5. Aviso pequeño (toast) ──────────────────────────────── */
let temporizadorAviso;
function mostrarAviso(texto) {
  const aviso = $("[data-aviso]");
  aviso.textContent = texto;
  aviso.classList.add("is-visible");
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => aviso.classList.remove("is-visible"), 2800);
}

/* ─── 6. Aparición al hacer scroll ────────────────────────────
   IntersectionObserver "avisa" cuando un elemento entra en la
   pantalla; en ese momento le ponemos la clase .is-visible.    */
function iniciarApariciones() {
  const elementos = $$("[data-anim], [data-revelar]");

  // Retraso escalonado para elementos hermanos (efecto cascada)
  elementos.forEach((el) => {
    const hermanos = [...el.parentElement.children].filter((h) => h.dataset.anim === "subir");
    const i = hermanos.indexOf(el);
    if (i > 0) el.style.setProperty("--retraso", `${i * 0.12}s`);
  });

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("is-visible");
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

  elementos.forEach((el) => observador.observe(el));
}

/* ─── 7. Manifiesto palabra por palabra ───────────────────────
   Parte el texto en palabras y las "enciende" según avanzas. */
function iniciarManifiesto() {
  const texto = $("[data-palabras]");
  // Envolver cada palabra en <span class="palabra">, respetando las <em>
  const envolver = (nodo) => {
    [...nodo.childNodes].forEach((hijo) => {
      if (hijo.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        hijo.textContent.split(/(\s+)/).forEach((trozo) => {
          if (!trozo.trim()) { frag.append(trozo); return; }
          const span = document.createElement("span");
          span.className = "palabra";
          span.textContent = trozo;
          frag.append(span);
        });
        hijo.replaceWith(frag);
      } else envolver(hijo);
    });
  };
  envolver(texto);
  const palabras = $$(".palabra", texto);

  return () => {
    const caja = texto.getBoundingClientRect();
    const vh = window.innerHeight;
    // 0 cuando el texto entra por abajo, 1 cuando llega al tercio superior
    const progreso = Math.min(1, Math.max(0, (vh * 0.85 - caja.top) / (caja.height + vh * 0.35)));
    const encendidas = Math.round(progreso * palabras.length);
    palabras.forEach((p, i) => p.classList.toggle("is-on", i < encendidas));
  };
}

/* ─── 8. Parallax suave en imágenes ─────────────────────────── */
function iniciarParallax() {
  const elementos = $$("[data-parallax]");
  return () => {
    const vh = window.innerHeight;
    elementos.forEach((el) => {
      const caja = el.getBoundingClientRect();
      if (caja.bottom < 0 || caja.top > vh) return;
      const centro = caja.top + caja.height / 2 - vh / 2;
      const img = $("img", el) || el;
      img.style.translate = `0 ${(-centro * parseFloat(el.dataset.parallax)).toFixed(1)}px`;
    });
  };
}

/* ─── 9. "Un día en la vida": scroll vertical → movimiento horizontal ── */
function iniciarHorizontal() {
  const seccion = $("[data-horizontal]");
  const pista = $("[data-pista]");
  const barra = $("[data-progreso]");

  const medir = () => {
    if (!esEscritorio()) { seccion.style.height = ""; return; }
    const recorrido = pista.scrollWidth - window.innerWidth;
    seccion.style.height = `${window.innerHeight + recorrido}px`;
  };
  medir();
  window.addEventListener("resize", medir);

  return () => {
    if (!esEscritorio()) return;
    const caja = seccion.getBoundingClientRect();
    const total = seccion.offsetHeight - window.innerHeight;
    const progreso = Math.min(1, Math.max(0, -caja.top / total));
    pista.style.transform = `translateX(${-progreso * (pista.scrollWidth - window.innerWidth)}px)`;
    barra.style.transform = `scaleX(${progreso})`;
  };
}

/* ─── 10. Cursor personalizado y botones "magnéticos" ────────── */
function iniciarCursor() {
  if (window.matchMedia("(pointer: coarse)").matches || menosMovimiento) return;
  const cursor = $(".cursor");
  let x = 0, y = 0, cx = 0, cy = 0;

  window.addEventListener("mousemove", (e) => {
    x = e.clientX; y = e.clientY;
    cursor.classList.add("is-activo");
    const sobre = e.target.closest(".producto, .linea-card__img");
    cursor.classList.toggle("is-grande", !!sobre && !e.target.closest("[data-guardar]"));
  });
  document.addEventListener("mouseleave", () => cursor.classList.remove("is-activo"));

  // El círculo "persigue" al mouse con suavidad (interpolación)
  const seguir = () => {
    cx += (x - cx) * 0.18; cy += (y - cy) * 0.18;
    cursor.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(seguir);
  };
  seguir();

  $$("[data-magnetico]").forEach((b) => {
    b.addEventListener("mousemove", (e) => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
    });
    b.addEventListener("mouseleave", () => (b.style.transform = ""));
  });
}

/* ─── 11. Formulario del círculo fundador ─────────────────────
   Por ahora solo valida y agradece. Para guardar correos de
   verdad, conecta un servicio (Mailchimp, Brevo, Formspree).   */
function iniciarFormulario() {
  const form = $("[data-formulario]");
  const msg = $("[data-mensaje]");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const correo = form.correo.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      msg.textContent = "Revisa tu correo, parece incompleto.";
      form.correo.focus();
      return;
    }
    msg.textContent = "Gracias. Ya eres parte del círculo fundador ✦";
    form.reset();
  });
}

/* ─── 12. Un solo ciclo de animación para todo lo que depende del scroll ── */
function iniciarScroll(funciones) {
  let pendiente = false;
  const actualizar = () => { funciones.forEach((f) => f()); pendiente = false; };
  const pedir = () => { if (!pendiente) { pendiente = true; requestAnimationFrame(actualizar); } };
  window.addEventListener("scroll", pedir, { passive: true });
  window.addEventListener("resize", pedir);
  actualizar();
}

/* ─── Arranque ─────────────────────────────────────────────── */
$("[data-anio]").textContent = new Date().getFullYear();
iniciarEntrada();
iniciarNavegacion();
iniciarCatalogo();
iniciarApariciones();
iniciarFormulario();
iniciarCursor();
iniciarScroll(
  menosMovimiento
    ? [iniciarHorizontal()]
    : [iniciarManifiesto(), iniciarParallax(), iniciarHorizontal()]
);
