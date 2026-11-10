function schoolDay(t){ // the street outside the gate in the morning
  let s=skyDay()+puffs(t,160,'#fff',.9,6,4)+`<rect x="-600" y="560" width="2280" height="340" fill="#b8b0a2"/>`;
  s+=block(-300,560,380,'#d9a988',{bottom:520})+block(860,520,420,'#a9c0d0',{bottom:520});
  s+=`<rect x="-600" y="860" width="2280" height="40" fill="#9a958c"/>`+streetLamp(940,880,0);
  s+=`<rect x="-600" y="900" width="2280" height="700" fill="#8a8478"/>`;
  return s}
