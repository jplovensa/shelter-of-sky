from pathlib import Path
from pypdf import PdfReader
from PIL import Image,ImageFilter
import json
src=Path('/Users/jplovensa/Downloads/Library Archive/02 FJALL/Presentations and Catalogues/To Breathe_FG Signature Catalogue.pdf');r=PdfReader(src);out=Path('dist/assets/schemes');out.mkdir(exist_ok=True)
sets={'mediterranean':(8,{'wall':7,'stone':8,'oak':9,'cane':10,'concrete':11,'linen':12,'bronze':13,'walnut':14}),'scandi':(10,{'wall':9,'concrete':10,'stone':11,'oak':12,'cane':13,'linen':14,'black':15,'glass':16,'brass':17})}
manifest={}
for scheme,(page,mapping) in sets.items():
 folder=out/scheme;folder.mkdir(exist_ok=True);images=list(r.pages[page-1].images);manifest[scheme]={'page':page,'source':src.name,'maps':{}}
 for name,index in mapping.items():
  im=images[index].image.convert('RGB');w,h=im.size;im=im.crop((int(w*.18),int(h*.14),int(w*.84),int(h*.86)))
  im.save(folder/(name+'-color.jpg'),quality=97)
  # Reference-derived surface variation; fine physical detail is layered in Three.js.
  lum=im.convert('L').resize((512,512),Image.Resampling.BICUBIC).filter(ImageFilter.GaussianBlur(1));px=lum.load();normal=Image.new('RGB',lum.size);n=normal.load();strength=.12 if name in ['linen','wall'] else .28
  for y in range(512):
   for x in range(512):
    dx=(px[(x+1)%512,y]-px[(x-1)%512,y])*strength;dy=(px[x,(y+1)%512]-px[x,(y-1)%512])*strength;n[x,y]=(int(max(0,min(255,128-dx))),int(max(0,min(255,128-dy))),254)
  normal.save(folder/(name+'-normal.jpg'),quality=93)
  manifest[scheme]['maps'][name]={'embeddedImage':images[index].name,'pixels':im.size,'diffuse':'Original embedded catalogue swatch, edge crop only','normal':'Reference-derived approximation'}
im=list(r.pages[7].images)[5].image.convert('RGB').crop((27,490,168,645));im.save(out/'mediterranean/marble-color.jpg',quality=97);Image.new('RGB',(256,256),(128,128,255)).save(out/'mediterranean/marble-normal.jpg',quality=95);manifest['mediterranean']['maps']['marble']={'embeddedImage':'X15.png','crop':[27,490,168,645],'diffuse':'Original catalogue kitchen island face crop','normal':'Flat honed stone response'}
(out/'provenance.json').write_text(json.dumps(manifest,indent=2))
