import json,copy
from pathlib import Path
p=Path('dist/assets');g=json.loads((p/'villa.gltf').read_text())
# Animated leaves and their attached hardware; surrounding tracks and stoppers stay static.
def meta(id,label,type='swing',travel=None):return {'doorId':id,'doorLabel':label,'doorType':type,'doorTravel':travel or [0,0,0]}
assemblies=[([8],meta('social-front','Living terrace door')),([24],meta('social-rear','Living rear door','slide',[1.35,0,0])),([920],meta('east-bedroom','East terrace door')),([1282],meta('west-bedroom','West terrace door')),
([778,780,806,827],meta('east-entry','East bedroom entry','slide',[0,0,.97])),([861,863,889,910],meta('east-private','East dressing door','slide',[-1.02,0,0])),
([1140,1142,1168,1189],meta('west-entry','West bedroom entry','slide',[0,0,.97])),([1223,1225,1251,1272],meta('west-private','West dressing door','slide',[1.02,0,0]))]
doors={i:data for nodes,data in assemblies for i in nodes}
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
 if i in doors:n['extras']=doors[i]
(p/'doors-source.gltf').write_text(json.dumps(d,separators=(',',':')))
Path('docs/source-edit-manifest.json').write_text(json.dumps({'interactiveDoors':[{'sourceNodes':nodes,**data} for nodes,data in assemblies],'doorCount':len(assemblies),'fixedTracksPreserved':True,'replacedFurnitureSourceNodes':sorted(replaced),'poolBoundsMetres':{'min':[-2.5376567,-.17,4.4],'max':[3.1623434,-.1,6.1]},'sourceOffset':[53.4933507,0,-15.9854055]},indent=2))
