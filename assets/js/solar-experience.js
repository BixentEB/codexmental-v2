import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
const host=document.getElementById('codex-solar-stage');
if(host){
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const scene=new THREE.Scene();scene.background=new THREE.Color(0x02040d);
const camera=new THREE.PerspectiveCamera(47,1,.1,1400);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance',alpha:false});
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
host.appendChild(renderer.domElement);
const ray=new THREE.Raycaster(),mouse=new THREE.Vector2(-10,-10),clock=new THREE.Clock();
let elapsed=0,active=false,frame=0,paused=false,dragging=false,dragX=0,dragY=0,azimuth=.14,elevation=.49,zoom=115,quality=1,selected=null,lastPointer=0,labelsShown=false;
const tip=document.getElementById('codex-solar-tip'),status=document.getElementById('codex-solar-status');
const sunLight=new THREE.PointLight(0xffd3a1,2200,420,1.45);scene.add(sunLight);scene.add(new THREE.AmbientLight(0x9ba8cf,.65));scene.add(new THREE.HemisphereLight(0xc2d5ff,0x24202e,.55));
const rand=(a,b)=>a+Math.random()*(b-a),TAU=Math.PI*2;
function tex(kind,seed){const c=document.createElement('canvas');c.width=1024;c.height=512;const ctx=c.getContext('2d'),im=ctx.createImageData(c.width,c.height),d=im.data;
for(let y=0;y<512;y++)for(let x=0;x<1024;x++){let n=(Math.sin(x*.045+Math.sin(y*.07+seed)*2)*Math.cos(y*.083)+Math.sin(x*.12+y*.031+seed)*.35+Math.sin(x*.016-y*.055)*.5)*.22+.5;let stripe=Math.sin(y*.37+Math.sin(x*.014)*3+seed)*.16;let r,g,b;
if(kind==='earth'){const ice=Math.abs(y/512-.5)>.42,land=n>.51;if(ice){r=215;g=223;b=226}else if(land){r=40+120*n;g=60+110*n;b=28+60*n}else{r=10+35*n;g=42+80*n;b=95+110*n}}
else if(kind==='jupiter'){r=156+75*n+stripe*70;g=103+80*n+stripe*55;b=70+70*n+stripe*50}
else if(kind==='saturn'){r=176+60*n+stripe*45;g=150+62*n+stripe*43;b=112+50*n+stripe*36}
else if(kind==='mars'){r=116+118*n;g=48+66*n;b=29+39*n}
else if(kind==='venus'){r=157+69*n;g=124+67*n;b=78+55*n}
else if(kind==='uranus'){r=67+45*n;g=151+67*n;b=172+65*n}
else if(kind==='neptune'){r=25+38*n;g=65+59*n;b=151+85*n}
else{r=75+110*n;g=74+99*n;b=70+90*n}
const i=(y*1024+x)*4;d[i]=r;d[i+1]=g;d[i+2]=b;d[i+3]=255}ctx.putImageData(im,0,0);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
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
const sphere=new THREE.Mesh(new THREE.SphereGeometry(r,48,32),new THREE.MeshStandardMaterial({map:tex(kind,i),roughness:1}));
sphere.position.x=dist;pivot.add(sphere);sphere.userData={name,destination:destinations[name]};pickables.push(sphere);
if(kind==='saturn'||kind==='uranus'){const ring=new THREE.Mesh(new THREE.RingGeometry(r*1.45,r*(kind==='saturn'?2.4:1.85),128),new THREE.MeshBasicMaterial({color:kind==='saturn'?0xc4ac8c:0xa1cad0,side:THREE.DoubleSide,transparent:true,opacity:.65,depthWrite:false}));ring.rotation.x=1.13;sphere.add(ring)}
if(kind==='earth'||kind==='jupiter'||kind==='saturn'){const moon=new THREE.Mesh(new THREE.SphereGeometry(.23,12,10),new THREE.MeshStandardMaterial({color:0xb4b4ae}));pivot.add(moon);bodies.push({pivot,sphere,moon,dist,r,speed,phase:i*2.37})}
else bodies.push({pivot,sphere,dist,r,speed,phase:i*2.37});
}
function particles(n,min,max,color,size){const pts=[];for(let i=0;i<n;i++){let a=rand(0,TAU),r=rand(min,max);pts.push(Math.cos(a)*r,rand(-.55,.55),Math.sin(a)*r*.78)}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));scene.add(new THREE.Points(geo,new THREE.PointsMaterial({color,size,transparent:true,opacity:.7,sizeAttenuation:true})))}
particles(4000,33,36,0xb8a18c,.085);particles(2400,83,99,0x7f9bb9,.095);
const starPts=[],starColors=[];for(let i=0;i<5600;i++){const a=rand(0,TAU),u=rand(-1,1),r=rand(250,700),f=Math.sqrt(1-u*u);starPts.push(r*f*Math.cos(a),r*u,r*f*Math.sin(a));const c=new THREE.Color().setHSL(Math.random()<.14?.09:rand(.52,.68),rand(.07,.42),rand(.7,.97));starColors.push(c.r,c.g,c.b)}
const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(starPts,3));sg.setAttribute('color',new THREE.Float32BufferAttribute(starColors,3));scene.add(new THREE.Points(sg,new THREE.PointsMaterial({vertexColors:true,size:1.25,sizeAttenuation:false,transparent:true,opacity:.8,depthWrite:false})));
function updateSize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.fov=w<700?64:47;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio,host.clientWidth<700?1.4:1.8));renderer.setSize(w,h,false)}
function updateTheme(){const yes=document.body.classList.contains('theme-solaire');if(yes===active)return;active=yes;document.documentElement.classList.toggle('codex-solar-active',active);if(active){updateSize();clock.getDelta();run()}else cancelAnimationFrame(frame)}
function cameraPosition(){const w=host.clientWidth;const radius=w<700?Math.max(125,zoom):zoom;camera.position.set(Math.sin(azimuth)*radius*Math.cos(elevation),Math.sin(elevation)*radius,Math.cos(azimuth)*radius*Math.cos(elevation));camera.lookAt(0,0,0)}
function run(){if(!active||document.hidden)return;frame=requestAnimationFrame(run);const delta=Math.min(clock.getDelta(),.05);if(!paused&&!reduced.matches)elapsed+=delta;sun.material.uniforms.time.value=elapsed;for(const b of bodies){b.pivot.rotation.y=b.phase+elapsed*b.speed*.5;b.sphere.rotation.y+=paused||reduced.matches?0:delta*.13;if(b.moon){const a=elapsed*.22+b.phase;b.moon.position.set(b.dist+Math.cos(a)*b.r*2.5,.1,Math.sin(a)*b.r*2.5)}}cameraPosition();renderer.render(scene,camera)}
function showTip(e){const r=renderer.domElement.getBoundingClientRect();mouse.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(mouse,camera);const hits=ray.intersectObjects(pickables);selected=hits.length?hits[0].object:null;if(selected){const d=selected.userData;tip.textContent=d.name+(d.destination?' · '+d.destination[0]:'');tip.style.left=Math.min(innerWidth-175,e.clientX+14)+'px';tip.style.top=Math.max(70,e.clientY-30)+'px';tip.hidden=false}else tip.hidden=true}
renderer.domElement.addEventListener('pointerdown',e=>{dragging=true;dragX=e.clientX;dragY=e.clientY;lastPointer=performance.now();renderer.domElement.setPointerCapture(e.pointerId)});
renderer.domElement.addEventListener('pointermove',e=>{if(dragging){const dx=e.clientX-dragX,dy=e.clientY-dragY;azimuth-=dx*.006;elevation=Math.max(-.04,Math.min(1.35,elevation+dy*.004));dragX=e.clientX;dragY=e.clientY;tip.hidden=true}else showTip(e)});
renderer.domElement.addEventListener('pointerup',e=>{dragging=false;if(performance.now()-lastPointer<320){showTip(e);if(selected){const d=selected.userData;status.textContent=d.destination?d.name+' · '+d.destination[0]+' — toucher à nouveau pour ouvrir':d.name+' — exploration';if(d.destination&&selected===window.__codexLastSelection&&performance.now()-window.__codexLastTime<2500)location.href=d.destination[1];window.__codexLastSelection=selected;window.__codexLastTime=performance.now()}}});
renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(65,Math.min(185,zoom+e.deltaY*.075))},{passive:false});
document.getElementById('codex-solar-pause').onclick=e=>{paused=!paused;e.currentTarget.textContent=paused?'Reprendre':'Pause'};
document.getElementById('codex-solar-reset').onclick=()=>{zoom=115;azimuth=.14;elevation=.49;status.textContent='Touchez une planète pour l’explorer'};
document.getElementById('codex-solar-nav').onclick=e=>{labelsShown=!labelsShown;document.getElementById('codex-solar-links').hidden=!labelsShown;e.currentTarget.setAttribute('aria-expanded',String(labelsShown))};
const observer=new MutationObserver(updateTheme);observer.observe(document.body,{attributes:true,attributeFilter:['class']});new ResizeObserver(updateSize).observe(host);
document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(frame);if(active&&!document.hidden){clock.getDelta();run()}});
const media=matchMedia('(max-width:700px)');media.addEventListener('change',updateSize);
renderer.setAnimationLoop(null);
updateTheme();
}
