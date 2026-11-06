from PIL import Image,ImageDraw,ImageFilter
from pathlib import Path
import random,math,json
random.seed(731)
out=Path('dist/assets/materials');out.mkdir(exist_ok=True)
# Texture colour and physical response maps; sizes in metres documented below.
N=512
for name,base in [('microcement',(176,173,160)),('lava',(62,64,59)),('terrazzo',(213,206,188)),('zellige',(43,79,64)),('rattan',(160,126,76))]:
 im=Image.new('RGB',(N,N));px=im.load()
 for y in range(N):
  for x in range(N):
   n=random.gauss(0,3 if name!='lava' else 11)+3*math.sin(x*.047)*math.cos(y*.03)
   px[x,y]=tuple(max(0,min(255,int(c+n))) for c in base)
 d=ImageDraw.Draw(im)
 if name=='terrazzo':
  for _ in range(1700):
   x,y=random.randrange(N),random.randrange(N);s=random.randrange(1,7);c=random.choice(['#aea58e','#7b7b6e','#e9e3d7','#baaf93','#747469']);d.polygon([(x,y),(x+s,y-2),(x+s+2,y+s),(x-2,y+s+2)],fill=c)
 if name=='zellige':
  for x in range(0,N,64):
   shade=random.choice(['#395744','#30513f','#426049','#284b39']);d.rectangle((x+2,2,x+62,N-3),fill=shade)
   d.line((x+3,4,x+3,N-5),fill='#6b8061',width=2);d.line((x+62,3,x+62,N-3),fill='#203e2d',width=2)
 if name=='rattan':
  for k in range(0,N,16):
   d.rectangle((k+1,0,k+9,N),fill='#bd9c65');d.line((k+2,0,k+2,N),fill='#d5b77c',width=2)
   for j in range(0,N,16):
    d.rectangle((k,j,k+16,j+6),fill='#9f7a44' if (k//16+j//16)%2 else '#c7a26b');d.line((k,j+1,k+15,j+1),fill='#d3b37a')
 im.save(out/(name+'-color.jpg'),quality=91)
 rough=Image.new('L',(N,N),65 if name=='zellige' else 205 if name in ['lava','rattan'] else 155);rough.save(out/(name+'-roughness.jpg'))
 # Height-derived tangent normal map, wrapped at boundaries.
 h=im.convert('L').filter(ImageFilter.GaussianBlur(.7));hp=h.load();normal=Image.new('RGB',(N,N));p=normal.load();strength=.6 if name=='zellige' else .16
 for y in range(N):
  for x in range(N):
   dx=(hp[(x+1)%N,y]-hp[(x-1)%N,y])*strength;dy=(hp[x,(y+1)%N]-hp[x,(y-1)%N])*strength
   p[x,y]=(int(max(0,min(255,128-dx))),int(max(0,min(255,128-dy))),254)
 normal.save(out/(name+'-normal.jpg'),quality=92)
# Original catalogue art, retained without redesign.
Path('dist/assets/modern-tropical-moodboard.jpg').write_bytes(Path('dist/assets/catalogue-modern-tropical.jpg').read_bytes())
p=Path('dist/index.html');s=p.read_text().replace('Honey teak. Honed stone. Woven fibers. A softer kind of luxury.','Microcement, natural teak, lava stone, green zellige, light terrazzo and rattan.').replace('Atmosphere concept · AI-generated moodboard. Explore the 3D model for the source-specific layout.','Original catalogue artwork · To Breathe, Shelter of Sky · page 11.').replace('Timber / stone / linen / leaf','Teak / concrete / zellige / rattan').replace('Original SketchUp architecture & furnishings.<br>Modern tropical material and landscape study.','Original SketchUp architecture & furnishings.<br>Catalogue p. 11 interiors · p. 6 exterior.').replace('<div class="board-bottom">','<div class="board-bottom"><button id="board-interior">Interior · p. 11</button><button id="board-exterior">Exterior · p. 6</button>');p.write_text(s)
