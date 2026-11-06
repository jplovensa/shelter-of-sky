import * as T from 'three';
import {RoundedBoxGeometry} from './vendor/RoundedBoxGeometry.js';
export function buildCatalogueInterior(root,scheme,kit,uv){
 const med=scheme==='mediterranean',mat=id=>kit.material(scheme,id),wood=mat(med?'walnut':'oak'),oak=mat('oak'),cloth=mat('linen'),cane=mat('cane'),stone=mat('stone'),wall=mat('wall'),metal=mat('metal'),black=mat('black'),porcelain=mat('porcelain');
 function box(name,size,pos,m,r=.025,parent=root){const o=new T.Mesh(new RoundedBoxGeometry(...size,5,Math.min(r,Math.min(...size)*.45)),m);o.name=name;o.position.set(...pos);o.castShadow=o.receiveShadow=true;parent.add(o);o.updateMatrixWorld(true);uv(o,m===cloth?.55:m===cane?.38:1.3);return o;}
 function cyl(name,rt,rb,h,pos,m,parent=root){const o=new T.Mesh(new T.CylinderGeometry(rt,rb,h,64),m);o.name=name;o.position.set(...pos);o.castShadow=o.receiveShadow=true;parent.add(o);o.updateMatrixWorld(true);uv(o,m===cloth?.55:m===cane?.38:1.3);return o;}
 function tube(name,points,r,m,parent=root){const o=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),48,r,12,false),m);o.name=name;o.castShadow=o.receiveShadow=true;parent.add(o);return o;}
 function sphere(name,scale,pos,m,parent=root){const o=new T.Mesh(new T.SphereGeometry(1,40,24),m);o.name=name;o.scale.set(...scale);o.position.set(...pos);o.castShadow=o.receiveShadow=true;parent.add(o);return o;}
 function vessel(x,y,z,h=.28){const pts=[[0,0],[.11,0],[.14,.08],[.16,.18],[.11,.32],[.075,.4]].map(([a,b])=>new T.Vector2(a*h/.4,b*h/.4));const o=new T.Mesh(new T.LatheGeometry(new T.SplineCurve(pts).getPoints(64).map(p=>new T.Vector2(Math.max(0,p.x),Math.max(0,p.y))),64),mat(med?'concrete':'stone'));o.position.set(x,y,z);o.castShadow=true;o.name='Hand-formed stoneware';root.add(o);return o;}
 // Low upholstered seating follows the reference silhouettes while keeping the bedroom approach clear.
 const sofa=new T.Group();sofa.name=med?'Mediterranean / upholstered linen sectional':'Scandi-Asian / low oak and oatmeal sectional';sofa.position.set(-1.95,0,1.0);root.add(sofa);
 const width=2.38;
 box('Sofa / recessed base',[width-.08,.12,.91],[0,.19,0],med?cloth:oak,.04,sofa);
 if(!med)for(const x of [-1.02,1.02])for(const z of [-.34,.34])cyl('Sofa / tapered oak leg',.035,.025,.16,[x,.08,z],oak,sofa);
 box('Sofa / softly curved upholstered back',[width,.49,.2],[0,.59,.38],cloth,med?.09:.075,sofa);
 for(const x of [-1.12,1.12])box('Sofa / rounded upholstered arm',[.18,.34,.98],[x,.45,0],cloth,.08,sofa);
 for(const x of [-.72,0,.72]){const chaise=x<-.5,depth=chaise?1.15:.80,z=chaise?-.17:-.02;box('Sofa / loose seat cushion',[.69,.18,depth],[x,.345,z],cloth,.075,sofa);const back=box('Sofa / relaxed back cushion',[.70,.40,.18],[x,.61,.23],cloth,.075,sofa);back.rotation.x=.10;}
 for(const [x,lean] of [[-.78,-.12],[.78,.13]]){const accent=cloth.clone();accent.color.set(med?(x<0?'#cbb094':'#b59374'):(x<0?'#d9d5c3':'#a9ad97'));const cushion=box('Sofa / textured neutral cushion',[.36,.34,.13],[x,.59,.07],accent,.065,sofa);cushion.rotation.z=lean;}
 // Catalogue natural-fibre rug; the original swatch is the visible weave.
 const rug=box('Living / natural fibre rug',[2.67,.014,1.86],[-1.85,.008,.32],cane,.006);rug.userData.floorDecoration=true;
 cyl(med?'Coffee / dark walnut drum':'Coffee / low solid oak drum',.44,.42,.09,[-1.98,med?.36:.31,-.34],wood);cyl('Coffee / recessed pedestal',med?.25:.33,med?.28:.35,med?.31:.26,[-1.98,med?.155:.13,-.34],wood);
 cyl('Side / solid timber top',.24,.23,.045,[-1.10,.44,.02],oak);cyl('Side / pedestal',.095,.13,.41,[-1.10,.205,.02],wood);
 const bowl=new T.Mesh(new T.SphereGeometry(.15,40,20,0,Math.PI*2,Math.PI*.5,Math.PI*.5),black);bowl.material.side=T.DoubleSide;bowl.position.set(-1.98,med?.55:.50,-.34);bowl.name='Coffee / black ceramic bowl';root.add(bowl);vessel(-1.10,.465,.02,.19);
 // Six-seater table: substantial walnut in Mediterranean, softly profiled natural oak in Scandi-Asian.
 box('Dining / 1.80 x 0.90 m table',[1.8,med?.085:.065,.9],[0,.765,-1.4],wood,med?.045:.07);
 if(med){for(const x of [-.72,.72])for(const z of [-1.72,-1.08])box('Dining / square walnut leg',[.08,.73,.08],[x,.365,z],wood,.012);for(const z of [-1.74,-1.06])box('Dining / deep walnut apron',[1.52,.11,.045],[0,.69,z],wood,.012);}
 else {for(const x of [-.72,.72])for(const z of [-1.72,-1.08]){const leg=cyl('Dining / turned oak leg',.035,.025,.73,[x,.365,z],oak);leg.rotation.z=-x*.025;}for(const z of [-1.73,-1.07])box('Dining / apron',[1.48,.07,.035],[0,.695,z],oak,.01);}
 function chair(x,z,angle){const g=new T.Group();g.name=med?'Dining chair / upholstered cane armchair':'Dining chair / oak wishbone';g.position.set(x,0,z);g.rotation.y=angle;g.userData.diningChair=true;root.add(g);
  box('Chair / seat frame',[.47,.055,.46],[0,.435,0],oak,.03,g);box('Chair / woven seat',[.405,.027,.395],[0,.477,0],cane,.02,g);
  if(med)box('Chair / linen seat cushion',[.40,.045,.38],[0,.51,-.01],cloth,.02,g);
  for(const dx of [-.185,.185])for(const dz of [-.175,.175]){const leg=cyl('Chair / splayed turned leg',.023,.015,.44,[dx,.22,dz],oak,g);leg.rotation.x=dz*.18;leg.rotation.z=-dx*.12;}
  for(const dx of [-.20,.20])tube('Chair / curved rear post',[[dx,.43,.17],[dx,.68,.21],[dx*.94,.86,.20]],.018,oak,g);
  tube('Chair / shaped arm and crest',[[-.245,.65,-.05],[-.235,.81,.13],[-.15,.89,.24],[0,.91,.27],[.15,.89,.24],[.235,.81,.13],[.245,.65,-.05]],.021,oak,g);
  if(med){box('Chair / cane back panel',[.36,.28,.035],[0,.735,.225],cane,.02,g);box('Chair / upholstered inner back',[.32,.23,.033],[0,.745,.199],cloth,.025,g);for(const dx of [-.245,.245])box('Chair / oak armrest',[.045,.045,.32],[dx,.65,.04],oak,.02,g);}
  else {tube('Chair / central Y stem',[[0,.46,.19],[0,.65,.24],[0,.78,.25]],.014,oak,g);for(const sign of [-1,1])tube('Chair / wishbone fork',[[0,.66,.24],[sign*.065,.79,.25],[sign*.15,.88,.24]],.014,oak,g);}
  for(const z of [-.16,.16])box('Chair / low stretcher',[.37,.022,.022],[0,.22,z],oak,.008,g);
 }
 for(const x of [-.52,.52]){chair(x,-2.13,Math.PI);chair(x,-.67,0);}chair(-1.24,-1.4,-Math.PI/2);chair(1.24,-1.4,Math.PI/2);
 // Counter stools use the actual reference profile: metal-legged low backs or simple turned oak seats.
 for(const x of [1.63,2.34,3.05]){cyl('Stool / shaped timber seat',.20,.185,.065,[x,.67,.70],oak);for(const dx of [-.14,.14])for(const dz of [-.14,.14]){const leg=cyl('Stool / tapered leg',med?.012:.022,med?.009:.015,.64,[x+dx,.32,.70+dz],med?black:oak);leg.rotation.x=dz*.2;leg.rotation.z=-dx*.2;}
  const rail=new T.Mesh(new T.TorusGeometry(.17,.009,10,48),med?black:oak);rail.rotation.x=Math.PI/2;rail.position.set(x,.25,.70);rail.name='Stool / circular footrest';root.add(rail);
  if(med){for(const dx of [-.17,.17])box('Stool / back support',[.02,.30,.025],[x+dx,.80,.85],black,.008);const back=new T.Mesh(new T.CylinderGeometry(.22,.22,.20,40,1,true,-.85,1.7),wood);back.position.set(x,.85,.68);back.material.side=T.DoubleSide;back.name='Stool / curved walnut back';root.add(back);}}
 // Worktops, backsplash and fluted joinery have reference-specific surfaces.
 const worktop=med?mat('marble'):stone;box('Kitchen / stone worktop',[2.01,.028,.9],[2.35,.914,.017],worktop,.01);if(med)for(const x of [1.34,3.36])box('Kitchen / veined stone waterfall',[.055,.91,.9],[x,.455,.017],worktop,.012);box('Kitchen / reference stone backsplash',[2.37,.83,.025],[-2.14,1.33,-3.427],med?stone:wall,.005);
 if(med)for(let i=0;i<31;i++)box('Kitchen / walnut fluted joinery',[.065,.75,.022],[-3.26+i*.075,.43,-2.737],wood,.018);
 else for(let i=0;i<24;i++)box('Kitchen / natural oak slat detail',[.055,.72,.018],[-3.22+i*.095,.43,-2.735],oak,.015);
 // Large rattan drum / ribbed paper lantern, plus coordinated bar pendants.
 for(const [x,z,r,h] of [[0,-1.4,.38,.43],[2.1,.02,.18,.30],[2.8,.02,.18,.30]]){
  if(med&&x!==0)cyl('Pendant / slim bronze cylinder',.042,.042,.43,[x,2.3,z],metal);
  else if(med){const woven=cane.clone();woven.emissive.set('#d3ad70');woven.emissiveIntensity=.18;woven.userData.practicalShade=true;woven.userData.lightEmissiveBase=.35;const shade=new T.Mesh(new T.CylinderGeometry(r*.82,r,h,64,1,true),woven);shade.position.set(x,2.30,z);shade.name='Pendant / woven rattan drum';root.add(shade);for(const y of [2.30-h/2,2.30+h/2]){const rim=new T.Mesh(new T.TorusGeometry(y<2.3?r:r*.82,.009,10,64),wood);rim.rotation.x=Math.PI/2;rim.position.set(x,y,z);root.add(rim);}}
  else if(x!==0){const profile=[[.17,-.16],[.185,-.10],[.17,.05],[.13,.16],[.06,.22]].map(p=>new T.Vector2(...p));const woven=cane.clone();woven.emissive.set('#d3ad70');woven.emissiveIntensity=.18;woven.userData.practicalShade=true;woven.userData.lightEmissiveBase=.35;const shade=new T.Mesh(new T.LatheGeometry(profile,64),woven);shade.position.set(x,2.3,z);shade.material.side=T.DoubleSide;shade.name='Pendant / woven bell shade';root.add(shade);}
  else {const paper=mat('lantern');sphere('Pendant / ribbed paper lantern',[r,r*.93,r],[x,2.3,z],paper);for(let i=-5;i<=5;i++){const yy=i/6,rr=r*Math.sqrt(1-yy*yy);const ring=new T.Mesh(new T.TorusGeometry(rr,.0025,6,64),mat('linen'));ring.rotation.x=Math.PI/2;ring.position.set(x,2.3+yy*r*.93,z);root.add(ring);}}
  cyl('Pendant / black cord',.004,.004,.7,[x,2.84,z],black);sphere('Pendant / warm bulb',[.025,.025,.025],[x,med&&x!==0?2.075:2.22,z],new T.MeshStandardMaterial({color:'#fff1d0',emissive:'#ffd39a',emissiveIntensity:.7}));}
 // Bed walls use an arched plaster niche or an oak-backed linen headboard with framed botanical artwork.
 for(const sign of [-1,1]){const x=sign*3.53,z=.72;if(med){const arch=new T.Shape();arch.moveTo(-1.28,0);arch.lineTo(1.28,0);arch.lineTo(1.28,1.36);arch.absellipse(0,1.36,1.28,1.08,0,Math.PI,false);arch.closePath();const panel=new T.Mesh(new T.ExtrudeGeometry(arch,{depth:.04,bevelEnabled:true,bevelThickness:.015,bevelSize:.015,bevelSegments:3,curveSegments:48}),wall);panel.rotation.y=sign<0?-Math.PI/2:Math.PI/2;panel.position.set(x,.18,z);panel.name='Bedroom / arched ivory plaster niche';panel.receiveShadow=true;root.add(panel);
   const glow=new T.MeshStandardMaterial({color:'#ead6af',emissive:'#ffc881',emissiveIntensity:.2});const points=[];for(let i=0;i<=48;i++){const a=i*Math.PI/48;points.push([x+sign*.06,1.54+Math.sin(a)*1.08,z+Math.cos(a)*1.28]);}tube('Bedroom / fine arch light detail',points,.009,glow);
  }else {box('Bedroom / natural oak headboard backing',[.045,1.12,2.72],[x+sign*.10,.69,z],oak,.02);box('Bedroom / oatmeal upholstered headboard',[.065,.64,2.40],[x+sign*.14,.86,z],cloth,.03);const frame=box('Bedroom / oak framed botanical',[.045,.72,.60],[x+sign*.12,1.93,z],oak,.025);const paper=box('Bedroom / warm art paper',[.008,.65,.53],[x+sign*.15,1.93,z],mat('paper'),.004);
   for(let k=0;k<5;k++)tube('Bedroom / botanical line art',[[x+sign*.16,1.69,z-.12],[x+sign*.16,1.89+k*.025,z-.03],[x+sign*.16,2.08,z+.13-k*.045]],.0025,wood);}
 }
 // Complete bathroom sets keep the same functional fixture positions in all three schemes.
 const glass=mat('glass'),mirror=new T.MeshStandardMaterial({color:'#d6ded9',metalness:1,roughness:.07});
 for(const sign of [-1,1]){const x=sign*4.65,sx=sign*7.76,tx=sign*6.05;box('Bath / floating reference timber vanity',[1.3,.30,.47],[x,.65,-3.24],wood,.025);box('Bath / classic stone top',[1.36,.055,.5],[x,.825,-3.24],stone,.018);
  const basin=cyl('Bath / stone vessel basin',.21,.16,.12,[x,.91,-3.2],med?stone:porcelain);basin.scale.z=.8;const inner=cyl('Bath / basin interior',.16,.14,.012,[x,.977,-3.2],porcelain);inner.scale.z=.77;
  tube('Bath / curved mixer',[[x+.28,.85,-3.35],[x+.28,1.13,-3.35],[x+.12,1.17,-3.28],[x+.09,1.10,-3.23]],.012,med?metal:black);
  const rim=new T.Mesh(new T.TorusGeometry(.38,.018,12,64),metal);rim.position.set(x,1.62,-3.43);root.add(rim);const disk=new T.Mesh(new T.CircleGeometry(.362,64),mirror);disk.position.set(x,1.62,-3.42);root.add(disk);box('Bath / reference stone wall',[1.42,1.56,.025],[x,1.55,-3.48],med?wall:stone,.002);
  box('Bath / toilet cistern',[.38,.70,.16],[tx,.35,-3.34],porcelain,.06);const base=cyl('Bath / toilet pedestal',.16,.12,.29,[tx,.145,-3.04],porcelain);base.scale.z=1.35;sphere('Bath / shaped bowl',[.195,.138,.276],[tx,.34,-3.02],porcelain);const seat=new T.Mesh(new T.TorusGeometry(.165,.036,12,48),porcelain);seat.rotation.x=-Math.PI/2;seat.scale.y=1.25;seat.position.set(tx,.44,-3.02);root.add(seat);
  box('Bath / stone shower tray',[1.2,.045,1.3],[sx,.025,-2.84],stone,.015);box('Bath / reference stone shower wall',[1.2,2.3,.028],[sx,1.15,-3.48],stone,.002);cyl('Bath / rainshower riser',.013,.013,1.65,[sx,1.38,-3.38],med?metal:black);box('Bath / rainshower arm',[.028,.028,.38],[sx,2.2,-3.2],med?metal:black,.008);cyl('Bath / rainshower head',.16,.16,.025,[sx,2.17,-3.02],med?metal:black);box('Bath / clear shower screen',[.018,2.05,1.2],[sx-sign*.59,1.025,-2.84],glass,.002);
  box('Bath / timber towel shelf',[1.25,.04,.41],[x,.31,-3.24],wood,.014);for(let k=0;k<3;k++)box('Bath / folded oatmeal linen',[.29,.065,.30],[x-.40+k*.38,.37,-3.22],cloth,.025);vessel(x-sign*.46,.86,-3.25,.20);
 }
 root.updateMatrixWorld(true);return root;
}
