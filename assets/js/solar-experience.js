import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
import {EffectComposer} from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/postprocessing/UnrealBloomPass.js';
const host=document.getElementById('codex-solar-stage');
if(host){
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const scene=new THREE.Scene();scene.background=new THREE.Color(0x02040d);
const camera=new THREE.PerspectiveCamera(47,1,.1,1400);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance',alpha:false});
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
host.appendChild(renderer.domElement);
const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));
const bloom=new UnrealBloomPass(new THREE.Vector2(1024,768),.37,.32,.92);composer.addPass(bloom);
const cameraTarget=new THREE.Vector3(),cameraTargetGoal=new THREE.Vector3();
let focusBody=null,focusUntil=0;
const ray=new THREE.Raycaster(),mouse=new THREE.Vector2(-10,-10),clock=new THREE.Clock();
let elapsed=0,active=false,frame=0,paused=false,dragging=false,dragX=0,dragY=0,azimuth=.14,elevation=.49,zoom=115,quality=1,selected=null,lastPointer=0,labelsShown=false;
const tip=document.getElementById('codex-solar-tip'),status=document.getElementById('codex-solar-status');
const sunLight=new THREE.PointLight(0xffd3a1,2200,420,1.45);scene.add(sunLight);scene.add(new THREE.AmbientLight(0x9ba8cf,.65));scene.add(new THREE.HemisphereLight(0xc2d5ff,0x24202e,.23));
const rand=(a,b)=>a+Math.random()*(b-a),TAU=Math.PI*2;
// GPU procedural planet surfaces: seamless 3D noise, per-pixel solar lighting.
const planetVertex=`varying vec3 vWorld;varying vec3 vNormal;varying vec3 vLocal;void main(){vLocal=position;vec4 w=modelMatrix*vec4(position,1.);vWorld=w.xyz;vNormal=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*w;}`;
const planetFragment=`
precision highp float;
varying vec3 vWorld;varying vec3 vNormal;varying vec3 vLocal;
uniform float type;uniform float seed;uniform float time;
float hash(vec3 p){p=fract(p*.3183099+.13);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float v=0.,amp=.52;for(int i=0;i<5;i++){v+=amp*noise(p);p=p*2.07+vec3(8.2,3.1,5.7);amp*=.49;}return v;}
vec3 surface(vec3 p,float n){
float lat=p.y;float bands=sin(lat*45.+fbm(p*5.)*8.)*.5+.5;
if(type<.5){float cr=pow(1.-abs(sin(fbm(p*17.)*19.)),7.);return mix(vec3(.16,.16,.17),vec3(.63,.57,.49),clamp(n*.9+cr*.15,0.,1.));}
if(type<1.5){float sw=fbm(p*9.+vec3(time*.007,0.,0.));return mix(vec3(.45,.27,.12),vec3(.96,.84,.59),smoothstep(.24,.77,sw));}
if(type<2.5){float continents=fbm(p*4.5+seed);float land=smoothstep(.48,.55,continents);float ice=smoothstep(.81,.94,abs(lat));vec3 ocean=mix(vec3(.008,.045,.17),vec3(.015,.29,.45),n);vec3 ground=mix(vec3(.13,.20,.07),vec3(.56,.48,.26),fbm(p*18.));vec3 c=mix(ocean,ground,land);float clouds=smoothstep(.64,.76,fbm(p*13.+vec3(time*.009,0.,0.)));return mix(mix(c,vec3(.88,.94,.98),clouds*.8),vec3(.87,.93,.97),ice);}
if(type<3.5){float polar=smoothstep(.81,.95,abs(lat));return mix(mix(vec3(.22,.065,.035),vec3(.72,.29,.12),n),vec3(.87,.83,.74),polar);}
if(type<5.5){float swirl=fbm(p*6.+vec3(lat*13.,0.,0.));float stripes=sin(lat*58.+swirl*11.)*.5+.5;float fine=sin(lat*170.+swirl*20.)*.5+.5;vec3 dark=type<4.5?vec3(.37,.19,.11):vec3(.51,.40,.29);vec3 light=type<4.5?vec3(.91,.76,.58):vec3(.92,.82,.63);return mix(dark,light,clamp(stripes*.75+fine*.13+n*.15,0.,1.));}
if(type<6.5)return mix(vec3(.12,.47,.52),vec3(.63,.88,.85),bands*.23+n*.65);
return mix(vec3(.015,.055,.27),vec3(.14,.37,.88),bands*.26+n*.63);
}
void main(){
vec3 p=normalize(vLocal);float n=fbm(p*7.+seed);vec3 c=surface(p,n);
vec3 N=normalize(vNormal);vec3 lightDir=normalize(-vWorld);
float diffuse=dot(N,lightDir);
float atmosphere=step(1.5,type)*(1.-step(2.5,type))+step(5.5,type);
float day=smoothstep(-.13,.20,diffuse);
float lighting=mix(.025+.975*max(diffuse,0.),.07+.93*day*max(diffuse,.16),min(atmosphere,1.));
float rough=fbm(p*31.+seed);lighting*=.89+.18*rough;
if(type<.5|| (type>2.5&&type<3.5)){float height=fbm(p*19.+seed);vec3 dpdx=dFdx(p),dpdy=dFdy(p);float hx=dFdx(height),hy=dFdy(height);vec3 perturbed=normalize(N-(hx*dpdx+hy*dpdy)*1.7);lighting*=.65+.35*max(dot(perturbed,lightDir),0.);}
if(type>1.5&&type<2.5){float water=1.-smoothstep(.48,.55,fbm(p*4.5+seed));vec3 viewDir=normalize(cameraPosition-vWorld);float spec=pow(max(dot(reflect(-lightDir,N),viewDir),0.),45.);c+=vec3(.75,.9,1.)*spec*water*day*.65;float city=step(.73,fbm(p*45.+seed))*step(diffuse,-.06);c+=vec3(1.,.54,.18)*city*.12;}
float fresnel=pow(1.-abs(dot(N,normalize(cameraPosition-vWorld))),3.);
if(type>1.5&&type<2.5)c+=vec3(.06,.24,.55)*fresnel*day;
gl_FragColor=vec4(c*lighting,1.);
}`;
function planetMaterial(kind,seed){const kinds={mercury:0,venus:1,earth:2,mars:3,jupiter:4,saturn:5,uranus:6,neptune:7};return new THREE.ShaderMaterial({vertexShader:planetVertex,fragmentShader:planetFragment,uniforms:{type:{value:kinds[kind]??0},seed:{value:seed*3.71+.31},time:{value:0}}});}
const sun=new THREE.Mesh(new THREE.SphereGeometry(7.5,96,64),new THREE.ShaderMaterial({
uniforms:{time:{value:0}},vertexShader:`varying vec3 vP;varying vec3 vN;void main(){vP=position;vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
fragmentShader:`varying vec3 vP;varying vec3 vN;uniform float time;
float hash(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
void main(){vec3 p=normalize(vP);vec3 flow=p*6.+vec3(time*.065,-time*.032,time*.018);float n=noise(flow)*.55+noise(flow*2.8)*.3+noise(flow*7.)*.15;float v=smoothstep(.25,.85,n);vec3 c=mix(vec3(.79,.085,.012),vec3(1.,.42,.035),v);c=mix(c,vec3(1.,.93,.48),smoothstep(.52,.88,n));float rim=pow(1.-max(dot(normalize(vN),vec3(0,0,1)),0.),2.);c+=vec3(.25,.11,.01)*rim;gl_FragColor=vec4(c,1.);}`
}));scene.add(sun);
function glow(size,color,alpha){const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d'),g=ctx.createRadialGradient(128,128,1,128,128,128);g.addColorStop(0,'rgba(255,255,255,.9)');g.addColorStop(.1,color);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(0,0,256,256);const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,opacity:alpha,blending:THREE.AdditiveBlending,depthWrite:false}));sp.scale.set(size,size,1);return sp}
const corona=glow(85,'rgba(255,119,32,.45)',.72);scene.add(corona);const innerGlow=glow(36,'rgba(255,201,88,.62)',.78);scene.add(innerGlow);
const bodies=[],pickables=[];
const items=[['Mercure','mercury',12,.78,.26],['Vénus','venus',17,1.45,.2],['Terre','earth',23,1.7,.16],['Mars','mars',30,1.2,.13],['Jupiter','jupiter',40,3.8,.085],['Saturne','saturn',52,3.4,.065],['Uranus','uranus',64,2.4,.048],['Neptune','neptune',76,2.3,.036]];
const destinations={'Vénus':['Blog','blog/blog.html'],'Terre':['Codex','codex.html'],'Mars':['Atelier','atelier/atelier.html'],'Jupiter':['Lab','lab/index.html'],'Saturne':['DashB','dashb/index.html'],'Neptune':['Profil','profil/index.html']};
for(const [i,[name,kind,dist,r,speed]] of items.entries()){
const pts=[];for(let k=0;k<=200;k++){const a=k/200*TAU;pts.push(new THREE.Vector3(Math.cos(a)*dist,0,Math.sin(a)*dist*.78))}
scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0x9b8190,transparent:true,opacity:.19})));
const pivot=new THREE.Group();scene.add(pivot);
const sphere=new THREE.Mesh(new THREE.SphereGeometry(r,128,96),planetMaterial(kind,i));
sphere.position.x=dist;pivot.add(sphere);
if(kind==='earth'||kind==='venus'||kind==='mars'||kind==='uranus'||kind==='neptune'){
 const col=kind==='earth'?0x4b9dff:kind==='venus'?0xe5b77e:kind==='mars'?0xcc6945:kind==='uranus'?0x8ee2db:0x346aff;
 const atmo=new THREE.Mesh(new THREE.SphereGeometry(r*1.065,48,32),new THREE.ShaderMaterial({
 uniforms:{color:{value:new THREE.Color(col)}},vertexShader:`varying vec3 n;varying vec3 eye;void main(){vec4 v=modelViewMatrix*vec4(position,1.);n=normalize(normalMatrix*normal);eye=normalize(-v.xyz);gl_Position=projectionMatrix*v;}`,
 fragmentShader:`uniform vec3 color;varying vec3 n;varying vec3 eye;void main(){float rim=pow(1.-abs(dot(normalize(n),normalize(eye))),3.2);gl_FragColor=vec4(color,rim*.48);}`,
 transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.FrontSide
 }));sphere.add(atmo);
}sphere.userData={name,destination:destinations[name]};pickables.push(sphere);
if(kind==='saturn'||kind==='uranus'){const ring=new THREE.Mesh(new THREE.RingGeometry(r*1.45,r*(kind==='saturn'?2.4:1.85),128),new THREE.ShaderMaterial({side:THREE.DoubleSide,transparent:true,depthWrite:false,
 uniforms:{inner:{value:r*1.45},outer:{value:r*(kind==='saturn'?2.4:1.85)},base:{value:new THREE.Color(kind==='saturn'?0xcbb28c:0x9cd5df)}},
 vertexShader:`varying vec3 p;void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
 fragmentShader:`varying vec3 p;uniform float inner;uniform float outer;uniform vec3 base;void main(){float t=clamp((length(p.xy)-inner)/(outer-inner),0.,1.);float bands=sin(t*95.)*.19+sin(t*210.)*.1+sin(t*28.)*.2;float fade=smoothstep(0.,.1,t)*(1.-smoothstep(.83,1.,t));gl_FragColor=vec4(base*(.72+bands),fade*(.48+bands));}`
 }));ring.rotation.x=1.13;sphere.add(ring)}
if(kind==='earth'||kind==='jupiter'||kind==='saturn'){const moon=new THREE.Mesh(new THREE.SphereGeometry(.23,12,10),new THREE.MeshStandardMaterial({color:0xb4b4ae}));pivot.add(moon);bodies.push({pivot,sphere,moon,dist,r,speed,phase:i*2.37})}
else bodies.push({pivot,sphere,dist,r,speed,phase:i*2.37});
}
function particles(n,min,max,color,size){const pts=[];for(let i=0;i<n;i++){let a=rand(0,TAU),r=rand(min,max);pts.push(Math.cos(a)*r,rand(-.55,.55),Math.sin(a)*r*.78)}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));scene.add(new THREE.Points(geo,new THREE.PointsMaterial({color,size,transparent:true,opacity:.7,sizeAttenuation:true})))}
particles(4000,33,36,0xb8a18c,.085);particles(2400,83,99,0x7f9bb9,.095);
const starPts=[],starColors=[];for(let i=0;i<2400;i++){const a=rand(0,TAU),u=rand(-1,1),r=rand(250,700),f=Math.sqrt(1-u*u);starPts.push(r*f*Math.cos(a),r*u,r*f*Math.sin(a));const c=new THREE.Color().setHSL(Math.random()<.14?.09:rand(.52,.68),rand(.07,.42),rand(.7,.97));starColors.push(c.r,c.g,c.b)}
// A broad, softly colored galactic band: layered distant stars with depth.
const galaxyP=[],galaxyC=[];
for(let i=0;i<4500;i++){
 const a=rand(0,TAU),latitude=(Math.random()+Math.random()+Math.random()-1.5)*.17;
 const rad=rand(380,640),ca=Math.cos(latitude),sa=Math.sin(latitude);
 const x=rad*ca*Math.cos(a),y=rad*sa,z=rad*ca*Math.sin(a);
 // Incline the galactic plane relative to the planetary orbits.
 galaxyP.push(x,y*.68+z*.32,z*.94-y*.32);
 const c=new THREE.Color().setHSL(rand(.57,.74),rand(.15,.5),rand(.43,.86));
 galaxyC.push(c.r,c.g,c.b);
}
const galaxyGeo=new THREE.BufferGeometry();galaxyGeo.setAttribute('position',new THREE.Float32BufferAttribute(galaxyP,3));galaxyGeo.setAttribute('color',new THREE.Float32BufferAttribute(galaxyC,3));
scene.add(new THREE.Points(galaxyGeo,new THREE.PointsMaterial({vertexColors:true,size:.72,sizeAttenuation:false,transparent:true,opacity:.14,depthWrite:false,blending:THREE.AdditiveBlending})));
const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(starPts,3));sg.setAttribute('color',new THREE.Float32BufferAttribute(starColors,3));scene.add(new THREE.Points(sg,new THREE.PointsMaterial({vertexColors:true,size:1.25,sizeAttenuation:false,transparent:true,opacity:.58,depthWrite:false})));
function updateSize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.fov=w<700?64:47;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio,host.clientWidth<700?1.4:1.8));renderer.setSize(w,h,false);composer.setSize(w,h);bloom.resolution.set(w,h)}
function updateTheme(){const yes=document.body.classList.contains('theme-solaire');if(yes===active)return;active=yes;document.documentElement.classList.toggle('codex-solar-active',active);if(active){updateSize();clock.getDelta();run()}else cancelAnimationFrame(frame)}
function cameraPosition(){const w=host.clientWidth;const radius=w<700?Math.max(125,zoom):zoom;camera.position.set(Math.sin(azimuth)*radius*Math.cos(elevation),Math.sin(elevation)*radius,Math.cos(azimuth)*radius*Math.cos(elevation));camera.position.add(cameraTarget);camera.lookAt(cameraTarget)}
function run(){if(!active||document.hidden)return;frame=requestAnimationFrame(run);const delta=Math.min(clock.getDelta(),.05);if(!paused&&!reduced.matches)elapsed+=delta;sun.material.uniforms.time.value=elapsed;for(const b of bodies){b.pivot.rotation.y=b.phase+elapsed*b.speed*.5;b.sphere.rotation.y+=paused||reduced.matches?0:delta*.13;b.sphere.material.uniforms.time.value=elapsed;if(b.moon){const a=elapsed*.22+b.phase;b.moon.position.set(b.dist+Math.cos(a)*b.r*2.5,.1,Math.sin(a)*b.r*2.5)}}cameraTargetGoal.set(0,0,0);if(focusBody&&performance.now()<focusUntil){focusBody.getWorldPosition(cameraTargetGoal)}else focusBody=null;cameraTarget.lerp(cameraTargetGoal,Math.min(1,delta*2.4));cameraPosition();composer.render()}
function showTip(e){const r=renderer.domElement.getBoundingClientRect();mouse.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(mouse,camera);const hits=ray.intersectObjects(pickables);selected=hits.length?hits[0].object:null;if(selected){const d=selected.userData;tip.textContent=d.name+(d.destination?' · '+d.destination[0]:'');tip.style.left=Math.min(innerWidth-175,e.clientX+14)+'px';tip.style.top=Math.max(70,e.clientY-30)+'px';tip.hidden=false}else tip.hidden=true}
renderer.domElement.addEventListener('pointerdown',e=>{dragging=true;dragX=e.clientX;dragY=e.clientY;lastPointer=performance.now();renderer.domElement.setPointerCapture(e.pointerId)});
renderer.domElement.addEventListener('pointermove',e=>{if(dragging){const dx=e.clientX-dragX,dy=e.clientY-dragY;azimuth-=dx*.006;elevation=Math.max(-.04,Math.min(1.35,elevation+dy*.004));dragX=e.clientX;dragY=e.clientY;tip.hidden=true}else showTip(e)});
renderer.domElement.addEventListener('pointerup',e=>{dragging=false;if(performance.now()-lastPointer<320){showTip(e);if(selected){focusBody=selected;focusUntil=performance.now()+8500;zoom=Math.max(27,Math.min(zoom,selected.geometry.parameters.radius*9+20));const d=selected.userData;status.textContent=d.destination?d.name+' · '+d.destination[0]+' — toucher à nouveau pour ouvrir':d.name+' — exploration';if(d.destination&&selected===window.__codexLastSelection&&performance.now()-window.__codexLastTime<2500)location.href=d.destination[1];window.__codexLastSelection=selected;window.__codexLastTime=performance.now()}}});
let pinchDistance=0;
renderer.domElement.addEventListener('touchmove',e=>{if(e.touches.length===2){const a=e.touches[0],b=e.touches[1],d=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);if(pinchDistance)zoom=Math.max(18,Math.min(185,zoom+(pinchDistance-d)*.12));pinchDistance=d;}},{passive:true});
renderer.domElement.addEventListener('touchend',()=>pinchDistance=0);
renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(65,Math.min(185,zoom+e.deltaY*.075))},{passive:false});
document.getElementById('codex-solar-pause').onclick=e=>{paused=!paused;e.currentTarget.textContent=paused?'Reprendre':'Pause'};
document.getElementById('codex-solar-reset').onclick=()=>{focusBody=null;focusUntil=0;zoom=115;azimuth=.14;elevation=.49;status.textContent='Touchez une planète pour l’explorer'};
document.getElementById('codex-solar-nav').onclick=e=>{labelsShown=!labelsShown;document.getElementById('codex-solar-links').hidden=!labelsShown;e.currentTarget.setAttribute('aria-expanded',String(labelsShown))};
const observer=new MutationObserver(updateTheme);observer.observe(document.body,{attributes:true,attributeFilter:['class']});new ResizeObserver(updateSize).observe(host);
document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(frame);if(active&&!document.hidden){clock.getDelta();run()}});
const media=matchMedia('(max-width:700px)');media.addEventListener('change',updateSize);
renderer.setAnimationLoop(null);
updateTheme();
}
