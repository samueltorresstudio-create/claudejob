#!/bin/bash
# reconstruye el decorado: Blender → GLB → glb_platano.js
cd "$(dirname "$0")"; (cd blender && python3 platano.py 2>&1 | grep -E "EXPORT_OK|Error|Traceback|line " ) && python3 - <<'P'
import base64
b=base64.b64encode(open('blender/platano.glb','rb').read()).decode(); lay=open('blender/layout.json').read()
open('glb_platano.js','w').write('window.GLB_PLATANO="'+b+'";\nwindow.LAYOUT='+lay+';\n'); print(len(b)//1024,'KB')
P
