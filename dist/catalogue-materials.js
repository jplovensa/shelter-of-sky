import * as T from 'three';
export const schemeManifest={
 tropical:{name:'Modern Tropical',page:11,board:'assets/modern-tropical-moodboard.jpg',caption:'Natural teak · microcement · green zellige · teal accents',description:'The original Shelter of Sky Modern Tropical board. Woven rattan, teak and lively tropical accents.'},
 mediterranean:{name:'Mediterranean',page:8,board:'assets/schemes/mediterranean-board.jpg',caption:'Warm ivory · classic stone · walnut · bronze',description:'Original Shelter of Sky Mediterranean board. Soft linen upholstery, classic stone, walnut furniture and warm bronze details.'},
 scandi:{name:'Scandi-Asian',page:10,board:'assets/schemes/scandi-board.jpg',caption:'Natural oak · oatmeal linen · cane · brushed brass',description:'Original Shelter of Sky Scandi-Asian board. Light oak, wishbone chairs, soft neutral seating, paper lanterns and restrained handcrafted details.'}
};
export function createCatalogueMaterials(renderer,onLoad){
 const loader=new T.TextureLoader(),textures=new Map(),templates=new Map(),pending=[];
 function tex(scheme,name,kind='color'){const key=scheme+'/'+name+'-'+kind;if(textures.has(key))return textures.get(key);let resolve;const promise=new Promise(r=>resolve=r);pending.push(promise);const t=loader.load('assets/schemes/'+key+'.jpg',()=>{resolve();onLoad();},undefined,()=>resolve());t.wrapS=t.wrapT=T.MirroredRepeatWrapping;t.anisotropy=Math.min(16,renderer.capabilities.getMaxAnisotropy());const repeat=name==='linen'?5:name==='cane'?4:/oak|walnut/.test(name)?2.5:1;t.repeat.set(repeat,repeat);if(kind==='color')t.colorSpace=T.SRGBColorSpace;textures.set(key,t);return t;}
 function material(scheme,finish){const key=scheme+'/'+finish;if(templates.has(key))return templates.get(key);let m;
  if(finish==='glass'){m=new T.MeshPhysicalMaterial({color:'#e9e5da',transparent:true,opacity:.13,roughness:.13,metalness:.08,normalMap:scheme==='scandi'?tex(scheme,'glass','normal'):null,normalScale:new T.Vector2(.15,.15),depthWrite:false,side:T.DoubleSide});}
  else if(finish==='metal'){const finishName=scheme==='mediterranean'?'bronze':'brass';m=new T.MeshStandardMaterial({map:tex(scheme,finishName),color:'#fff',metalness:.8,roughness:.34,side:T.DoubleSide});}
  else if(finish==='black'){m=new T.MeshStandardMaterial({color:'#2b2c27',metalness:.35,roughness:.65,side:T.DoubleSide});}
  else if(finish==='porcelain'){m=new T.MeshPhysicalMaterial({color:'#f4eee1',roughness:.24,clearcoat:.4});}
  else if(finish==='paper'||finish==='lantern'){m=new T.MeshStandardMaterial({map:tex(scheme,'linen'),color:'#fff8e6',roughness:.94,side:T.DoubleSide,emissive:'#dfc7a0',emissiveIntensity:finish==='lantern'?.8:0});if(finish==='lantern'){m.userData.practicalShade=true;m.userData.lightEmissiveBase=.8;}}
  else {m=new T.MeshStandardMaterial({map:tex(scheme,finish),normalMap:tex(scheme,finish,'normal'),color:'#fff',metalness:0,roughness:finish==='linen'?.94:finish==='oak'||finish==='walnut'?.64:.84,normalScale:new T.Vector2(finish==='linen'?.12:.3),side:T.DoubleSide});}
  m.name=scheme+' / catalogue '+finish;m.userData.catalogueFinish=finish;templates.set(key,m);return m;
 }
 function sourceFinish(name,scheme){name=name.toLowerCase();if(/glass|translucent/.test(name))return 'glass';if(/roof|corr/.test(name))return null;if(/grass/.test(name))return null;if(/wood|oak|plywood|木饰面|^\*5$|^\*8$|images-36sdfg|color_006/.test(name))return scheme==='mediterranean'?'walnut':'oak';if(/linen|fabric|jaquard|bed_|alberta|youshang|mmjhfdghd|chenzc|lenox__scanli2|color c02/.test(name))return 'linen';if(/rattan/.test(name))return 'cane';if(/^\*2$|polished concrete|granite/.test(name))return name.includes('polished')?'concrete':'stone';if(/color e01|unpainted/.test(name))return 'wall';if(/metal seamed|color m0|darkgray|^\*$|copper|不锈钢/.test(name))return scheme==='mediterranean'?'metal':'black';return null;}
 function preload(){for(const scheme of ['mediterranean','scandi'])for(const finish of ['wall','stone','oak','cane','concrete','linen',scheme==='mediterranean'?'walnut':'metal','metal'])material(scheme,finish);return Promise.all(pending);}
 return {material,sourceFinish,preload};
}
