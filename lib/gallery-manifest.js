(function () {
  "use strict";

  /* Static hosting (no build step, no server) can't list a folder's
     contents at runtime — a browser has no filesystem access and this
     site has no backend to ask. This manifest is the practical
     equivalent: one array per service, generated from what's actually
     in images/servicios/{slug}/ at the time it was written. Adding or
     removing photos means updating the matching array here (filenames
     only — no other code changes, no reprocessing of the images
     themselves). Order follows the array; a file prefixed "antes-" or
     "despues-" gets the corresponding chip in the carousel. */
  window.__GALLERY__ = {
    laser: {
      caption: "Nuestro equipo de última generación",
      folder: "images/servicios/laser/",
      files: ["01.png", "02.png"]
    },
    pestanas: {
      caption: "Resultados reales de clientas — sin retoque",
      folder: "images/servicios/pestanas/",
      files: ["01.png", "02.png", "03.png", "04.png", "05.png", "06.png", "07.png", "08.png"]
    }
  };
})();
