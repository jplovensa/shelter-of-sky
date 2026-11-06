from pathlib import Path
from PIL import Image,ImageOps
# Neutralize the source fabric's blue dye while retaining its photographed weave.
p=Path('dist/assets/realism/linen-color.jpg');im=Image.open(p);im=ImageOps.grayscale(im);im=ImageOps.colorize(im,black='#756d5b',white='#f3edde');im.save(p,quality=92)
p=Path('dist/app.js');s=p.read_text()
s=s.replace("import {MeshoptDecoder}","import {EffectComposer} from './vendor/postprocessing/EffectComposer.js';\nimport {RenderPass} from './vendor/postprocessing/RenderPass.js';\nimport {SSAOPass} from './vendor/postprocessing/SSAOPass.js';\nimport {OutputPass} from './vendor/postprocessing/OutputPass.js';\nimport {MeshoptDecoder}")
s=s.replace("const controls=new", "const composer=new EffectComposer(renderer);const renderPass=new RenderPass(scene,camera);composer.addPass(renderPass);const ao=new SSAOPass(scene,camera,innerWidth,innerHeight,12);ao.kernelRadius=.55;ao.minDistance=.001;ao.maxDistance=.12;composer.addPass(ao);composer.addPass(new OutputPass());\nfunction render(){renderPass.camera=activeCamera;ao.camera=activeCamera;ao.enabled=mode!=='plan'&&innerWidth>650;composer.render();renderer.domElement.dataset.meshes=meshes.length;renderer.domElement.dataset.mode=mode;renderer.domElement.dataset.room=room;renderer.domElement.dataset.camera=camera.position.toArray().map(n=>n.toFixed(2)).join(',');}\nconst controls=new")
s=s.replace("eye:[18,12,24]","eye:[15,9,23]").replace("eye:[-.5,1.65,2.6],target:[-1.9,1.0,-.9]","eye:[.1,1.6,.6],target:[-2.45,.9,-.3]").replace("eye:[.3,1.65,1.9],target:[2.0,1.2,-2.0]","eye:[.3,1.65,.65],target:[-1.9,1.1,-3.15]")
s=s.replace("eye:[-6.5,1.65,3.0],target:[-5.4,.9,.4]","eye:[-6.1,1.6,2.6],target:[-4.4,.85,.4]").replace("eye:[5.7,1.65,3.0],target:[7.2,.9,.4]","eye:[6.1,1.6,2.6],target:[4.5,.85,.4]")
s=s.replace("eye:[5.8,1.65,-1.5],target:[7.8,1.2,-3.5]","eye:[4.2,1.6,-2.7],target:[7.3,1.05,-2.8]")
s=s.replace("else if(/wood|oak|plywood|木饰面/", "else if(/wood|oak|plywood|木饰面|^\\*5$|^\\*8$|images-36sdfg|color_006/")
s=s.replace("else if(/linen|fabric|jaquard|bed_|alberta/", "else if(/linen|fabric|jaquard|bed_|alberta|youshang|mmjhfdghd/")
s=s.replace("else if(/rattan/", "else if(/^\\*2$/.test(name)){next=pbr('terrazzo','#fff',.6);projectUV(o,1.2);}\n else if(/rattan/")
s=s.replace("[1.93,1.3,-3.414]","[-2.14,1.33,-3.427]").replace("[2.2,.62,.022]","[2.37,.83,.025]")
s=s.replace("[2.35,.913,-.99]","[2.35,.913,.017]")
s=s.replace("for(const x of [-6.02,6.02]){const runner=meshBox('Teal linen bed runner',[1.75,.028,.47],[x+1.23,.63,.98],teal)","for(const x of [-5.37,5.37]){const runner=meshBox('Teal linen bed runner',[1.75,.025,.43],[x,.62,.98],teal)")
s=s.replace("day:['#dce2d7','#fff0d2',3.4,1.1,1.05,1]","day:['#dce2d7','#fff0d2',2.5,.55,.98,.55]").replace("golden:['#d9c2a3','#ffc78d',2.7,.65,1.1,.6]","golden:['#d9c2a3','#ffc78d',2.8,.4,1.05,.4]")
s=s.replace("renderer.render(scene,activeCamera)","render()")
s=s.replace("renderer.setSize(innerWidth,innerHeight);dirty=true;}","renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight);dirty=true;}")
# Replace the placeholder palm crowns with feathered fronds and shrubs with leaf clusters.
a=s.index(' function palm(');b=s.index(' // Potted broad-leaf',a)
s=s[:a]+''' function palm(x,z,h,seed){const g=new THREE.Group();g.position.set(x,-2.25,z);const stem=new THREE.Mesh(new THREE.CylinderGeometry(.07,.14,h,10),trunk);stem.position.y=h/2;stem.rotation.z=.03*Math.sin(seed);stem.castShadow=true;g.add(stem);
  const pos=[];const v=(r,side,y,a)=>[Math.sin(a)*r+Math.cos(a)*side,y,Math.cos(a)*r-Math.sin(a)*side];
  for(let i=0;i<10;i++){const a=i*Math.PI*2/10+seed;for(let j=2;j<23;j++){const r=j*.12,fall=.14*r*r,spread=.46*Math.sin(j/24*Math.PI)+.12;for(const sign of [-1,1]){const p=v(r,0,h+.15-fall,a),q=v(r+.35,spread*sign,h-.12-fall,a),n=v(r+.1,.025*sign,h+.1-fall,a);pos.push(...p,...q,...n);}}}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.computeVertexNormals();const fronds=new THREE.Mesh(geo,leaf);fronds.castShadow=true;g.add(fronds);garden.add(g);}
 for(let i=0;i<12;i++){const a=i*Math.PI*2/12;palm(Math.sin(a)*(20+(i%3)*1.7),Math.cos(a)*(16+i%4),6+(i%5)*.6,i*.8);}
 const shrubGeo=new THREE.SphereGeometry(1,10,7);for(let i=0;i<28;i++){const a=i*2.39996,r=16+(i%4)*1.6;const g=new THREE.Group();g.position.set(Math.sin(a)*r,-2.2,Math.cos(a)*r*.78);for(let j=0;j<8;j++){const l=new THREE.Mesh(shrubGeo,new THREE.MeshStandardMaterial({color:['#405337','#536246','#64734e'][i%4],roughness:1}));const q=j*2.4;l.position.set(Math.sin(q)*.35,.7,Math.cos(q)*.35);l.scale.set(.15,.8,.07);l.rotation.set(Math.sin(q)*.7,0,Math.cos(q)*.7);l.castShadow=true;g.add(l);}garden.add(g);}
''' +s[b:]
# Material additions keyed to the existing pavilions, kept inside clear floor areas.
a=s.index(' // Supplement source fixtures')
s=s[:a]+''' // A compact dining setting occupies the open centre of the social pavilion.
 const timber=pbr('teak','#e5bf8d',.62),cane=pbr('rattan','#e7cea0',.85),metal=new THREE.MeshStandardMaterial({color:'#2b3029',roughness:.65,metalness:.35});
 const table=meshBox('Teak dining table',[1.15,.055,.74],[0,.755,-1.9],timber);table.updateMatrixWorld();projectUV(table,1.4);
 for(const x of [-.44,.44])for(const z of [-2.14,-1.66])meshBox('Dining table leg',[.055,.73,.055],[x,.365,z],timber);
 for(const z of [-2.55,-1.25]){const chair=meshBox('Rattan dining chair seat',[.43,.055,.42],[0,.45,z],cane);chair.updateMatrixWorld();projectUV(chair,.5);for(const x of [-.17,.17])for(const dz of [-.15,.15])meshBox('Chair leg',[.028,.43,.028],[x,.215,z+dz],timber);const back=meshBox('Rattan dining chair back',[.43,.42,.04],[0,.69,z+(z<-2?-.18:.18)],cane);back.updateMatrixWorld();projectUV(back,.5);}
 const cushion=meshBox('Terracotta sofa cushion',[.18,.32,.4],[-2.79,.57,.3],clay);cushion.rotation.z=.13;cushion.updateMatrixWorld();projectUV(cushion,1);
 // Woven pendants over the dining table and bar echo the original catalogue.
 for(const [x,z] of [[0,-1.9],[2.1,.02],[2.8,.02]]){const shade=new THREE.Mesh(new THREE.ConeGeometry(.26,.36,32,1,true),cane);shade.position.set(x,2.25,z);shade.castShadow=true;decor.add(shade);meshBox('Pendant suspension',[.008,.7,.008],[x,2.77,z],metal);const bulb=new THREE.Mesh(new THREE.SphereGeometry(.055,12,8),new THREE.MeshStandardMaterial({color:'#ffdfad',emissive:'#ffc77c',emissiveIntensity:1.2}));bulb.position.set(x,2.13,z);decor.add(bulb);}
''' +s[a:]
p.write_text(s)
