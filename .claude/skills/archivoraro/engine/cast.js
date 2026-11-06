// Archivo Raro · reparto reutilizable. Cada ficha es un preset para person()/A().
// Uso en un vídeo:  A({...CAST_BY_ID.C07.o, x:540, y:1010, s:.6})   (si kid:true, usar person() en vez de A())
const CAST=[
  // ---------- hombres adultos ----------
  {id:'C01',name:'El ejecutivo',traits:'Traje y corbata · raya al lado · gafas cuadradas',o:{skin:'#f1c6a4',hs:'sidepart',hair:'#2a2420',top:'#e9eef2',topD:'#c9d2da',jacket:'#2a3550',pants:'#2a3550',shoes:'#15161f',tie:'#c23a3a',glasses:'square',mouth:'smile'}},
  {id:'C02',name:'El abuelo',traits:'Calvo · bigote blanco · arrugas · chaleco · bastón',o:{skin:'#e6b896',hs:'bald',hair:'#d9d6cf',mustache:'#ecebe6',wrinkles:true,top:'#d9cdb8',topD:'#b8ab94',vest:'#6a5a44',pants:'#5a5048',shoes:'#3a2e28',cane:true,caneCol:'#7a5230',brows:'up',mouth:'smile'}},
  {id:'C03',name:'El mecánico',traits:'Corpulento · gorra · barba de 3 días · peto',o:{skin:'#c98c64',hs:'buzz',hair:'#2a2020',stubble:true,build:'heavy',hat:'cap',hatCol:'#c23a3a',top:'#e9e4d8',topD:'#c9c2b0',overalls:'#3f6fb5',shortSleeves:true,shoes:'#3a2e28'}},
  {id:'C04',name:'El rapero',traits:'Gorro de lana · sudadera · pendientes',o:{skin:'#8a5a3e',hs:'buzz',hair:'#15100e',hat:'beanie',hatCol:'#2a2e36',top:'#ffd34a',topD:'#d9a82a',hood:true,strings:true,earrings:'#f1c84b',pants:'#2a2e38',shoes:'#f3f3f0',mouth:'smile'}},
  {id:'C05',name:'El punk',traits:'Cresta verde · cicatriz · chaqueta de cuero',o:{skin:'#f1c6a4',hs:'mohawk',hair:'#45e07e',scar:true,top:'#c23a3a',topD:'#9a2a2a',jacket:'#1d1d22',pants:'#2a2e38',shoes:'#15161f',earrings:'#c9d2dc',brows:'angry'}},
  {id:'C06',name:'El policía',traits:'Uniforme · gorra de policía · placa',o:{skin:'#e0a77e',hs:'short',hair:'#2a2420',hat:'police',top:'#3a5a8a',topD:'#2a4270',badge:true,tie:'#15161f',pants:'#1f2d4a',shoes:'#15161f'}},
  {id:'C07',name:'El médico',traits:'Bata blanca · gafas redondas · canoso',o:{skin:'#f1c6a4',hs:'short',hair:'#b9b4ac',labcoat:true,top:'#6cc6ff',topD:'#4aa4dd',glasses:'round',pants:'#3a3e4a',shoes:'#2a2e38',stubble:true}},
  {id:'C08',name:'El profesor',traits:'Barba gris · gafas · chaqueta de pana',o:{skin:'#e6b896',hs:'sidepart',hair:'#8a847c',beard:'#9a948c',glasses:'round',top:'#e9e4d8',topD:'#c9c2b0',jacket:'#7a5a3a',pants:'#4a4038',shoes:'#3a2e28',tie:'#2f6a4a'}},
  {id:'C09',name:'El atleta',traits:'Delgado · pelo de punta · tirantes',o:{skin:'#b9805a',hs:'spiky',hair:'#2a1a12',build:'slim',top:'#45e07e',topD:'#2fb05e',shortSleeves:true,pants:'#2a2e38',shoes:'#ff3e6c',mouth:'smile'}},
  {id:'C10',name:'El desconocido',traits:'Abrigo largo · sombrero · cicatriz',o:{skin:'#d9b89a',hs:'short',hair:'#15100e',hat:'fedora',hatCol:'#2a2a30',coat:'#2a2a30',top:'#5a5a60',topD:'#3a3a40',scar:true,pants:'#1d1d22',shoes:'#15161f',stubble:true,brows:'angry'}},
  {id:'C11',name:'El vagabundo',traits:'Capucha · barba larga · abrigo raído',o:{skin:'#c99a78',hs:'messy',hair:'#5a4a3a',beard:'#6a5a4a',coat:'#5a5040',hoodUp:true,top:'#4a4a3a',topD:'#3a3a2e',pants:'#3a3a30',shoes:'#2a2620',brows:'worried'}},
  {id:'C12',name:'El influencer',traits:'Tupé rubio · chaqueta llamativa · pendientes',o:{skin:'#f1c6a4',hs:'quiff',hair:'#d9a050',jacket:'#ff3e6c',top:'#f3f3f0',topD:'#d9d9d4',earrings:'#c9d2dc',pants:'#e9e4d8',shoes:'#f3f3f0',mouth:'smile'}},
  // ---------- mujeres adultas ----------
  {id:'C13',name:'La periodista',traits:'Media melena · bufanda · americana',o:{fem:true,skin:'#f1c6a4',hs:'bob',hair:'#6a3a24',scarf:'#ff3e6c',top:'#e9eef2',topD:'#c9d2da',jacket:'#3a5a7a',lashes:true,lip:'#c2405a',pants:'#2a2e38',shoes:'#15161f',earrings:'#f1c84b'}},
  {id:'C14',name:'La científica',traits:'Coleta · bata · gafas cuadradas',o:{fem:true,skin:'#e9b48e',hs:'ponytail',hair:'#2a2420',labcoat:true,top:'#8a6aa8',topD:'#6a4a88',glasses:'square',lashes:true,pants:'#2a2e38',shoes:'#3a332c'}},
  {id:'C15',name:'La abuela',traits:'Moño canoso · gafas redondas · rebeca',o:{fem:true,skin:'#e6b896',hs:'bun',hair:'#d9d6cf',wrinkles:true,glasses:'round',top:'#c9a0b8',topD:'#a8809a',jacket:'#6a4a5a',skirt:'#4a3a44',lashes:true,shoes:'#3a2e28',mouth:'smile'}},
  {id:'C16',name:'La rockera',traits:'Melena ondulada roja · cuero · pendientes',o:{fem:true,skin:'#f6cfae',hs:'wavy',hair:'#c23a2a',jacket:'#1d1d22',top:'#2a2e36',topD:'#15161f',earrings:'#c9d2dc',lashes:true,lip:'#7a1a2a',pants:'#15161f',shoes:'#15161f',brows:'angry'}},
  {id:'C17',name:'La agente',traits:'Trenzas · uniforme · placa',o:{fem:true,skin:'#8a5a3e',hs:'braids',hair:'#15100e',top:'#3a5a8a',topD:'#2a4270',badge:true,lashes:true,pants:'#1f2d4a',shoes:'#15161f'}},
  {id:'C18',name:'La corredora',traits:'Coleta rubia · pecas · camiseta deportiva',o:{fem:true,skin:'#f6cfae',hs:'ponytail',hair:'#d9a050',freckles:true,top:'#6cc6ff',topD:'#4aa4dd',shortSleeves:true,build:'slim',lashes:true,pants:'#2a2e38',shoes:'#f3f3f0',mouth:'smile'}},
  {id:'C19',name:'La vecina',traits:'Rizos · vestido · pintalabios',o:{fem:true,skin:'#c98c64',hs:'curly',hair:'#2a1a12',dress:true,top:'#e8c547',topD:'#c9a82a',lashes:true,lip:'#c2405a',shoes:'#c23a3a',mouth:'smile'}},
  {id:'C20',name:'La jefa',traits:'Afro · traje rojo · pendientes dorados',o:{fem:true,skin:'#6a4030',hs:'afro',hair:'#15100e',jacket:'#c23a3a',top:'#f3f3f0',topD:'#d9d9d4',earrings:'#f1c84b',lashes:true,lip:'#7a1a2a',pants:'#2a2e38',shoes:'#15161f'}},
  {id:'C21',name:'La enfermera',traits:'Moño · uniforme verde · mascarilla',o:{fem:true,skin:'#f1c6a4',hs:'bun',hair:'#6a3a24',top:'#3aa89a',topD:'#2a887a',mask:true,lashes:true,pants:'#3aa89a',shoes:'#f3f3f0'}},
  // ---------- adolescentes y niños ----------
  {id:'C22',name:'El gamer',traits:'Adolescente · sudadera · gafas',o:{skin:'#f1c6a4',hs:'messy',hair:'#3a2a20',hood:true,strings:true,top:'#6a4a9a',topD:'#4a2a7a',glasses:'square',pants:'#2a2e38',shoes:'#f3f3f0',build:'slim'}},
  {id:'C23',name:'La skater',traits:'Adolescente · gorro rosa · pecas',o:{fem:true,skin:'#e9b48e',hs:'bob',hair:'#2a2420',hat:'beanie',hatCol:'#ff3e6c',freckles:true,top:'#2a2e36',topD:'#15161f',pants:'#4a6a8a',shoes:'#f3f3f0',lashes:true,build:'slim',mouth:'smile'}},
  {id:'C24',name:'El niño',traits:'Niño · pelo de punta · mochila',kid:true,o:{skin:'#c98c64',hs:'spiky',hair:'#2a1a12',top:'#ff8a2a',topD:'#d96a10',backpack:'#3f6fb5',pants:'#3a5a8a',shoes:'#c23a3a',mouth:'smile'}},
  {id:'C25',name:'La niña',traits:'Niña · coletas · vestido · pecas',kid:true,o:{fem:true,skin:'#f6cfae',hs:'pigtails',hair:'#d9a050',dress:true,top:'#ff6fa0',topD:'#d94a7a',freckles:true,lashes:true,shoes:'#c23a3a',mouth:'smile'}},
  // ---------- villanos ----------
  {id:'C26',name:'El encapuchado',traits:'Capucha · mascarilla · nunca habla',o:{skin:'#d9c9b8',hs:'short',hair:'#15100e',hoodUp:true,mask:true,top:'#1d1d22',topD:'#0c0c10',pants:'#15161f',shoes:'#0c0c10',brows:'angry'}},
  {id:'C27',name:'El grandullón',traits:'Corpulento · rapado · cicatriz · tirantes',o:{skin:'#e0a77e',hs:'buzz',hair:'#3a2a20',build:'heavy',stubble:true,top:'#e9e4d8',topD:'#c9c2b0',shortSleeves:true,pants:'#3a3e4a',shoes:'#2a2620',scar:true,brows:'angry'}},
];
const CAST_BY_ID=Object.fromEntries(CAST.map(c=>[c.id,c]));
