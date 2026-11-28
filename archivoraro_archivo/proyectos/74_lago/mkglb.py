import base64, json, sys
b = base64.b64encode(open('blender/lago.glb','rb').read()).decode()
lay = open('blender/layout.json').read()
open('glb_lago.js','w').write('window.GLB_LAGO="' + b + '";\nwindow.LAYOUT=' + lay + ';\n')
