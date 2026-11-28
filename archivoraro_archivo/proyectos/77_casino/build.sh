#!/bin/bash
# reconstruye el decorado: Blender → GLB → glb_casino.js
cd "$(dirname "$0")"; (cd blender && python3 casino.py 2>&1 | grep -E "EXPORT_OK|Error|Traceback|line " ) && python3 - <<'P'
import base64
b=base64.b64encode(open('blender/casino.glb','rb').read()).decode(); lay=open('blender/layout.json').read()
open('glb_casino.js','w').write('window.GLB_CASINO="'+b+'";\nwindow.LAYOUT='+lay+';\n'); print(len(b)//1024,'KB')
P
