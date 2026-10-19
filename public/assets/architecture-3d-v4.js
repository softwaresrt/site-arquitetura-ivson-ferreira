/* Original conceptual WebGL architectural model. It is NOT presented as a built Ivson Ferreira project. */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';
const host=document.querySelector('.journey-visual');if(!host)throw new Error('Sem destino para o canvas');
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x29312e,.018);
const camera=new THREE.PerspectiveCamera(36,1,.1,110);
camera.position.set(13,9,15);camera.lookAt(0,1.9,0);
const renderer=new THREE.WebGLRenderer({alpha:true,antialias:window.innerWidth>850&&window.devicePixelRatio<2,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,window.innerWidth<700?1.05:1.35));renderer.setSize(host.clientWidth,host.clientHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;renderer.shadowMap.enabled=window.innerWidth>850;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.domElement.setAttribute('aria-label','Maquete tridimensional conceitual mostrando a evolução do projeto arquitetônico');renderer.domElement.setAttribute('role','img');host.prepend(renderer.domElement);renderer.domElement.classList.add('ready');
const hemi=new THREE.HemisphereLight(0xe9f3ec,0x4e5347,2.1);scene.add(hemi);const sun=new THREE.DirectionalLight(0xffe8bf,3.6);sun.position.set(-6,15,10);sun.castShadow=window.innerWidth>850;sun.shadow.mapSize.set(640,640);sun.shadow.camera.left=-16;sun.shadow.camera.right=16;sun.shadow.camera.top=16;sun.shadow.camera.bottom=-16;sun.shadow.bias=-.0002;scene.add(sun);const warm=new THREE.PointLight(0xffb778,8,14);warm.position.set(1.6,3.3,-.5);scene.add(warm);
const mat=(color,roughness=.75,metalness=0,props={})=>new THREE.MeshStandardMaterial({color,roughness,metalness,...props});
const concrete=mat(0xbbb5a7,.92),stone=mat(0xd6ccba,.96),dark=mat(0x242d2b,.45,.35),wood=mat(0x876043,.73),warmwood=mat(0xb48a61,.68),floorwood=mat(0x8c6c4f,.7),grass=mat(0x556747,.94),leaves=mat(0x536c4b,.98),glass= new THREE.MeshPhysicalMaterial({color:0xa7d4cf,transparent:true,opacity:.28,metalness:0,roughness:.09,depthWrite:false,side:THREE.DoubleSide}),water=new THREE.MeshPhysicalMaterial({color:0x4aa6a8,metalness:.18,roughness:.18,transparent:true,opacity:.86}),lightmat=new THREE.MeshBasicMaterial({color:0xffd5a0,transparent:true,opacity:.82});
const root=new THREE.Group();scene.add(root);const foundation=new THREE.Group(),structure=new THREE.Group(),finishes=new THREE.Group(),details=new THREE.Group(),wire=new THREE.Group();root.add(foundation,structure,finishes,details,wire);
function box(group,x,y,z,w,h,d,material,opts={}){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);m.castShadow=opts.cast!==false;m.receiveShadow=true;group.add(m);return m}
function cyl(group,x,y,z,rTop,rBottom,height,material,segments=8){const m=new THREE.Mesh(new THREE.CylinderGeometry(rTop,rBottom,height,segments),material);m.position.set(x,y,z);m.castShadow=true;group.add(m);return m}
// Foundation, terrain, inset reflective pool and approach paving.
box(foundation,0,-.42,0,14,.54,9,mat(0x565c50,.95));box(foundation,.9,-.09,-.45,8.4,.28,6.4,concrete);box(foundation,-4,-.13,2.05,4.2,.22,3.35,concrete);box(foundation,-4,-.015,2.05,3.85,.07,3.02,water,{cast:false});
for(let i=0;i<10;i++)box(foundation,-6.45+i*.7,-.08,-2.55,.4,.03,1.4,stone);
// Structural assembly: true 3D volume, columns, cantilevered upper slab.
box(structure,1.35,2.9,-.42,8.95,.24,6.45,concrete);box(structure,1.38,5.84,-.5,9.6,.3,6.6,concrete);
for(const x of [-2.45,4.6])for(const z of [-3.1,2.3])box(structure,x,1.47,z,.25,2.92,.25,stone);
for(const x of [-2.65,4.7])for(const z of [-3.1,2.35])box(structure,x,4.35,z,.21,2.75,.21,dark);
box(structure,4.73,2.95,-.55,.23,5.95,5.65,concrete);
// Ground floor side wall and ceiling finish; upper glazing spans.
box(finishes,-2.45,1.42,-.7,.22,2.72,5.35,stone);box(finishes,1.1,1.34,-3.12,6.75,2.62,.18,wood);
box(finishes,1.12,4.3,-3.02,6.76,2.6,.2,stone);box(finishes,1.17,4.42,2.52,6.85,2.65,.08,glass,{cast:false});
box(finishes,1.15,1.48,2.46,6.9,2.5,.07,glass,{cast:false});box(finishes,1.1,1.22,-2.95,6.75,.1,5.65,floorwood);
for(const y of [.26,2.85,3.04,5.69])box(finishes,1.15,y,2.5,6.87,.065,.075,dark);
for(const x of [-2.27,-.15,2,4.51]){box(finishes,x,1.45,2.55,.065,2.57,.08,dark);box(finishes,x,4.3,2.55,.065,2.67,.08,dark)}
box(finishes,-2.67,4.34,.1,.16,2.72,5.2,wood);for(let i=0;i<17;i++){let slat=box(finishes,-2.73+i*.01,4.33,-2.68+i*.29,.08,2.6,.13,warmwood);}
// Terrace railing and boardwalk.
box(details,-1.1,3.06,3.1,7.8,.08,.1,dark);for(const x of [-4.9,-2.9,-.9,1.1,3.1,4.9])box(details,x,3.4,3.13,.045,.72,.05,dark);box(details,0,3.77,3.13,9.75,.05,.08,dark);box(details,.1,3.4,3.12,9.6,.65,.03,glass,{cast:false});
// Pergola detailing, dimensional chairs and sun lounger geometry.
for(let i=0;i<8;i++)box(details,2.15,5.99,-3+i*.74,5.4,.11,.14,wood);
for(const dx of [0,1.35]){box(details,-3.8+dx,.23,3.0,.83,.07,1.55,stone);box(details,-3.8+dx,.48,3.72,.83,.05,.65,stone).rotation.x=-.35;}
// Interior furniture outlines visible through physical translucent glass.
box(details,-.3,.73,-.5,2.4,.27,1.25,stone);box(details,-.3,.45,-.5,2.1,.25,.9,wood);
box(details,2.4,.7,-1.6,1.45,.43,.75,stone);box(details,2.4,.97,-1.9,1.45,.16,.22,stone);
box(details,1.1,3.3,-.5,2.5,.08,1.3,warmwood);for(const x of [.15,2.05])box(details,x,3.13,-.5,.09,.36,.95,dark);
for(const x of [-1.55,3.8]){box(details,x,4.45,-1.5,.32,.75,.32,lightmat,{cast:false});}
// Landscape planting with real geometric volume, not sprites.
for(let i=0;i<17;i++){const a=i*2.4,x=Math.sin(a)*6.4,z=Math.cos(a*1.7)*3.85;let r=.15+(i%3)*.07;const h=.3+(i%4)*.18;cyl(details,x,h/2-.11,z,r,r*1.1,h,wood,7);for(let j=0;j<3;j++){const ball=new THREE.Mesh(new THREE.IcosahedronGeometry(r*(1.7+j*.16),1),leaves);ball.position.set(x+Math.sin(j*2.1)*r,h*.6+j*r*.45,z+Math.cos(j*2.3)*r);details.add(ball)}}
// Fine architectural construction drawing: edges only (not a fake model).
const guideMat=new THREE.LineBasicMaterial({color:0xe0e6dd,transparent:true,opacity:.8,depthTest:false});function outline(w,h,d,x,y,z){const g=new THREE.EdgesGeometry(new THREE.BoxGeometry(w,h,d));const line=new THREE.LineSegments(g,guideMat);line.position.set(x,y,z);wire.add(line)}outline(8.4,.28,6.4,.9,-.09,-.45);outline(8.95,.24,6.45,1.35,2.9,-.42);outline(9.6,.3,6.6,1.38,5.84,-.5);for(let x of [-2.45,4.6])for(let z of [-3.1,2.3])outline(.25,2.92,.25,x,1.47,z);
// Cinematic scroll timeline; reversible and pointer-reactive on desktop.
let pointerX=0,pointerY=0,currentX=13,currentY=9,currentZ=15,progress=window.__ivsonProgress||0,visible=true;
function smooth(a,b,t){return a+(b-a)*t}function ease(t){return t*t*(3-2*t)}
function alpha(group,a){group.visible=a>.005;group.traverse(m=>{if(m.isMesh&&m.material&&m.material.transparent&&!m.userData.baseOpacity)m.userData.baseOpacity=m.material.opacity})}
window.addEventListener('ivson3dprogress',e=>{progress=e.detail});
const io=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;if(visible)startLoop()},{threshold:.02});io.observe(host);
host.addEventListener('pointermove',e=>{if(matchMedia('(pointer: fine)').matches){const r=host.getBoundingClientRect();pointerX=((e.clientX-r.left)/r.width-.5)*.7;pointerY=((e.clientY-r.top)/r.height-.5)*.35}});host.addEventListener('pointerleave',()=>{pointerX=pointerY=0});
let elapsed=0,rafId=0,lastDraw=0;const lowPower=matchMedia('(max-width:850px)').matches;function startLoop(){if(!rafId && visible && !document.hidden)rafId=requestAnimationFrame(loop)}function loop(now){rafId=0;if(!visible||document.hidden)return;if(lowPower && now-lastDraw<31){startLoop();return}lastDraw=now;elapsed+=.01;let p=Math.max(0,Math.min(1,progress));let f=ease(Math.min(1,p/.23)),s=ease(Math.max(0,Math.min(1,(p-.18)/.23))),m=ease(Math.max(0,Math.min(1,(p-.37)/.24))),d=ease(Math.max(0,Math.min(1,(p-.56)/.28)));
foundation.scale.y=.001+f*.999;structure.scale.y=.001+s*.999;finishes.scale.y=.001+m*.999;details.scale.y=.001+d*.999;
foundation.visible=f>.003;structure.visible=s>.003;finishes.visible=m>.003;details.visible=d>.003;
wire.visible=p<.57;guideMat.opacity=Math.min(.86,Math.max(0,(.57-p)/.32));
root.rotation.y=smooth(root.rotation.y,(-.09+p*.25)+pointerX*.20,.045);
currentX=smooth(currentX,13-p*5+pointerX,.045);currentY=smooth(currentY,9-p*1.8-pointerY,.045);currentZ=smooth(currentZ,15+p*1.1,.045);camera.position.set(currentX,currentY,currentZ);camera.lookAt(.35,2.2,0);
renderer.render(scene,camera);startLoop()}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)startLoop()});
function resize(){const w=host.clientWidth,h=host.clientHeight||480;if(!w||!h)return;camera.aspect=w/h;camera.fov=w<700?46:36;camera.updateProjectionMatrix();renderer.setSize(w,h,false);renderer.setPixelRatio(Math.min(devicePixelRatio||1,w<700?1.05:1.35))}
window.addEventListener('resize',resize,{passive:true});resize();startLoop();
