import * as T from 'three';
export function installBedsideLighting(scene,{linen,canvas,onChange}){
 const root=new T.Group();root.name='Four interactive bedside lamps';scene.add(root);
 const lamps=[],meshes=[],settings={west:75,east:75};let kelvin=2700,currentScheme='tropical';
 const $=s=>document.querySelector(s);
 function warmColor(k){const t=k/100,r=t<=66?255:329.698727446*Math.pow(t-60,-.1332047592),g=t<=66?99.4708025861*Math.log(t)-161.1195681661:288.1221695283*Math.pow(t-60,-.0755148492),b=t>=66?255:t<=19?0:138.5177312231*Math.log(t-10)-305.0447927307;return new T.Color().setRGB(T.MathUtils.clamp(r,0,255)/255,T.MathUtils.clamp(g,0,255)/255,T.MathUtils.clamp(b,0,255)/255,T.SRGBColorSpace);}
 for(const room of ['west','east'])for(const [side,z] of [['inner',-.625],['garden',2.065]]){
  const sign=room==='west'?-1:1,x=sign*3.745,id=room+'-'+side,g=new T.Group();g.name=id+' bedside lamp';g.position.set(x,.455,z);root.add(g);
  const bronze=new T.MeshStandardMaterial({color:'#6b5840',metalness:.7,roughness:.34}),ceramic=new T.MeshStandardMaterial({color:'#a69272',roughness:.44});
  function add(geometry,material,y){const m=new T.Mesh(geometry,material);m.position.y=y;m.receiveShadow=true;m.userData.bedsideLamp=id;g.add(m);meshes.push(m);return m;}
  const base=add(new T.CylinderGeometry(.105,.11,.025,48),bronze,.013);
  const profile=[[.05,.025],[.07,.04],[.078,.075],[.065,.12],[.038,.17],[.026,.195]].map(p=>new T.Vector2(...p));const body=add(new T.LatheGeometry(profile,48),ceramic,0);
  const stem=add(new T.CylinderGeometry(.012,.015,.11,24),bronze,.235);
  const shadeMaterial=new T.MeshStandardMaterial({map:linen.map,color:'#f3ead6',roughness:.92,side:T.DoubleSide,emissive:'#ffd8a1',emissiveIntensity:.5});
  const shade=add(new T.CylinderGeometry(.112,.17,.27,64,1,true),shadeMaterial,.43);shade.name='Linen lampshade / touch to switch';
  const rims=[];for(const [radius,y] of [[.112,.565],[.17,.295]]){const rim=add(new T.TorusGeometry(radius,.004,8,64),bronze,y);rim.rotation.x=Math.PI/2;rims.push(rim);}
  const bulbMaterial=new T.MeshStandardMaterial({color:'#fff3d8',emissive:'#ffcf8f',emissiveIntensity:2});const bulb=add(new T.SphereGeometry(.034,20,12),bulbMaterial,.37),cord=add(new T.CylinderGeometry(.004,.004,1.02,12),bronze,1.99);cord.visible=false;
  const light=new T.SpotLight('#ffd6a2',18,3.4,1.06,.82,2);light.position.set(x,.86,z);light.target.position.set(x+sign*.45,.27,z);light.castShadow=true;light.shadow.mapSize.set(512,512);light.shadow.bias=-.0002;light.shadow.normalBias=.008;light.shadow.radius=4;root.add(light,light.target);
  const fill=new T.PointLight('#ffd6a2',1.2,1.15,2);fill.position.set(x,.86,z);root.add(fill);
  lamps.push({id,room,side,on:true,light,fill,shadeMaterial,bulbMaterial,shade,bulb,base,body,stem,cord,rims,bronze,ceramic,powerScale:1,emissionScale:1,originalShade:shade.geometry,scandiShade:new T.CylinderGeometry(.13,.18,.25,64,1,true),medShade:new T.CylinderGeometry(.064,.064,.36,64,1,true),originalRims:rims.map(r=>r.geometry),medRims:rims.map(()=>new T.TorusGeometry(.064,.004,8,64))});
 }
 function sync(){const color=warmColor(kelvin);for(const lamp of lamps){const power=lamp.on?settings[lamp.room]/100:0;lamp.light.intensity=18*power*lamp.powerScale;lamp.fill.intensity=1.2*power;lamp.light.color.copy(color);lamp.fill.color.copy(color);lamp.shadeMaterial.emissive.copy(color);lamp.shadeMaterial.emissiveIntensity=.035+.9*power*lamp.emissionScale;lamp.bulbMaterial.emissive.copy(color);lamp.bulbMaterial.emissiveIntensity=power*2.5;
  const b=$(`[data-bedside-lamp="${lamp.id}"]`);b.setAttribute('aria-pressed',String(lamp.on));b.classList.toggle('selected',lamp.on);b.textContent=(lamp.side==='garden'?'Garden side':'Inner side')+(lamp.on?' · On':' · Off');}
  for(const room of ['west','east']){const pair=lamps.filter(l=>l.room===room),checkbox=$('#bedside-'+room);checkbox.checked=pair.some(l=>l.on);checkbox.indeterminate=pair.some(l=>l.on)&&pair.some(l=>!l.on);$('#bedside-level-'+room).value=settings[room];$('#bedside-value-'+room).value=settings[room]+'%';}
  $('#bedside-warmth').value=kelvin;$('#bedside-warmth-value').value=kelvin+' K';canvas.dataset.bedside=JSON.stringify(lamps.map(l=>({id:l.id,on:l.on,intensity:+l.light.intensity.toFixed(2),shade:+l.shadeMaterial.emissiveIntensity.toFixed(3),kelvin,scheme:currentScheme})));onChange();
 }
 function toggle(id){const lamp=lamps.find(l=>l.id===id);if(lamp){lamp.on=!lamp.on;sync();}}
 for(const room of ['west','east']){$('#bedside-'+room).onchange=e=>{lamps.filter(l=>l.room===room).forEach(l=>l.on=e.target.checked);sync();};$('#bedside-level-'+room).oninput=e=>{settings[room]=Number(e.target.value);sync();};}
 document.querySelectorAll('[data-bedside-lamp]').forEach(b=>b.onclick=()=>toggle(b.dataset.bedsideLamp));$('#bedside-warmth').oninput=e=>{kelvin=Number(e.target.value);sync();};
 document.querySelectorAll('[data-bedside-preset]').forEach(b=>b.onclick=()=>{const presets={reading:[100,3000],relax:[55,2500],sleep:[10,2200]},[level,temp]=presets[b.dataset.bedsidePreset];settings.west=settings.east=level;kelvin=temp;lamps.forEach(l=>l.on=true);document.querySelectorAll('[data-bedside-preset]').forEach(p=>p.classList.toggle('selected',p===b));sync();});
 function setScheme(scheme,kit){currentScheme=scheme;for(const lamp of lamps){const med=scheme==='mediterranean',scandi=scheme==='scandi';lamp.base.visible=lamp.body.visible=lamp.stem.visible=!med;lamp.cord.visible=med;lamp.shade.geometry=med?lamp.medShade:scandi?lamp.scandiShade:lamp.originalShade;lamp.shade.position.y=med?1.4:.43;lamp.bulb.position.y=med?1.205:.37;lamp.rims.forEach((rim,i)=>{rim.geometry=med?lamp.medRims[i]:lamp.originalRims[i];rim.position.y=med?(i===0?1.58:1.22):(i===0?.565:.295);});lamp.shadeMaterial.map=med?kit.material(scheme,'metal').map:scandi?kit.material(scheme,'linen').map:linen.map;lamp.shadeMaterial.color.set(med?'#d7b683':'#f3ead6');lamp.shadeMaterial.metalness=med?.75:0;lamp.shadeMaterial.roughness=med?.35:.92;lamp.shadeMaterial.needsUpdate=true;lamp.bronze.color.set(scandi?'#b19a64':med?'#9c7847':'#6b5840');lamp.ceramic.color.set(scandi?'#d6cdb7':'#a69272');lamp.light.position.y=lamp.fill.position.y=med?1.72:.86;lamp.fill.distance=med?1.7:1.15;lamp.powerScale=med?1.8:1;lamp.emissionScale=med?.08:1;}sync();}
 sync();return {get meshes(){return meshes.filter(m=>m.visible);},toggle,setScheme,setClipping(planes){root.traverse(o=>{if(o.isMesh){o.material.clippingPlanes=planes;o.material.needsUpdate=true;}});},get count(){return lamps.length;}};
}
