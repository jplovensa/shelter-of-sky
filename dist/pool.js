import * as T from 'three';
import {Water} from './vendor/Water.js';
// Water dimensions 6.00 x 2.00 m; coping outside 6.48 x 2.48 m; basin 1.10 m deep.
function outline(w,h,r){const s=new T.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;}
export function cutPool(material){material.onBeforeCompile=shader=>{shader.vertexShader='varying vec3 vPoolWorld;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nvPoolWorld=(modelMatrix*vec4(transformed,1.0)).xyz;');shader.fragmentShader='varying vec3 vPoolWorld;\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <clipping_planes_fragment>',`#include <clipping_planes_fragment>
vec2 poolQ=abs(vPoolWorld.xz-vec2(0.0,5.2))-vec2(2.78,0.78);float poolD=length(max(poolQ,0.0))+min(max(poolQ.x,poolQ.y),0.0)-0.22;
if(poolD<0.0&&vPoolWorld.y<0.08&&vPoolWorld.y>-1.12)discard;`);};material.customProgramCacheKey=()=> 'shelter-pool-6x2-v1';material.needsUpdate=true;}
export function createPool(scene,texture,sun,pbr){
 const group=new T.Group();group.name='Refined pool / 6.0 x 2.0 m';scene.add(group);
 const ring=outline(6.48,2.48,.4),inside=outline(6,2,.22);ring.holes.push(new T.Path(inside.getPoints(64)));
 const wall=new T.Mesh(new T.ExtrudeGeometry(ring,{depth:1.15,bevelEnabled:false,curveSegments:18}),pbr('lava','#7e9082',.75));wall.rotation.x=Math.PI/2;wall.position.set(0,.015,5.2);wall.receiveShadow=true;group.add(wall);
 const coping=new T.Mesh(new T.ExtrudeGeometry(ring,{depth:.065,bevelEnabled:true,bevelThickness:.006,bevelSize:.006,bevelSegments:2,curveSegments:24}),pbr('microcement','#ded6c3',.7));coping.rotation.x=Math.PI/2;coping.position.set(0,.025,5.2);coping.castShadow=coping.receiveShadow=true;coping.name='Honed stone coping / 240 mm';group.add(coping);
 const bottom=new T.Mesh(new T.ShapeGeometry(inside,24),new T.MeshStandardMaterial({color:'#3d6864',roughness:.5}));bottom.rotation.x=Math.PI/2;bottom.material.side=T.DoubleSide;bottom.position.set(0,-1.11,5.2);bottom.receiveShadow=true;group.add(bottom);
 const water=new Water(new T.ShapeGeometry(inside,32),{textureWidth:512,textureHeight:512,waterNormals:texture('assets/materials/water-normal.jpg'),sunDirection:sun.position.clone().normalize(),sunColor:0xffefd2,waterColor:0x397e7c,distortionScale:.25,alpha:.86,fog:true});water.rotation.x=-Math.PI/2;water.position.set(0,-.07,5.2);water.material.uniforms.size.value=14;water.material.transparent=true;water.material.depthWrite=false;water.name='Water / 6.0 x 2.0 m';group.add(water);
 return water;
}
