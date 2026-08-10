(function () {
  "use strict";

  var WHATSAPP_NUMBER = "34611474447";
  var WHATSAPP_MESSAGE = "Hola, quiero reservar una cita en Nuovolaser.";
  var WHATSAPP_URL =
    "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(WHATSAPP_MESSAGE);

  window.__BRAND__ = {
    name: "Nuovolaser",
    tagline: "Centro Estético · Láser Avanzado",
    phoneDisplay: "611 47 44 47",
    phoneHref: "tel:+34611474447",
    whatsappUrl: WHATSAPP_URL,
    address: {
      line1: "Calle la Alameda 1",
      line2: "28922 Alcorcón, Madrid"
    },
    hours: [
      { days: "Lunes — Viernes", time: "10:00 — 20:00" },
      { days: "Sábado", time: "10:00 — 14:00" },
      { days: "Domingo", time: "Cerrado" }
    ],

    services: [
      {
        id: "laser",
        name: "Depilación Láser",
        desc: "Diodo de última generación para una piel lisa y uniforme, sesión tras sesión.",
        img: "assets/img/tratamiento-laser.webp"
      },
      {
        id: "pestanas",
        name: "Lifting de Pestañas",
        desc: "Curvatura natural y mirada despierta, sin necesidad de extensiones.",
        img: "assets/img/tratamiento-cejas.webp"
      },
      {
        id: "manicura",
        name: "Manicura",
        desc: "Manicura de precisión con acabado impecable y duradero.",
        img: "assets/img/tratamiento-manicura.webp"
      },
      {
        id: "pedicura",
        name: "Pedicura",
        desc: "Cuidado completo del pie, técnica minuciosa y resultado profesional.",
        img: "assets/img/interior-manicura-mesa.webp"
      },
      {
        id: "masaje",
        name: "Masajes",
        desc: "Tratamientos corporales pensados para liberar tensión y devolver el equilibrio.",
        img: "assets/img/tratamiento-masaje.webp"
      },
      {
        id: "cejas",
        name: "Cejas",
        desc: "Diseño y depilación de cejas a medida de cada rostro.",
        img: "assets/img/tratamiento-cejas.webp"
      }
    ],

    whyUs: [
      { title: "Tecnología avanzada", desc: "Equipos de última generación, calibrados para cada tipo de piel." },
      { title: "Resultados visibles", desc: "Cambios apreciables desde las primeras sesiones de tratamiento." },
      { title: "Trato personalizado", desc: "Cada plan se adapta a las necesidades reales de cada persona." },
      { title: "Máxima higiene", desc: "Protocolos estrictos de limpieza y esterilización en cada cabina." },
      { title: "Experiencia profesional", desc: "Un equipo formado y con años de trayectoria en estética avanzada." }
    ],

    gallery: [
      { img: "assets/img/galeria-cabina.webp", alt: "Cabina de tratamiento láser en Nuovolaser" },
      { img: "assets/img/interior-recepcion.webp", alt: "Recepción de Nuovolaser en Alcorcón" },
      { img: "assets/img/galeria-manicura.webp", alt: "Zona de manicura de Nuovolaser" },
      { img: "assets/img/interior-logo-pared.webp", alt: "Rótulo Nuovolaser en la pared del centro" },
      { img: "assets/img/galeria-recepcion.webp", alt: "Zona de espera de Nuovolaser" },
      { img: "assets/img/galeria-mostrador.webp", alt: "Mostrador de recepción de Nuovolaser" }
    ],

    reviews: [
      { text: "Llevo varios años viniendo aquí, los servicios son excelentes y el trato es espectacular.", stars: 5 },
      { text: "El resultado fue visible desde la primera sesión.", stars: 5 },
      { text: "Encantadísima con el lifting de pestañas.", stars: 5 },
      { text: "La atención es excelente y muy profesional.", stars: 5 },
      { text: "Llevo años viniendo y siempre salgo encantada.", stars: 5 }
    ]
  };
})();
