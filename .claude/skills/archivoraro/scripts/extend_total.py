# Add a silent hold at the end of the video (the last scene keeps playing, no voice) so it reaches a target length.
# usage: python3 -I extend_total.py <project_dir> <target_seconds>     e.g. 62 to pass YouTube's 1-minute mark
import json, re, sys, os
P, target = sys.argv[1], float(sys.argv[2])
p = os.path.join(P, 'voice.js'); s = open(p, encoding='utf-8').read()
cur = float(re.search(r'"total": ([0-9.]+)', s).group(1))
if target <= cur: print('already', cur, 's — nothing to do'); sys.exit()
s = re.sub(r'"total": [0-9.]+', '"total": %.2f' % target, s, count=1)
open(p, 'w', encoding='utf-8').write(s)
print('total', cur, '->', target)
