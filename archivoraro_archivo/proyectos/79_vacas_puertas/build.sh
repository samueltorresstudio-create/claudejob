#!/bin/bash
cd "$(dirname "$0")"; (cd blender && python3 sets79.py 2>&1 | grep -E "EXPORT_OK|Error|Traceback|line " ) && python3 - <<'P'
import base64
b=base64.b64encode(open('blender/sets79.glb','rb').read()).decode(); lay=open('blender/layout.json').read()
open('glb79.js','w').write('window.GLB79="'+b+'";\nwindow.LAYOUT='+lay+';\n'); print(len(b)//1024,'KB')
P
