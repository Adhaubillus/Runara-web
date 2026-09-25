/* ──────────────────────────────────────────────────────────────
   CATÁLOGO DE PRODUCTOS
   Este es el único archivo que necesitas tocar para cambiar,
   agregar o quitar productos. Cada producto es un "objeto" { }
   dentro de la lista [ ]. Copia uno, pégalo y cambia los datos.

   Campos:
     id        → identificador único, sin espacios ni tildes
     nombre    → nombre visible
     linea     → "bodies" | "tangas" | "sets"  (se usa en los filtros)
     etiqueta  → texto pequeño sobre la foto (opcional, "" para ninguno)
     imagen    → ruta de la foto dentro de assets/img/
     resumen   → una línea bajo el nombre
     descripcion, detalles, tallas → se ven en la ventana de detalle

   ⚠ Los nombres son PROVISIONALES: cámbialos por los definitivos.
   ────────────────────────────────────────────────────────────── */

const PRODUCTOS = [
  {
    id: "body-encaje-nocturno",
    nombre: "Body Encaje Nocturno",
    linea: "bodies",
    etiqueta: "Favorito",
    imagen: "assets/img/prod-body-encaje.jpg",
    resumen: "Encaje floral y tul, escote en V",
    descripcion:
      "Un body que se adapta a tu cuerpo como una segunda piel. Encaje floral en el busto, panel de tul translúcido y cuerpo en tejido suave que abraza sin comprimir.",
    detalles: ["Tirantes ajustables", "Cierre de broches en la entrepierna", "Del día a la noche"],
    tallas: ["XS", "S", "M", "L", "XL", "2XL"],
  },
  {
    id: "body-corse-velvet",
    nombre: "Body Corsé Velvet",
    linea: "bodies",
    etiqueta: "Nuevo",
    imagen: "assets/img/prod-body-corse.jpg",
    resumen: "Estructura de corsé con encaje",
    descripcion:
      "Inspirado en la corsetería clásica, con varillas suaves y encaje geométrico. Realza tu silueta y te acompaña con seguridad en cualquier ocasión.",
    detalles: ["Copas con encaje", "Varillas suaves", "Símbolo Runara bordado"],
    tallas: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "tanga-tucking-burdeos",
    nombre: "Tanga Esencial Tucking",
    linea: "tangas",
    etiqueta: "Apta para tucking",
    imagen: "assets/img/prod-tanga-burdeos.jpg",
    resumen: "Burdeos · sujeción segura",
    descripcion:
      "Pensada para tucking cómodo y discreto, con la estética de una pieza de lencería. Material firme pero suave y costuras planas que no marcan.",
    detalles: ["Ajuste seguro y confortable", "Costuras planas e invisibles", "Uso diario"],
    tallas: ["XS", "S", "M", "L", "XL", "2XL"],
  },
  {
    id: "tanga-segunda-piel",
    nombre: "Tanga Segunda Piel",
    linea: "tangas",
    etiqueta: "Apta para tucking",
    imagen: "assets/img/prod-tanga-nude.jpg",
    resumen: "Tono piel · invisible bajo la ropa",
    descripcion:
      "Nuestra versión más discreta: tono piel, tiro alto y sujeción firme para sentirte libre y segura bajo cualquier prenda.",
    detalles: ["Tiro alto", "Invisible bajo la ropa", "Materiales firmes pero cómodos"],
    tallas: ["XS", "S", "M", "L", "XL", "2XL"],
  },
  {
    id: "set-triangulo-encaje",
    nombre: "Set Triángulo Encaje",
    linea: "sets",
    etiqueta: "",
    imagen: "assets/img/prod-set-triangulo.jpg",
    resumen: "Bralette de encaje + tanga",
    descripcion:
      "Bralette triangular de encaje sin varillas y tanga a juego. Ligero, sensual y cómodo para llevar todo el día.",
    detalles: ["Sin varillas", "Encaje suave", "Incluye bolsa de algodón Runara"],
    tallas: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "caja-regalo",
    nombre: "Experiencia Regalo",
    linea: "sets",
    etiqueta: "Edición especial",
    imagen: "assets/img/prod-caja-regalo.jpg",
    resumen: "Caja, bolsa y tarjeta Runara",
    descripcion:
      "Elige tu pieza y la entregamos en nuestra caja burdeos con papel de seda, tarjeta escrita a mano y bolsa de algodón.",
    detalles: ["Caja rígida burdeos", "Tarjeta personalizada", "Bolsa de algodón reutilizable"],
    tallas: ["Única"],
  },
];
