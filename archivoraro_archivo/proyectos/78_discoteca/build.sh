#!/bin/bash
# reconstruye el decorado: Blender → GLB → glb_disco.js
cd "$(dirname "$0")"; (cd blender && python3 disco.py 2>&1 | grep -E "EXPORT_OK|Error|Traceback|line " ) && python3 - <<'P'
import base64
b=base64.b64encode(open('blender/disco.glb','rb').read()).decode(); lay=open('blender/layout.json').read()
open('glb_disco.js','w').write('window.GLB_DISCO="'+b+'";\nwindow.LAYOUT='+lay+';\n'); print(len(b)//1024,'KB')
P
