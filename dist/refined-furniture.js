import * as T from 'three';
import {RoundedBoxGeometry} from './vendor/RoundedBoxGeometry.js';
export function refinedFurniture(parent,pbr,uv){
 const wood=pbr('teak','#e8cda5',.62),linen=pbr('linen','#eee6d6',.94),teal=pbr('linen','#2e6462',.93),clay=pbr('linen','#a85830',.93),cane=pbr('rattan','#dec49a',.84),stone=pbr('lava','#b2afa1',.86),dark=new T.MeshStandardMaterial({color:'#2c3029',metalness:.4,roughness:.52});
 function rounded(name,size,pos,mat,r=.04){const m=new T.Mesh(new RoundedBoxGeometry(...size,5,Math.min(r,Math.min(...size)*.47)),mat);m.name=name;m.position.set(...pos);m.castShadow=m.receiveShadow=true;parent.add(m);m.updateMatrixWorld();uv(m,mat===cane?.5:1.4);return m;}
 function cylinder(name,rt,rb,h,pos,mat){const m=new T.Mesh(new T.CylinderGeometry(rt,rb,h,64),mat);m.name=name;m.position.set(...pos);m.castShadow=m.receiveShadow=true;parent.add(m);return m;}
 const sofaStart=parent.children.length;
 // Three-piece sofa: structural teak plinth, full-depth seat cushions, separate soft backs.
 rounded('Sofa / teak platform',[1.03,.12,2.75],[-2.78,.255,.02],wood,.035);
 for(const z of [-1.16,1.20])for(const x of [-3.15,-2.42])cylinder('Sofa / tapered teak foot',.035,.026,.20,[x,.10,z],wood);
 rounded('Sofa / upholstered back',[.19,.52,2.7],[-3.22,.61,.02],linen,.07);
 for(const z of [-1.25,1.29])rounded('Sofa / soft upholstered arm',[1.03,.32,.16],[-2.78,.5,z],linen,.07);
 for(const z of [-.78,.02,.82]){rounded('Sofa / sprung seat cushion',[.82,.17,.77],[-2.7,.415,z],linen,.065);const back=rounded('Sofa / loose back cushion',[.18,.42,.75],[-3.06,.67,z],linen,.065);back.rotation.z=-.12;}
 for(const [z,mat] of [[-.83,teal],[.91,clay]]){const c=rounded('Sofa / catalogue accent cushion',[.18,.35,.36],[-2.96,.64,z],mat,.065);c.rotation.z=-.22;c.rotation.x=.12;}
 // Turn the sofa along the front fixed glazing, outside the bedroom-door approach.
 const sofaParts=parent.children.slice(sofaStart),sofaGroup=new T.Group();sofaGroup.name='Living sofa / clear bedroom entrance';sofaGroup.position.set(-2.78,0,.02);parent.add(sofaGroup);parent.updateMatrixWorld(true);for(const part of sofaParts)sofaGroup.attach(part);sofaGroup.scale.z=.88;sofaGroup.rotation.y=Math.PI/2;sofaGroup.position.set(-1.95,0,1.0);
 // Sculpted solid-wood coffee tables with rounded edges and recessed pedestal bases.
 cylinder('Coffee table / main turned pedestal',.17,.22,.31,[-1.98,.155,-.34],wood);
 const main=cylinder('Coffee table / honed lava top',.43,.42,.065,[-1.98,.342,-.34],stone);main.updateMatrixWorld();uv(main,1.2);
 cylinder('Coffee table / companion pedestal',.1,.15,.40,[-1.12,.20,.02],wood);cylinder('Coffee table / teak companion top',.28,.27,.045,[-1.12,.423,.02],wood);
 const bowl=cylinder('Coffee table / stoneware bowl',.12,.075,.07,[-1.98,.41,-.34],new T.MeshStandardMaterial({color:'#b89a72',roughness:.9}));
 // Three counter stools; tapered legs, a real foot rail and curved cane backrests.
 for(const x of [1.63,2.34,3.05]){rounded('Bar stool / rounded cane seat',[.39,.07,.38],[x,.66,.70],cane,.035);
  for(const dx of [-.145,.145])for(const dz of [-.14,.14]){const leg=cylinder('Bar stool / tapered leg',.018,.012,.64,[x+dx,.32,.7+dz],wood);leg.rotation.z=-dx*.15;}
  for(const z of [.56,.84]){const rail=cylinder('Bar stool / foot rail',.009,.009,.31,[x,.25,z],dark);rail.rotation.z=Math.PI/2;}
  const curve=new T.EllipseCurve(0,0,.185,.15,0,Math.PI,false,0).getPoints(18).map(p=>new T.Vector3(p.x+x,.94,p.y+.70));const tubular=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(curve),24,.018,8,false),wood);tubular.name='Bar stool / curved teak back rail';tubular.castShadow=true;parent.add(tubular);
  rounded('Bar stool / woven back',[.33,.22,.035],[x,.83,.84],cane,.015);
 } // Six-seat dining set: 1.80 x 0.90 m teak table, hand-framed cane chairs.
 rounded('Dining / rounded solid teak top',[1.8,.065,.9],[0,.765,-1.4],wood,.045);
 for(const x of [-.72,.72])for(const z of [-1.72,-1.08]){const leg=rounded('Dining / tapered hardwood leg',[.065,.73,.065],[x,.365,z],wood,.014);leg.rotation.z=-x*.015;}
 rounded('Dining / long apron',[1.54,.085,.045],[0,.69,-1.76],wood,.012);rounded('Dining / long apron',[1.54,.085,.045],[0,.69,-1.04],wood,.012);
 function diningChair(x,z,rotation){const chair=new T.Group();chair.name='Dining / rattan chair';chair.position.set(x,0,z);chair.rotation.y=rotation;parent.add(chair);const temp=new T.Group();const built=[];
  function part(name,size,pos,mat,r=.02){const o=new T.Mesh(new RoundedBoxGeometry(...size,4,Math.min(r,Math.min(...size)*.45)),mat);o.name=name;o.position.set(...pos);o.castShadow=o.receiveShadow=true;chair.add(o);return o;}
  part('Chair / teak seat frame',[.47,.055,.46],[0,.43,0],wood,.025);part('Chair / woven rattan seat',[.405,.025,.39],[0,.471,0],cane,.018);part('Chair / linen seat pad',[.38,.04,.36],[0,.503,-.015],linen,.018);
  for(const dx of [-.185,.185])for(const dz of [-.175,.175]){const leg=part('Chair / splayed hardwood leg',[.033,.43,.033],[dx,.215,dz],wood,.01);leg.rotation.x=dz*.15;leg.rotation.z=-dx*.15;}
  for(const dx of [-.20,.20])part('Chair / rear upright',[.03,.43,.03],[dx,.67,.195],wood,.012);
  const curve=new T.CatmullRomCurve3([new T.Vector3(-.225,.86,.1),new T.Vector3(-.18,.90,.23),new T.Vector3(0,.91,.27),new T.Vector3(.18,.90,.23),new T.Vector3(.225,.86,.1)]);const rail=new T.Mesh(new T.TubeGeometry(curve,36,.019,12,false),wood);rail.name='Chair / curved teak crest';rail.castShadow=true;chair.add(rail);
  const panel=new T.Mesh(new T.CylinderGeometry(.26,.26,.27,32,1,true,-Math.PI*.27,Math.PI*.54),cane);panel.position.set(0,.735,.02);panel.material.side=T.DoubleSide;panel.name='Chair / curved woven rattan back';panel.castShadow=true;chair.add(panel);
 }
 for(const x of [-.52,.52]){diningChair(x,-2.13,Math.PI);diningChair(x,-.67,0);}diningChair(-1.24,-1.4,-Math.PI/2);diningChair(1.24,-1.4,Math.PI/2);
 // Complete the two rear wet-area proposals within the existing pavilion footprint.
 const porcelain=new T.MeshPhysicalMaterial({color:'#eee9df',roughness:.22,clearcoat:.35}),glass=new T.MeshPhysicalMaterial({color:'#d6e2d9',transparent:true,opacity:.14,roughness:.12,metalness:.08,depthWrite:false,side:T.DoubleSide}),mirror=new T.MeshStandardMaterial({color:'#c4d1cd',metalness:1,roughness:.075}),glow=new T.MeshStandardMaterial({color:'#ffe1ad',emissive:'#ffcd87',emissiveIntensity:1.6});
 const zellige=pbr('zellige','#fff',.28),terrazzo=pbr('terrazzo','#eee8d9',.55);
 for(const side of [-1,1]){const sign=side,x=sign*4.65;
  rounded('Bath / floating teak vanity',[1.3,.3,.47],[x,.65,-3.24],wood,.025);const slab=rounded('Bath / terrazzo vanity top',[1.36,.055,.5],[x,.825,-3.24],terrazzo,.022);slab.updateMatrixWorld();uv(slab,1.2);
  const basin=cylinder('Bath / porcelain vessel basin',.21,.16,.12,[x,.91,-3.2],porcelain);basin.scale.z=.78;
  const inner=cylinder('Bath / basin interior',.16,.14,.01,[x,.976,-3.2],new T.MeshStandardMaterial({color:'#c9c7bb',roughness:.3}));inner.scale.z=.77;
  const tapcurve=new T.CatmullRomCurve3([new T.Vector3(x+.28,.85,-3.35),new T.Vector3(x+.28,1.13,-3.35),new T.Vector3(x+.12,1.17,-3.28),new T.Vector3(x+.09,1.1,-3.23)]);const tap=new T.Mesh(new T.TubeGeometry(tapcurve,20,.012,8,false),dark);tap.name='Bath / matte black basin mixer';parent.add(tap);
  const rim=new T.Mesh(new T.TorusGeometry(.38,.018,12,64),glow);rim.position.set(x,1.62,-3.43);parent.add(rim);const disk=new T.Mesh(new T.CircleGeometry(.365,64),mirror);disk.position.set(x,1.62,-3.42);disk.name='Bath / round backlit mirror';parent.add(disk);
  const splash=rounded('Bath / green zellige vanity wall',[1.42,1.56,.025],[x,1.55,-3.48],zellige,.002);splash.updateMatrixWorld();uv(splash,.52);
  // Toilet has a shaped pedestal, bowl, oval seat and compact cistern.
  const tx=sign*6.05;rounded('Bath / toilet cistern',[.38,.7,.16],[tx,.35,-3.34],porcelain,.065);const base=cylinder('Bath / toilet pedestal',.16,.12,.29,[tx,.145,-3.04],porcelain);base.scale.z=1.35;const bowl=new T.Mesh(new T.SphereGeometry(.23,24,16),porcelain);bowl.position.set(tx,.34,-3.02);bowl.scale.set(.85,.6,1.2);bowl.castShadow=true;parent.add(bowl);const seat=new T.Mesh(new T.TorusGeometry(.165,.036,10,48),porcelain);seat.rotation.x=-Math.PI/2;seat.scale.y=1.25;seat.position.set(tx,.44,-3.02);parent.add(seat);
  const sx=sign*7.76;const tray=rounded('Bath / lava stone shower tray',[1.2,.045,1.3],[sx,.025,-2.84],stone,.02);tray.updateMatrixWorld();uv(tray,1.1);const wall=rounded('Bath / green zellige shower wall',[1.2,2.3,.028],[sx,1.15,-3.48],zellige,.002);wall.updateMatrixWorld();uv(wall,.52);
  const riser=cylinder('Bath / black shower riser',.013,.013,1.65,[sx,1.38,-3.38],dark);const arm=rounded('Bath / rainshower arm',[.028,.028,.38],[sx,2.2,-3.2],dark,.01);cylinder('Bath / rainshower head',.16,.16,.025,[sx,2.17,-3.02],dark);
  rounded('Bath / clear shower screen',[.018,2.05,1.2],[sx-sign*.59,1.025,-2.84],glass,.002);
  rounded('Bath / towel shelf',[1.25,.04,.41],[x,.31,-3.24],wood,.015);for(let t=0;t<3;t++)rounded('Bath / folded linen towel',[.29,.065,.30],[x-.4+t*.38,.37,-3.22],linen,.025);
 }

}
