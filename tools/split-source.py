import json,copy
from pathlib import Path
p=Path('dist/assets');g=json.loads((p/'villa.gltf').read_text())
doors={8:'social-front',24:'social-rear',920:'east-bedroom',1282:'west-bedroom'}
replaced={26,39,530,541,558,569}
def descendants(i):
 r={i}
 for c in g['nodes'][i].get('children',[]):r|=descendants(c)
 return r
removed=set(doors)|replaced
shell=copy.deepcopy(g)
for n in shell['nodes']:
 if 'children'in n:n['children']=[i for i in n['children'] if i not in removed]
(p/'shell-source.gltf').write_text(json.dumps(shell,separators=(',',':')))
selected=set()
for i in doors:selected|=descendants(i)
def ancestors(i):
 if i in selected:return True
 found=False
 for c in g['nodes'][i].get('children',[]):found=ancestors(c) or found
 if found:selected.add(i)
 return found
ancestors(0)
d=copy.deepcopy(g)
for i,n in enumerate(d['nodes']):
 if 'children'in n:n['children']=[c for c in n['children'] if c in selected]
 if i in doors:n['extras']={'doorId':doors[i],'doorType':'slide' if i==24 else 'swing'}
(p/'doors-source.gltf').write_text(json.dumps(d,separators=(',',':')))
Path('docs/source-edit-manifest.json').write_text(json.dumps({'interactiveDoorSourceNodes':doors,'replacedFurnitureSourceNodes':sorted(replaced),'poolBoundsMetres':{'min':[-2.5376567,-.17,4.4],'max':[3.1623434,-.1,6.1]},'sourceOffset':[53.4933507,0,-15.9854055]},indent=2))
