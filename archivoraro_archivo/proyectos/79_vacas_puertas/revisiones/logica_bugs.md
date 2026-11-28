# Revisión de LÓGICA, DATOS y BUGS (subagente Sonnet, 28-11-2026)
Guion (aplicado en v2): 22 litros es POR VACA (pizarra «LITROS POR VACA»); bucle sin repetir «le puso a sus vacas»; invierno (ventanas con nieve, noche; calendario de ENERO; rejilla hasta 31); dos vacas en el plano 12 y «una de ellas» en el 14; crotales sin el 27 por defecto; vecino en el mismo sitio que Izzet (verja del establo); recorte a ~186 palabras; «diez días después».
Datos: Koçak, Aksaray, 180 vacas, 2 vacas ~10 días, 10 gafas más: OK. 22→27 lo dice él (no estudio). Rusia nov. 2019 cerca de Moscú: vacas «más tranquilas», sin datos de leche. Expertos escépticos (Vice). «Estresada suelta menos leche»: OK, sin decir «oxitocina». Licencia visual: en la prueba real el visor puede ser de un solo ojo.
Bugs a arreglar antes de renderizar:
18. Oclusión: el SVG va siempre encima del 3D → nada del decorado delante de personajes (o 2.ª pasada GL encima).
19. Rim invertido al voltear: filtro en <g> exterior y flip en el interior.
20. ids SVG duplicados entre vacas: pasar id único por instancia (también granjero).
21. flipU de UV con x absoluta: usar coordenada relativa al sitio o la normal.
22. planarUV con una caja por material: ventanas/portón/tanque/carteles se estiran → UV por cara según la normal o un material por cartel.
23. Pesebre delante de la pizarra: subir pizarra a y≈2.4 / bajar barra.
24. Fuente Inter: cargar con @font-face (base64) en el render; añadir field/fence/ceilpanel a PAINTED si se usan.
25. Filtros SVG sin región (S1) recortan brillos: x/y -50 % y 200 %; DOF con haces aditivos.
