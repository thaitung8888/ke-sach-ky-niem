// CĂN PHÒNG 3D (sảnh chính #/phong): dựng lại đúng căn phòng 2D bằng Three.js r128, theo phong cách tiệm 15 Xóm Lẻ (dự án xom-le-15):
// tường bê tông, sàn terrazzo, trần lam gỗ, đèn ray rọi, đêm tím · vàng, thảm tròn in logo, tường graffiti.
// Giữ nguyên bố cục và chức năng của phòng 2D: kệ sách, bàn làm việc, lịch tập, tủ đồ, công tắc đèn, cửa sổ.
// Máy không có WebGL hoặc không tải được Three.js thì phòng 2D (room.js · drawRoom) vẫn chạy như cũ.
const R3={st:'idle',p:null,W:null};   // st: idle | loading | ready | fail
const R3URL='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
const R3C={purple:'#3b2ca6',yellow:'#ffc700',ivory:'#f7f1e6',ink:'#1c1640',lilac:'#9a8cff',wood:'#8a6040'};
// Kích thước phòng (mét): x trái → phải, y sàn → trần, z tường sau → phía người xem
const RX=3.5,RZB=-2.5,RZF=2.5,R3H=3;
const r3Supported=()=>{try{const c=document.createElement('canvas');return!!(c.getContext('webgl2')||c.getContext('webgl'))}catch(e){return false}};
const r3Small=()=>Math.min(innerWidth,innerHeight)<700;
function r3Load(){if(R3.p)return R3.p;R3.st='loading';
 const lib=window.THREE?Promise.resolve():new Promise((ok,no)=>{const s=document.createElement('script');s.src=R3URL;s.onload=ok;s.onerror=()=>no(new Error('Không tải được Three.js'));document.head.append(s)});
 const fonts=document.fonts&&document.fonts.load?Promise.all(['900 60px Montserrat','800 40px Montserrat','italic 900 60px Montserrat','700 30px "Be Vietnam Pro"'].map(f=>document.fonts.load(f))).catch(()=>{}):null;
 return R3.p=Promise.all([lib,fonts]).then(()=>{R3.W=r3Build();R3.st='ready'}).catch(e=>{console.warn(e);R3.st='fail';throw e})}

// ---------- tiện ích vẽ (chép cách làm từ xom-le-15: textures/canvas.js, helpers.js, random.js) ----------
function r3rng(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
let RN=r3rng(15);const rr=(a,b)=>a+RN()*(b-a),rpick=a=>a[Math.floor(RN()*a.length)];
function r3grime(g,w,h,n,l=.05,d=.08,m=.03){for(let i=0;i<n;i++){const r=RN()*RN()*w*m+.6;g.fillStyle=RN()<.5?`rgba(255,255,255,${RN()*l})`:`rgba(0,0,0,${RN()*d})`;g.beginPath();g.arc(RN()*w,RN()*h,r,0,7);g.fill()}}
function r3streaks(g,w,h,n,a=.12){for(let i=0;i<n;i++){const x=RN()*w,y=RN()*h*.6,len=rr(h*.1,h*.5),gr=g.createLinearGradient(0,y,0,y+len);
 gr.addColorStop(0,`rgba(30,24,15,${a})`);gr.addColorStop(1,'rgba(30,24,15,0)');g.fillStyle=gr;g.fillRect(x,y,rr(2,10),len)}}

function r3Build(){const T=THREE,small=r3Small();RN=r3rng(15);
 const el=document.createElement('div');el.className='r3';
 el.innerHTML=`<div class="otag" id="r3tag"></div><div class="r3keys" id="r3keys"></div>`;
 const renderer=new T.WebGLRenderer({antialias:devicePixelRatio<2,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,small?1.4:1.75));renderer.outputEncoding=T.sRGBEncoding;
 renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.shadowMap.enabled=!small;renderer.shadowMap.type=T.PCFSoftShadowMap;
 el.prepend(renderer.domElement);
 const scene=new T.Scene(),night=new T.Color('#0f0e18');scene.background=night;scene.fog=new T.FogExp2(night,.035);
 const camera=new T.PerspectiveCamera(46,16/9,.05,60),aniso=renderer.capabilities.getMaxAnisotropy();
 const W={T,el,renderer,scene,camera,picks:{},frame:[],anims:[],main:[],dyn:{}};

 // ---- vật liệu và hình khối ----
 const mats={};
 const std=(c,r=.8,m=0,x={})=>{const plain=!Object.keys(x).length,k=c+'|'+r+'|'+m;if(plain&&mats[k])return mats[k];const M=new T.MeshStandardMaterial(Object.assign({color:c,roughness:r,metalness:m},x));if(plain)mats[k]=M;return M};
 const glow=(c,i=1.6)=>{const M=new T.MeshStandardMaterial({color:'#000',emissive:c,emissiveIntensity:i});M.userData.glow=1;return M};
 const box=(w,h,d,M,x,y,z,p=scene)=>{const m=new T.Mesh(new T.BoxGeometry(w,h,d),M);m.position.set(x,y,z);m.castShadow=m.receiveShadow=!small;p.add(m);return m};
 const plane=(w,h,M,x,y,z,ry=0,p=scene)=>{const m=new T.Mesh(new T.PlaneGeometry(w,h),M);m.position.set(x,y,z);m.rotation.y=ry;m.receiveShadow=!small;p.add(m);return m};
 const ctex=(w,h,draw,o={})=>{const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);
  if(!o.linear)t.encoding=T.sRGBEncoding;t.anisotropy=aniso;if(o.rep){t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(o.rep[0],o.rep[1])}return t};
 const radial=(inner,outer='rgba(0,0,0,0)')=>ctex(128,128,(g,w,h)=>{const gr=g.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);gr.addColorStop(0,inner);gr.addColorStop(1,outer);g.fillStyle=gr;g.fillRect(0,0,w,h)});
 const add=(M)=>Object.assign(M,{transparent:true,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false});
 const pool=(x,y,z,ry,w,h,o,c='rgba(255,214,160,1)',p=scene)=>{const m=new T.Mesh(new T.PlaneGeometry(w,h),add(new T.MeshBasicMaterial({map:radial(c),opacity:o})));m.position.set(x,y,z);m.rotation.y=ry;p.add(m);return m};
 const halo=(c,s,x,y,z,o=.6)=>{const sp=new T.Sprite(add(new T.SpriteMaterial({map:radial(c),opacity:o})));sp.scale.set(s,s,1);sp.position.set(x,y,z);scene.add(sp);return sp};
 W.std=std;W.box=box;W.ctex=ctex;

 // ---- texture dùng chung: bê tông, terrazzo (chép từ xom-le-15 · textures/shared.js) ----
 const concrete=()=>ctex(1024,512,(g,w,h)=>{g.fillStyle='#8c8984';g.fillRect(0,0,w,h);
  for(let y=0;y<h;y+=32){g.fillStyle=`rgba(${RN()<.5?'255,255,255':'0,0,0'},${RN()*.05})`;g.fillRect(0,y,w,32)}
  r3grime(g,w,h,1800,.05,.07,.02);g.strokeStyle='rgba(0,0,0,.2)';g.lineWidth=2;g.strokeRect(1,1,w-2,h-2);g.fillStyle='rgba(30,30,30,.5)';
  for(const fx of[.25,.75])for(const fy of[.25,.75]){g.beginPath();g.arc(fx*w,fy*h,9,0,7);g.fill()}r3streaks(g,w,h,6,.05)},{rep:[1,1]});
 const terrazzo=ctex(1024,1024,(g,w,h)=>{g.fillStyle='#b9b2a6';g.fillRect(0,0,w,h);const chips=['#4b3fae','#ffc700','#6d6a72','#e9e2d4','#2a2533','#8f86c9'];
  for(let i=0;i<5200;i++){g.fillStyle=rpick(chips);g.globalAlpha=rr(.6,1);g.beginPath();const x=RN()*w,y=RN()*h,r=RN()*RN()*9+1.2;g.moveTo(x+r,y);
   for(let k=1;k<6;k++){const a=k/6*6.283,q=r*rr(.6,1.2);g.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q)}g.fill()}
  g.globalAlpha=1;r3grime(g,w,h,900,.05,.05,.02);g.strokeStyle='rgba(40,36,48,.55)';g.lineWidth=3;g.beginPath();g.moveTo(0,h/2);g.lineTo(w,h/2);g.moveTo(w/2,0);g.lineTo(w/2,h);g.stroke()},{rep:[3.5,3]});

 // ---------- vỏ phòng: sàn, tường, trần lam gỗ, khe đèn hắt, ray đèn ----------
 const fl=new T.Mesh(new T.PlaneGeometry(RX*2,RZF-RZB+1.5),new T.MeshStandardMaterial({map:terrazzo,roughness:.35,metalness:.05}));
 fl.rotation.x=-Math.PI/2;fl.position.set(0,0,(RZB+RZF+1.5)/2);fl.receiveShadow=!small;scene.add(fl);
 const ct=concrete();ct.repeat.set(RX*2/2.4,R3H/1.2);
 plane(RX*2,R3H,new T.MeshStandardMaterial({map:ct,roughness:.9,color:'#6a58f0'}),0,R3H/2,RZB);           // tường sau tím như tiệm
 const sideTex=concrete();sideTex.repeat.set((RZF-RZB)/2.4,R3H/1.2);const sideM=new T.MeshStandardMaterial({map:sideTex,roughness:.92,color:'#e6e1da'});
 plane(RZF-RZB,R3H,sideM,RX,R3H/2,(RZB+RZF)/2,-Math.PI/2);                                                 // tường phải (graffiti)
 // tường trái có ô cửa sổ: ghép 4 mảng quanh ô trống
 const WZ0=-1.15,WZ1=.85,WY0=.9,WY1=2.4,lw=(w,h,y,z)=>plane(w,h,sideM,-RX,y,z,Math.PI/2);
 lw(WZ0-RZB,R3H,R3H/2,(RZB+WZ0)/2);lw(RZF-WZ1,R3H,R3H/2,(WZ1+RZF)/2);lw(WZ1-WZ0,WY0,WY0/2,(WZ0+WZ1)/2);lw(WZ1-WZ0,R3H-WY1,(R3H+WY1)/2,(WZ0+WZ1)/2);
 const ceil=new T.Mesh(new T.PlaneGeometry(RX*2,RZF-RZB+1.5),std('#1b1820',.95));ceil.rotation.x=Math.PI/2;ceil.position.set(0,R3H,(RZB+RZF+1.5)/2);scene.add(ceil);
 {const n=Math.floor(RX*2/.14),si=new T.InstancedMesh(new T.BoxGeometry(.05,.08,RZF-RZB+1.4),std('#8a6040',.65),n),m4=new T.Matrix4();
  for(let i=0;i<n;i++){m4.makeTranslation(-RX+.07+i*.14,R3H-.12,(RZB+RZF+1.4)/2);si.setMatrixAt(i,m4)}scene.add(si)}
 const cove=glow('#ffd58a',1.6);W.cove=cove;
 box(RX*2-.1,.03,.03,cove,0,R3H-.24,RZB+.04);
 for(const s of[-1,1]){box(.03,.03,RZF-RZB,cove,s*(RX-.04),R3H-.24,(RZB+RZF)/2);box(.04,.12,RZF-RZB,std('#3a2d22',.6),s*(RX-.03),.06,(RZB+RZF)/2)}
 box(RX*2,.12,.04,std('#3a2d22',.6),0,.06,RZB+.03);
 // ray đèn rọi
 const railM=std('#121212',.4,.6),headM=std('#1b1b1b',.35,.7),lens=glow('#ffe2b5',2.2);
 for(const x of[-1.5,1.5]){box(.06,.05,RZF-RZB-.6,railM,x,R3H-.2,(RZB+RZF)/2);
  for(let z=RZB+.6;z<RZF-.4;z+=1.2){const hd=new T.Group();hd.position.set(x,R3H-.33,z);hd.add(new T.Mesh(new T.CylinderGeometry(.06,.07,.2,14),headM));
   const ln=new T.Mesh(new T.CircleGeometry(.055,14),lens);ln.rotation.x=Math.PI/2;ln.position.y=-.101;hd.add(ln);hd.rotation.z=x<0?.55:-.55;hd.rotation.x=z<0?-.35:.2;scene.add(hd)}}

 // ---------- ánh sáng: đêm tím · đèn vàng ấm ----------
 const hemi=new T.HemisphereLight('#6d6aa0','#20180f',.32);scene.add(hemi);W.main.push([hemi,.32]);
 const warm='#ffd8a6';
 [[0,2.7,.2,.8,9],[-2.1,2.7,-1.2,.45,5],[2.2,2.7,-1.1,.5,5]].forEach(([x,y,z,i,d])=>{const l=new T.PointLight(warm,i,d,1.4);l.position.set(x,y,z);scene.add(l);W.main.push([l,i])});
 const spot=(x,y,z,tx,ty,tz,i,ang,shadow)=>{const s=new T.SpotLight(warm,i,9,ang,.65,1.2);s.position.set(x,y,z);s.target.position.set(tx,ty,tz);scene.add(s,s.target);
  if(shadow&&!small){s.castShadow=true;s.shadow.mapSize.set(1024,1024);s.shadow.bias=-.0004;s.shadow.camera.near=.5;s.shadow.camera.far=8}W.main.push([s,i]);return s};
 spot(0,2.9,-.4,0,1.2,RZB,.85,.62,true);spot(1.5,2.85,.4,RX,1.3,-.3,1.1,.75,false);spot(-1.5,2.85,.2,-2.3,1,RZB,.9,.6,false);
 for(const z of[-1.6,-.4,.8])pool(RX-.02,1.6,z,-Math.PI/2,2.4,3,.2);
 pool(0,1.4,RZB+.02,0,3.2,3.2,.16,'rgba(255,214,120,1)');

 r3Furnish(W,{T,std,glow,box,plane,ctex,radial,add,pool,halo,small,WZ0,WZ1,WY0,WY1,warm});
 r3Interact(W);
 return W}

// ---------- đồ đạc ----------
function r3Furnish(W,K){const{T,std,glow,box,plane,ctex,radial,add,pool,halo,small,WZ0,WZ1,WY0,WY1,warm}=K,scene=W.scene,oak=std('#6e4a30',.55),blackM=std('#161418',.45,.6);
 const group=(id,x,y,z,o={})=>{const g=new T.Group();g.position.set(x,y,z);scene.add(g);if(id)W.picks[id]=Object.assign({g,id},o);return g};

 // ---- cửa sổ tường trái: khung kim loại đen, kính, trời đêm Hà Nội và trăng ----
 {const zc=(WZ0+WZ1)/2,yc=(WY0+WY1)/2,ww=WZ1-WZ0,wh=WY1-WY0,fm=std('#141216',.4,.5);
  for(const z of[WZ0,zc,WZ1])box(.08,wh+.06,.06,fm,-RX+.02,yc,z);
  for(const y of[WY0,yc,WY1])box(.08,.06,ww+.06,fm,-RX+.02,y,zc);box(.32,.04,ww+.16,std('#d9d2c4',.6),-RX+.14,WY0-.02,zc);
  const sky=ctex(1024,768,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#0b1230');gr.addColorStop(.7,'#2a3466');gr.addColorStop(1,'#3d3a6e');g.fillStyle=gr;g.fillRect(0,0,w,h);
   for(let i=0;i<220;i++){g.fillStyle=`rgba(255,255,255,${rr(.2,.9)})`;g.fillRect(RN()*w,RN()*h*.6,rr(1,2.4),rr(1,2.4))}
   const mx=w*.3,my=h*.22,mg=g.createRadialGradient(mx,my,0,mx,my,140);mg.addColorStop(0,'rgba(220,226,255,.55)');mg.addColorStop(1,'rgba(220,226,255,0)');g.fillStyle=mg;g.fillRect(0,0,w,h);
   g.fillStyle='#f3f0ff';g.beginPath();g.arc(mx,my,46,0,7);g.fill();g.fillStyle='rgba(180,180,220,.35)';g.beginPath();g.arc(mx+12,my-8,10,0,7);g.arc(mx-14,my+12,7,0,7);g.fill();
   // mái nhà phố cổ, cửa sổ sáng đèn vàng
   let x=0;while(x<w){const bw=rr(60,150),bh=rr(h*.18,h*.45),y=h-bh;g.fillStyle=rpick(['#14122a','#1a1733','#100e22']);g.fillRect(x,y,bw,bh);
    if(RN()<.5){g.beginPath();g.moveTo(x-6,y);g.lineTo(x+bw/2,y-rr(18,40));g.lineTo(x+bw+6,y);g.fill()}
    for(let wy=y+14;wy<h-10;wy+=26)for(let wx=x+10;wx<x+bw-14;wx+=22)if(RN()<.3){g.fillStyle=RN()<.7?'rgba(255,199,0,.85)':'rgba(154,140,255,.8)';g.fillRect(wx,wy,9,12)}x+=bw+rr(2,10)}});
  plane(ww*1.9,wh*1.7,new T.MeshBasicMaterial({map:sky,toneMapped:false}),-RX-1.1,yc+.15,zc,Math.PI/2);
  plane(ww,wh,new T.MeshStandardMaterial({color:'#9fb0ff',transparent:true,opacity:.08,roughness:.05,metalness:.2}),-RX+.01,yc,zc,Math.PI/2);
  const moon=new T.DirectionalLight('#9a8cff',.35);moon.position.set(-6,3.5,-.2);moon.target.position.set(0,0,-.2);scene.add(moon,moon.target);
  const lp=pool(-1.9,.012,zc,0,3.2,2.2,.22,'rgba(160,150,255,1)');lp.rotation.x=-Math.PI/2}

 // ---- kệ sách kỷ niệm (giữa tường sau) ----
 {const BW=1.9,BH=2.35,BD=.36,th=.04,rows=5,g=group('ke-sach',0,0,RZB+BD/2,{tag:[0,BH+.12,RZB+.2],view:{pos:[0,1.35,-.35],look:[0,1.2,RZB]}});
  box(th,BH,BD,oak,-BW/2+th/2,BH/2,0,g);box(th,BH,BD,oak,BW/2-th/2,BH/2,0,g);box(BW,th,BD,oak,0,BH-th/2,0,g);box(BW,.1,BD,std('#5a3f2a',.6),0,.05,0,g);
  box(BW-th*2,BH-.12,.02,std('#2e2440',.85),0,BH/2+.02,-BD/2+.01,g);
  const rh=(BH-.1-th)/rows;W.dyn.shelf={g,BW,BD,th,rows,rh,base:.1};
  for(let r=1;r<rows;r++){box(BW-th*2,.03,BD-.02,oak,0,.1+r*rh,.01,g)}
  for(let r=0;r<rows;r++){box(BW-th*2-.02,.012,.012,glow('#ffd58a',1.4),0,.1+(r+1)*rh-.03,BD/2-.05,g);pool(0,.1+r*rh+rh*.55,-BD/2+.03,0,BW*.9,rh*1.4,.11,'rgba(255,214,140,1)',g)}
  r3Books(W)}

 // ---- bàn làm việc (sắp ra mắt): mặt gỗ, chân sắt, màn hình, bàn phím, cốc, ghế ----
 {const g=group('ban',-2.3,0,RZB+.42,{tag:[-2.3,1.42,RZB+.4],view:{pos:[-2.3,1.3,-.8],look:[-2.3,.9,RZB]}});
  box(1.6,.04,.7,oak,0,.74,0,g);for(const sx of[-.75,.75])for(const sz of[-.3,.3])box(.035,.72,.035,blackM,sx,.36,sz,g);
  box(1.5,.03,.03,blackM,0,.12,-.3,g);
  const scr=ctex(640,384,(c,w,h)=>{c.fillStyle='#120f26';c.fillRect(0,0,w,h);const gr=c.createRadialGradient(w*.5,h*.45,10,w*.5,h*.45,w*.6);gr.addColorStop(0,'rgba(154,140,255,.35)');gr.addColorStop(1,'rgba(154,140,255,0)');c.fillStyle=gr;c.fillRect(0,0,w,h);
   drawRoundel(c,w*.28,h*.5,92,{line:R3C.yellow,mark:R3C.ivory});c.fillStyle=R3C.ivory;c.font='900 40px Montserrat,sans-serif';c.fillText('BÀN LÀM VIỆC',w*.47,h*.46);
   c.fillStyle=R3C.lilac;c.font='700 26px "Be Vietnam Pro",sans-serif';c.fillText('Sắp ra mắt',w*.47,h*.58);
   c.fillStyle='rgba(154,140,255,.35)';for(let i=0;i<6;i++)c.fillRect(w*.47,h*.66+i*14,rr(80,220),5)});
  box(.24,.015,.16,blackM,.05,.765,-.15,g);box(.035,.24,.035,blackM,.05,.88,-.18,g);
  const mon=box(.7,.42,.03,blackM,.05,1.18,-.2,g);plane(.66,.38,new T.MeshBasicMaterial({map:scr,toneMapped:false}),.05,1.18,-.184,0,g);mon.castShadow=false;
  const ml=new T.PointLight('#9a8cff',.4,1.8,1.6);ml.position.set(.05,1.15,.1);g.add(ml);
  box(.46,.018,.15,std('#2a2733',.6),.05,.77,.12,g);box(.06,.02,.1,std('#2a2733',.6),.42,.77,.14,g);
  const mug=new T.Mesh(new T.CylinderGeometry(.04,.036,.1,18),std(R3C.yellow,.5));mug.position.set(-.5,.81,.05);g.add(mug);
  const plantS=new T.Mesh(new T.CylinderGeometry(.06,.05,.1,14),std(R3C.ivory,.6));plantS.position.set(-.62,.81,-.2);g.add(plantS);
  for(let i=0;i<7;i++){const l=new T.Mesh(new T.SphereGeometry(.05,8,6),std(rpick(['#2f5a2a','#3e6e34','#4a7a3a']),.7));l.scale.set(1.4,.2,.8);l.position.set(-.62+rr(-.05,.05),.9+rr(0,.08),-.2+rr(-.05,.05));l.rotation.set(rr(-.6,.6),RN()*6,rr(-.5,.5));g.add(l)}
  // ghế xoay
  const ch=new T.Group();ch.position.set(.1,0,.75);ch.rotation.y=.25;g.add(ch);const chM=std('#2a2440',.7);
  box(.48,.07,.46,chM,0,.47,0,ch);box(.46,.5,.06,chM,0,.8,.22,ch);box(.05,.36,.05,blackM,0,.27,0,ch);
  for(let i=0;i<5;i++){const a=i/5*6.283,b=box(.28,.025,.03,blackM,Math.cos(a)*.14,.05,Math.sin(a)*.14,ch);b.rotation.y=-a}}

 // ---- lịch luyện tập treo trên tường, phía trên bàn ----
 {const g=group('lich-tap',-2.3,1.82,RZB+.02,{tag:[-2.3,2.3,RZB+.1],view:{pos:[-2.3,1.75,-1.1],look:[-2.3,1.8,RZB]}});
  const cv=document.createElement('canvas');cv.width=512;cv.height=460;const tx=new T.CanvasTexture(cv);tx.encoding=T.sRGBEncoding;tx.anisotropy=8;
  box(.9,.8,.015,std('#2a2440',.7),0,0,0,g);plane(.86,.77,new T.MeshStandardMaterial({map:tx,roughness:.85}),0,-.005,.009,0,g);
  for(const sx of[-.3,0,.3]){const ring=new T.Mesh(new T.TorusGeometry(.025,.006,6,14),std('#c9c4bb',.3,.8));ring.position.set(sx,.4,.02);g.add(ring)}
  W.dyn.cal={cv,tx};r3Calendar(W)}

 // ---- tủ đồ sưu tầm (góc phải tường sau): khung gỗ mở, thanh treo inox, áo thật từ tủ đồ ----
 {const CW=1.6,CH=2.35,CD=.6,g=group('tu-do',2.25,0,RZB+CD/2,{tag:[2.25,CH+.12,RZB+.3],view:{pos:[2.25,1.4,-.45],look:[2.25,1.35,RZB]}});
  box(.04,CH,CD,oak,-CW/2+.02,CH/2,0,g);box(.04,CH,CD,oak,CW/2-.02,CH/2,0,g);box(CW,.04,CD,oak,0,CH-.02,0,g);box(CW,.1,CD,std('#5a3f2a',.6),0,.05,0,g);
  box(CW-.08,CH-.14,.02,std('#2a2440',.85),0,CH/2+.03,-CD/2+.01,g);box(CW-.08,.03,CD-.04,oak,0,CH-.42,0,g);
  const rod=new T.Mesh(new T.CylinderGeometry(.014,.014,CW-.08,16),std('#d9d9de',.2,.95));rod.rotation.z=Math.PI/2;rod.position.set(0,CH-.56,0);g.add(rod);
  box(CW-.1,.012,.012,glow('#ffd58a',1.4),0,CH-.45,CD/2-.06,g);pool(0,CH-.9,-CD/2+.04,0,CW,1.4,.2,'rgba(255,214,140,1)',g);
  // hộp giấy trên ngăn trên cùng
  [[-.45,.22,R3C.ivory],[-.12,.18,'#d7c6a5'],[.32,.2,R3C.purple]].forEach(([x,h,c])=>box(.3,h,.36,std(c,.8),x,CH-.4+h/2,0,g));
  W.dyn.ward={g,CW,CD,rodY:CH-.56};r3Garments(W)}

 // ---- công tắc đèn cạnh tủ đồ: bấm để tắt / bật đèn phòng ----
 {const g=group('lsw',3.25,1.2,RZB+.01,{tag:[3.25,1.36,RZB+.05],sw:true});
  box(.09,.14,.012,std('#fbf8f2',.5),0,0,0,g);const k=box(.03,.05,.02,std('#e8e2d8',.4),0,0,.012,g);W.dyn.sw=k}

 // ---- thảm tròn in logo 15 Xóm Lẻ giữa phòng ----
 {const r=1.35,tx=ctex(1024,1024,(g,w,h)=>{g.fillStyle=R3C.purple;g.beginPath();g.arc(w/2,h/2,w/2,0,7);g.fill();
   // viền vàng dệt, sợi vải và vệt mòn
   g.strokeStyle=R3C.yellow;g.lineWidth=22;g.beginPath();g.arc(w/2,h/2,w/2-22,0,7);g.stroke();
   drawRoundel(g,w/2,h/2,w/2-66,{line:R3C.yellow,mark:R3C.ivory});
   g.globalAlpha=.08;for(let i=0;i<w;i+=3){g.fillStyle=i%6?'#000':'#fff';g.fillRect(i,0,1,h)}g.globalAlpha=1;
   r3grime(g,w,h,2400,.05,.09,.006)});
  const top=new T.MeshStandardMaterial({map:tx,roughness:1}),side=std('#2a1f74',1),rug=new T.Mesh(new T.CylinderGeometry(r,r,.016,72),[side,top,side]);
  rug.position.set(0,.008,.35);rug.rotation.y=Math.PI/2;rug.receiveShadow=true;scene.add(rug)}

 // ---- tường graffiti bên phải (chép cách vẽ từ xom-le-15 · textures/mural.js, khổ cao hơn cho vừa tường) ----
 {const GW=4.3,GH=2.55,tx=r3Mural(ctex);plane(GW,GH,new T.MeshStandardMaterial({map:tx,roughness:.85}),RX-.01,GH/2+.08,-.25,-Math.PI/2)}

 // ---- bụi bay trong vệt đèn rọi kệ sách ----
 {const n=small?70:160,pos=new Float32Array(n*3);for(let i=0;i<n;i++){pos[i*3]=rr(-1.4,1.4);pos[i*3+1]=rr(.3,2.7);pos[i*3+2]=rr(-2.2,.6)}
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(pos,3));
  const pts=new T.Points(geo,add(new T.PointsMaterial({size:.018,map:radial('rgba(255,236,200,1)'),opacity:.55,sizeAttenuation:true})));scene.add(pts);
  W.frame.push((t,dt)=>{const p=geo.attributes.position.array;for(let i=0;i<n;i++){p[i*3+1]+=Math.sin(t*.0004+i)*.0006;p[i*3]+=Math.cos(t*.0003+i*1.7)*.0004}geo.attributes.position.needsUpdate=true})}
}

// Sách trên kệ: lấy màu, độ dày và chiều cao thật của từng quyển (xếp theo màu như kệ 2D). Kệ trống thì xếp sách mẫu màu nhạt.
// Gỡ một nhóm đồ cũ và trả lại bộ nhớ GPU (khi vẽ lại sách / áo)
function r3Drop(p,g){if(!g)return;p.remove(g);g.traverse(m=>{if(!m.isMesh)return;m.geometry.dispose();if(m.userData.own)(Array.isArray(m.material)?m.material:[m.material]).forEach(x=>{if(x.map)x.map.dispose();x.dispose()})})}
function r3Books(W){const S=W.dyn.shelf,T=W.T;if(!S)return;r3Drop(S.g,S.books);const g=new T.Group();S.books=g;S.g.add(g);
 const real=books.length>0,L=real?[...books].sort((a,b)=>hue(a.c)-hue(b.c)):Array.from({length:26},(_,i)=>({c:['#d8cfe9','#e9dfcf','#c9c2dc','#efe6d6','#b9b0d6'][i%5],t:22+(i*7%18),seed:i*3}));
 const inner=S.BW-S.th*2-.08,order=[2,1,3,0,4],used=new Set();let bi=0;
 const vbox=(w,h,d,c,x,y,r=.7)=>{const m=W.box(w,h,d,W.std(c,r),x,y,.02,g);m.castShadow=false;return m};
 // sách xếp từ tầng ngang tầm mắt trở ra, mỗi tầng một cụm ở giữa có chặn sách hai đầu
 for(const r of order){if(bi>=L.length)break;const y0=S.base+r*S.rh+.015,maxH=S.rh-.07,row=[];let u=0;
  while(bi<L.length){const b=L[bi],bw=Math.max(.026,b.t*.0015),h=Math.min(maxH,(190+(b.seed*13%46))*.0013);if(u+bw>inner-.2)break;row.push([b,bw,h]);u+=bw+.003;bi++}
  if(!row.length)continue;used.add(r);let x=-u/2;
  vbox(.012,.16,.12,'#1b1820',x-.02,y0+.08,.4);
  row.forEach(([b,bw,h])=>{const d=.19+((b.seed||0)%5)*.012;vbox(bw,h,d,b.c,x+bw/2,y0+h/2,.85);
   if(real){vbox(bw+.001,.012,d+.001,shade(b.c,-.35),x+bw/2,y0+h*.84,.6);vbox(bw+.001,.008,d+.001,shade(b.c,.45),x+bw/2,y0+h*.16,.6)}x+=bw+.003});
  vbox(.012,.16,.12,'#1b1820',x+.02,y0+.08,.4)}
 // các tầng còn lại: đồ trang trí (bình vàng, chồng sách nằm, hộp, khung ảnh logo, chậu cây nhỏ)
 const decor=[r=>{const y0=S.base+r*S.rh+.015,v=new T.Mesh(new T.CylinderGeometry(.06,.085,.26,20),W.std(R3C.yellow,.35));v.position.set(-.5,y0+.13,.02);g.add(v);
   for(let k=0;k<3;k++)vbox(.26-k*.02,.035,.17,['#3b2ca6','#e9dfcf','#1c1640'][k],.45,y0+.018+k*.036)},
  r=>{const y0=S.base+r*S.rh+.015;[[-.55,R3C.ivory],[-.22,'#d7c6a5'],[.5,R3C.purple]].forEach(([x,c])=>vbox(.26,.2,.24,c,x,y0+.1,.85))},
  r=>{const y0=S.base+r*S.rh+.015,fr=vbox(.26,.32,.02,'#1b1820',.3,y0+.16,.4);fr.rotation.x=-.12;
   const ph=W.ctex(256,320,(c,w,h)=>{c.fillStyle=R3C.purple;c.fillRect(0,0,w,h);drawRoundel(c,w/2,h/2,w/2-24,{line:R3C.yellow,mark:R3C.ivory})});
   const p=new T.Mesh(new T.PlaneGeometry(.22,.28),new T.MeshStandardMaterial({map:ph,roughness:.7}));p.position.set(.3,y0+.16,.032);p.rotation.x=-.12;g.add(p);
   const pot=new T.Mesh(new T.CylinderGeometry(.05,.04,.08,14),W.std(R3C.ivory,.6));pot.position.set(-.4,y0+.04,.02);g.add(pot);
   for(let k=0;k<6;k++){const l=new T.Mesh(new T.SphereGeometry(.045,8,6),W.std(['#2f5a2a','#3e6e34','#4a7a3a'][k%3],.7));l.scale.set(1.4,.2,.8);l.position.set(-.4+rr(-.04,.04),y0+.12+rr(0,.06),.02+rr(-.03,.03));l.rotation.set(rr(-.6,.6),RN()*6,rr(-.5,.5));g.add(l)}}];
 let di=0;for(const r of[4,0,3,1,2])if(!used.has(r)&&di<decor.length)decor[di++](r);
 r3Own(W,'ke-sach')}

// Áo trong tủ: có ảnh mặt nghiêng thì treo ảnh nghiêng quay ra trước; chỉ có ảnh mặt trước thì xoay gần vuông góc như áo treo thật.
const r3Tee=c=>{const cv=document.createElement('canvas');cv.width=256;cv.height=282;const g=cv.getContext('2d');g.fillStyle=c;
 g.fill(new Path2D('M90 6q38 22 76 0l74 38-23 59-28-13v186H67V90L39 103 16 44z'));return cv};
function r3Garments(W){const D=W.dyn.ward,T=W.T;if(!D)return;r3Drop(D.g,D.items);const g=new T.Group();D.items=g;D.g.add(g);
 const L=garments.length?garments.slice(0,10):['#2c3e5c','#6f747a','#e6dcc6','#2f6b4a','#1f1f22','#c9b98f'].map(c=>({c,demo:1}));
 const n=L.length,span=D.CW-.3,step=Math.min(.2,span/Math.max(1,n-1)),hG=.82,loader=new T.TextureLoader();loader.setCrossOrigin('anonymous');
 L.forEach((it,i)=>{const x=n===1?0:-((n-1)*step)/2+i*step,side=!!it.side,mat=new T.MeshStandardMaterial({color:'#fff',roughness:.85,transparent:true,alphaTest:.05,side:T.DoubleSide});
  const p=new T.Mesh(new T.PlaneGeometry(1,1),mat);p.position.set(x,D.rodY-.06-hG/2,.02);p.rotation.y=side?0:1.22;g.add(p);
  const fit=(w,h)=>{const ar=w/h;p.scale.set(Math.min(.75,hG*ar),Math.min(hG,.75/ar),1);p.position.y=D.rodY-.06-p.scale.y/2};
  const put=(t,w,h)=>{t.encoding=T.sRGBEncoding;p.material.map=t;p.material.needsUpdate=true;fit(w,h)},tee=()=>put(new T.CanvasTexture(r3Tee(it.c||'#8a8a8a')),256,282);
  if(it.demo)tee();else{fit(.8,1);loader.load(side?it.side:it.img,t=>{if(p.parent)put(t,t.image.width,t.image.height);else t.dispose()},undefined,tee)}
  // móc: vòng kim loại trên thanh + thanh gỗ theo chiều vai áo
  const hk=new T.Mesh(new T.TorusGeometry(.02,.003,6,12,Math.PI*1.4),W.std('#d9d9de',.2,.95));hk.position.set(x,D.rodY+.012,0);hk.rotation.y=Math.PI/2;g.add(hk);
  const bar=W.box(.34,.018,.02,W.std('#c9a173',.55),x,D.rodY-.05,.02,g);bar.rotation.y=side?Math.PI/2:1.22;bar.castShadow=false});
 r3Own(W,'tu-do')}

// Tờ lịch: ngày hôm nay, chuỗi ngày tập và 5 tuần gần nhất tô theo mức hoàn thành (giống ô lịch trong khu Lịch luyện tập).
function r3Calendar(W){const C=W.dyn.cal;if(!C)return;const g=C.cv.getContext('2d'),w=C.cv.width,h=C.cv.height;
 g.fillStyle='#f7f1e6';g.fillRect(0,0,w,h);g.fillStyle=R3C.purple;g.fillRect(0,0,w,74);
 g.fillStyle=R3C.yellow;g.font='900 34px Montserrat,sans-serif';g.textAlign='left';g.fillText('LỊCH TẬP',24,50);
 const t=dayKey(),[Y,M,D]=t.split('-').map(Number);g.textAlign='right';g.fillStyle=R3C.ivory;g.font='800 26px Montserrat,sans-serif';g.fillText(`${String(D).padStart(2,'0')}.${String(M).padStart(2,'0')}`,w-24,48);
 const lv=['#e4ddd0','#cfc7f0','#9a8cff','#6a58f0','#3b2ca6'],cs=56,gap=8,gx=(w-(7*cs+6*gap))/2,gy=104;
 g.textAlign='center';g.fillStyle='#8a8070';g.font='700 18px "Be Vietnam Pro",sans-serif';['T2','T3','T4','T5','T6','T7','CN'].forEach((d,i)=>g.fillText(d,gx+i*(cs+gap)+cs/2,gy-10));
 const wd=(new Date(Date.UTC(Y,M-1,D)).getUTCDay()+6)%7,start=addDays(t,-(28+wd));
 for(let k=0;k<35;k++){const d=addDays(start,k),cx=gx+(k%7)*(cs+gap),cy=gy+Math.floor(k/7)*(cs+gap);let col='#efe9de';
  if(d<=t&&HB.loaded){const s=dayStat(d);col=s.rest?'#f1d9a0':s.none?'#efe9de':lv[hlevel(s.p)]}
  g.fillStyle=col;g.beginPath();g.roundRect?g.roundRect(cx,cy,cs,cs,8):g.rect(cx,cy,cs,cs);g.fill();
  if(d===t){g.strokeStyle=R3C.yellow;g.lineWidth=5;g.stroke()}if(d>t){g.fillStyle='rgba(247,241,230,.6)';g.fill()}}
 if(HB.loaded){const a=allStreak();g.fillStyle=R3C.ink;g.font='800 22px Montserrat,sans-serif';g.textAlign='left';g.fillText(a.cur?`🔥 ${a.cur} NGÀY LIÊN TIẾP`:'CHƯA CÓ CHUỖI NGÀY',24,h-16)}
 C.tx.needsUpdate=true}

// Bức graffiti XÓM LẺ (chép từ xom-le-15 · textures/mural.js, dùng logo tròn thay logo vòm, khổ 2048×1214 cho vừa tường 4.3×2.55 m).
function r3Mural(ctex){const BR=R3C;RN=r3rng(2026);return ctex(2048,1214,(g,w,h)=>{
 g.fillStyle='#8e8a85';g.fillRect(0,0,w,h);
 for(let i=0;i<14;i++){g.fillStyle=`rgba(${RN()<.5?'255,255,255':'40,36,32'},${rr(.04,.12)})`;g.fillRect(RN()*w,RN()*h,rr(120,520),rr(80,360))}
 r3grime(g,w,h,3200,.06,.12,.01);r3streaks(g,w,h,120,.22);
 g.strokeStyle='rgba(25,22,20,.55)';g.lineWidth=2;for(let i=0;i<7;i++){let x=RN()*w,y=RN()*h*.4;g.beginPath();g.moveTo(x,y);for(let k=0;k<14;k++){x+=rr(-30,30);y+=rr(10,40);g.lineTo(x,y)}g.stroke()}
 const C=[BR.purple,BR.ink,BR.yellow,BR.ivory,'#5b4ae0','#141018'],words=['15','XL','xóm','lẻ','HN','ngõ','2026','XÓM','15XL','đi chậm','phố','X.L','hẻm','15!'];
 for(let i=0;i<110;i++){g.save();g.translate(RN()*w,rr(40,h-20));g.rotate(rr(-.4,.25));g.transform(1,0,rr(-.5,-.1),1,0,0);const size=rr(24,74),col=rpick(C),t=rpick(words);
  g.font=`italic ${RN()<.5?900:800} ${size}px Montserrat, sans-serif`;
  if(RN()<.35){g.lineWidth=Math.max(2,size*.07);g.strokeStyle=col;g.strokeText(t,0,0)}
  else{if(RN()<.4){g.lineWidth=size*.16;g.strokeStyle=col===BR.ivory?BR.ink:BR.ivory;g.lineJoin='round';g.strokeText(t,0,0)}g.fillStyle=col;g.fillText(t,0,0)}
  if(RN()<.5){const tw=g.measureText(t).width;g.strokeStyle=col;g.lineWidth=3;g.beginPath();g.moveTo(-6,8);g.quadraticCurveTo(tw/2,22+RN()*14,tw+18,rr(-10,6));g.stroke()}g.restore()}
 for(let i=0;i<60;i++){g.strokeStyle=rpick(C);g.lineWidth=rr(2.5,5);g.lineCap='round';let x=RN()*w,y=RN()*h;g.beginPath();g.moveTo(x,y);
  for(let k=0;k<6;k++){const nx=x+rr(10,34),ny=y+rr(-26,26);g.bezierCurveTo(x+rr(-14,24),y-rr(10,40),nx+rr(-14,14),ny+rr(-30,30),nx,ny);x=nx;y=ny}g.stroke()}
 // sticker logo tròn dán lung tung
 for(let i=0;i<16;i++){g.save();g.translate(RN()*w,rr(60,h-60));g.rotate(rr(-.4,.4));const s=rr(46,78);
  if(RN()<.55){g.fillStyle=BR.ivory;g.beginPath();g.arc(0,0,s*.62,0,7);g.fill();drawRoundel(g,0,0,s*.56,{bg:BR.purple,line:BR.yellow,mark:BR.ivory})}
  else{g.fillStyle=RN()<.5?BR.yellow:BR.ivory;g.fillRect(-s*.9,-s*.35,s*1.8,s*.7);g.fillStyle=BR.ink;g.font=`900 ${s*.36}px Montserrat, sans-serif`;g.textAlign='center';g.fillText('15 XÓM LẺ',0,s*.13)}
  g.restore()}
 // logo tròn lớn phun sơn bên phải + vệt sơn chảy
 const lx=w*.83,ly=h*.3,lr=200;g.save();g.globalAlpha=.96;drawRoundel(g,lx,ly,lr,{bg:BR.purple,line:BR.yellow,mark:BR.ivory});g.restore();
 for(let i=0;i<9;i++){const x=lx+rr(-150,150),y0=ly+lr*.8,l=rr(30,140);g.fillStyle=BR.purple;g.fillRect(x,y0,7,l);g.beginPath();g.arc(x+3.5,y0+l,6,0,7);g.fill()}
 // mảng chính: XÓM LẺ kiểu wildstyle
 const off=document.createElement('canvas');off.width=w;off.height=h;const o=off.getContext('2d'),size=320,letters=[...'XÓM LẺ'];
 g.font=o.font=`italic 900 ${size}px Montserrat, sans-serif`;const widths=letters.map(ch=>ch===' '?size*.22:g.measureText(ch).width*.86);
 let x=w*.42-widths.reduce((a,b)=>a+b,0)/2;const base=h*.62,placed=[];
 letters.forEach((ch,i)=>{if(ch!==' ')placed.push({ch,x:x+widths[i]/2,y:base+rr(-26,26),rot:rr(-.13,.13),sk:rr(-.18,.05)});x+=widths[i]});
 const at=(c,p,fn)=>{c.save();c.translate(p.x,p.y);c.rotate(p.rot);c.transform(1,0,p.sk,1,0,0);c.textAlign='center';c.textBaseline='alphabetic';c.lineJoin='round';c.font=`italic 900 ${size}px Montserrat, sans-serif`;fn(c);c.restore()};
 placed.forEach(p=>at(g,p,c=>{for(let k=20;k>0;k--){c.fillStyle='#120f22';c.fillText(p.ch,k*1.5,k*1.3)}}));
 placed.forEach(p=>at(g,p,c=>{c.lineWidth=40;c.strokeStyle=BR.ivory;c.strokeText(p.ch,0,0)}));
 placed.forEach(p=>at(g,p,c=>{c.lineWidth=20;c.strokeStyle='#120f22';c.strokeText(p.ch,0,0)}));
 [[placed[0],-1],[placed[placed.length-1],1]].forEach(([p,s])=>{const ax=p.x+s*140,ay=p.y-220;g.lineCap='round';
  for(const[lw,col]of[[34,BR.ivory],[24,'#120f22'],[14,BR.yellow]]){g.strokeStyle=col;g.lineWidth=lw;g.beginPath();g.moveTo(p.x+s*40,p.y-130);g.quadraticCurveTo(ax,ay+40,ax+s*60,ay-20);g.stroke()}
  g.fillStyle=BR.yellow;g.strokeStyle='#120f22';g.lineWidth=8;g.beginPath();g.moveTo(ax+s*100,ay-45);g.lineTo(ax+s*30,ay-60);g.lineTo(ax+s*60,ay+10);g.closePath();g.stroke();g.fill()});
 placed.forEach(p=>at(o,p,c=>{const gr=c.createLinearGradient(0,-size*.75,0,0);gr.addColorStop(0,'#7a68ff');gr.addColorStop(.55,BR.purple);gr.addColorStop(1,'#241a7a');c.fillStyle=gr;c.fillText(p.ch,0,0)}));
 o.globalCompositeOperation='source-atop';o.fillStyle=BR.yellow;o.globalAlpha=.95;for(let i=0;i<9;i++){const yy=base-70+i*4;o.fillRect(0,yy+Math.sin(i)*4,w,2.5)}
 o.globalAlpha=1;o.beginPath();o.moveTo(0,base-30);for(let xx=0;xx<=w;xx+=40)o.lineTo(xx,base-30+Math.sin(xx*.02)*12);o.lineTo(w,h);o.lineTo(0,h);o.fill();
 o.strokeStyle='rgba(255,255,255,.85)';o.lineWidth=9;o.lineCap='round';placed.forEach(p=>{o.beginPath();o.moveTo(p.x-50,p.y-size*.55);o.lineTo(p.x-20,p.y-size*.62);o.stroke()});
 g.drawImage(off,0,0);
 placed.forEach(p=>{for(let k=0;k<4;k++){const dx=p.x+rr(-70,70),dy=p.y+rr(-4,10),l=rr(30,170);g.fillStyle=RN()<.6?BR.yellow:BR.purple;g.fillRect(dx,dy,9,l);g.beginPath();g.arc(dx+4.5,dy+l,8,0,7);g.fill()}});
 g.fillStyle=BR.ivory;for(let i=0;i<8;i++){const sx=w*.15+RN()*w*.6,sy=h*.12+RN()*h*.35,s=rr(14,30);g.beginPath();g.moveTo(sx,sy-s);g.quadraticCurveTo(sx,sy,sx+s,sy);g.quadraticCurveTo(sx,sy,sx,sy+s);g.quadraticCurveTo(sx,sy,sx-s,sy);g.quadraticCurveTo(sx,sy,sx,sy-s);g.fill()}
 g.save();g.translate(w*.1,h*.92);g.rotate(-.08);g.font='900 250px Montserrat, sans-serif';g.textAlign='center';g.lineJoin='round';
 g.lineWidth=46;g.strokeStyle='#120f22';g.strokeText('15',0,0);g.lineWidth=30;g.strokeStyle=BR.purple;g.strokeText('15',0,0);g.fillStyle=BR.yellow;g.fillText('15',0,0);g.restore();
 for(let i=0;i<3600;i++){g.fillStyle=rpick([BR.purple,BR.yellow,BR.ivory]);g.globalAlpha=.22;g.fillRect(RN()*w,RN()*h,2,2)}g.globalAlpha=1;
 const gb=g.createLinearGradient(0,h*.85,0,h);gb.addColorStop(0,'rgba(20,18,16,0)');gb.addColorStop(1,'rgba(20,18,16,.55)');g.fillStyle=gb;g.fillRect(0,h*.85,w,h*.15)})}

// Mỗi món bấm được dùng vật liệu riêng (để sáng lên khi rê chuột mà không làm sáng món khác dùng chung vật liệu).
function r3Own(W,id){const P=W.picks[id];if(!P)return;P.g.traverse(m=>{if(!m.isMesh)return;m.userData.pick=id;
 if(!m.userData.own){m.material=Array.isArray(m.material)?m.material.map(x=>x.clone()):m.material.clone();m.userData.own=1}})}

// ---------- tương tác: nhìn quanh, rê chuột, bấm, bay camera ----------
function r3Interact(W){const T=W.T,cv=W.renderer.domElement,tag=W.el.querySelector('#r3tag'),keys=W.el.querySelector('#r3keys');
 Object.keys(W.picks).forEach(id=>r3Own(W,id));
 const HOME={pos:new T.Vector3(0,1.62,4.35),look:new T.Vector3(0,1.22,-1.1)};W.home=HOME;
 const cam={pos:HOME.pos.clone(),look:HOME.look.clone()},v=new T.Vector3(),ray=new T.Raycaster(),ndc=new T.Vector2();
 let yaw=0,pitch=0,tYaw=0,tPitch=0,mx=0,my=0,drag=null,hover=null,fly=null;W.cam=cam;
 const info=id=>{if(id==='lsw')return{name:'Công tắc đèn',sub:()=>document.body.classList.contains('lights-off')?'Đèn đang tắt · bấm để bật':'Bấm để tắt đèn phòng',open:true};return OBJS.find(o=>o.id===id)};
 const meshes=()=>{const a=[];Object.values(W.picks).forEach(P=>P.g.traverse(m=>{if(m.isMesh)a.push(m)}));return a};
 function setHover(id){if(hover===id)return;if(hover)hi(hover,false);hover=id;if(id)hi(id,true);cv.style.cursor=id?'pointer':'grab';showTag()}
 function hi(id,on){W.picks[id].g.traverse(m=>{if(!m.isMesh||!m.userData.own)return;(Array.isArray(m.material)?m.material:[m.material]).forEach(x=>{if(x.emissive&&!x.userData.glow){if(x.userData.e0===undefined)x.userData.e0=x.emissive.getHex();x.emissive.setHex(on?0x0a0703:x.userData.e0)}})})}
 function showTag(){if(!hover||fly){tag.classList.remove('on');return}const P=W.picks[hover],o=info(hover);if(!o)return;
  v.set(...P.tag).project(W.camera);const r=cv.getBoundingClientRect();
  tag.innerHTML=`<b>${esc(o.name)}</b><small>${esc(o.sub())}</small>`;
  tag.style.left=Math.max(70,Math.min(r.width-70,(v.x+1)/2*r.width))+'px';tag.style.top=Math.max(48,(1-v.y)/2*r.height)+'px';tag.classList.add('on')}
 W.showTag=showTag;
 function pickAt(e){const r=cv.getBoundingClientRect();ndc.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(ndc,W.camera);
  const h=ray.intersectObjects(meshes(),false)[0];return h?h.object.userData.pick:null}
 cv.addEventListener('pointermove',e=>{const r=cv.getBoundingClientRect();mx=(e.clientX-r.left)/r.width*2-1;my=(e.clientY-r.top)/r.height*2-1;
  if(drag){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>6)drag.moved=true;
   tYaw=Math.max(-W.yawMax,Math.min(W.yawMax,drag.yaw-dx/r.width*1.6));tPitch=Math.max(-.14,Math.min(.14,drag.pitch+dy/r.height*.8));if(drag.moved){setHover(null);return}}
  if(e.pointerType==='mouse'&&!fly)setHover(pickAt(e))});
 cv.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,yaw:tYaw,pitch:tPitch,moved:false};cv.setPointerCapture(e.pointerId);cv.style.cursor='grabbing'});
 cv.addEventListener('pointerup',e=>{const d=drag;drag=null;cv.style.cursor=hover?'pointer':'grab';if(!d||d.moved||fly)return;const id=pickAt(e);if(id)r3Activate(id)});
 cv.addEventListener('pointerleave',()=>{if(!drag)setHover(null);mx=my=0});
 // phím: mỗi món có một nút ẩn để dùng bàn phím / trình đọc màn hình
 keys.innerHTML=Object.keys(W.picks).map(id=>{const o=info(id);return`<button type="button" data-r3="${id}">${esc(o?o.name:id)}</button>`}).join('');
 keys.addEventListener('focusin',e=>{const b=e.target.closest('[data-r3]');if(b)setHover(b.dataset.r3)});
 keys.addEventListener('focusout',()=>setHover(null));
 keys.addEventListener('click',e=>{const b=e.target.closest('[data-r3]');if(b)r3Activate(b.dataset.r3)});
 // bay camera tới góc nhìn món đồ (vào khu) hoặc từ món đồ về chỗ đứng (quay lại phòng)
 const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
 W.flyTo=(to,dur,cb)=>{if(RM()){cam.pos.copy(to.pos);cam.look.copy(to.look);cb&&cb();return}fly={a:{pos:cam.pos.clone(),look:cam.look.clone()},b:to,t0:performance.now(),dur,cb};setHover(null)};
 // đặt camera theo vị trí đứng + góc liếc hiện tại (gọi cả ngoài vòng vẽ để khung đầu tiên đã đúng chỗ)
 const UP=new T.Vector3(0,1,0),aim=()=>{W.camera.position.copy(cam.pos);v.copy(cam.look).sub(cam.pos);const d=v.length();v.applyAxisAngle(UP,yaw);v.y+=pitch*d;W.camera.lookAt(v.add(cam.pos));W.camera.updateMatrixWorld()};
 W.place=(at)=>{cam.pos.copy(at.pos);cam.look.copy(at.look);aim()};
 W.flying=()=>!!fly;
 W.frame.push(t=>{if(fly){const k=Math.min(1,(t-fly.t0)/fly.dur),e=ease(k);cam.pos.lerpVectors(fly.a.pos,fly.b.pos,e);cam.look.lerpVectors(fly.a.look,fly.b.look,e);
   if(k>=1){const cb=fly.cb;fly=null;cb&&cb()}}
  const atHome=cam.pos.distanceTo(HOME.pos)<.05;
  yaw+=((atHome&&!RM()?tYaw+mx*.05:0)-yaw)*.08;pitch+=((atHome&&!RM()?tPitch-my*.03:0)-pitch)*.08;
  aim();if(hover)showTag()});
 W.lights=off=>{W.main.forEach(([l,i])=>l.intensity=off?i*.12:i);W.cove.emissiveIntensity=off?.25:1.6;if(W.dyn.sw)W.dyn.sw.rotation.x=off?.5:-.5};
 W.lights(document.body.classList.contains('lights-off'))}

function r3Activate(id){const W=R3.W;if(!W||W.flying())return;const P=W.picks[id];
 if(id==='lsw'){const off=document.body.classList.toggle('lights-off');store.set('ksk3lights',off?'0':'1');SFX.play('click');W.lights(off);W.showTag();return}
 const o=OBJS.find(x=>x.id===id);
 if(!o.open){SFX.play('click');toast(`${o.name} ${o.sub().toLowerCase()}. Hẹn bạn quay lại sau!`);
  if(!RM()){const g=P.g,t0=performance.now(),z0=g.rotation.z,f=t=>{const k=(t-t0)/450;g.rotation.z=k<1?z0+Math.sin(k*Math.PI*4)*.012*(1-k):z0;return k<1};W.anims.push(f)}return}
 SFX.play('pull');const v=P.view,T=W.T;
 W.flyTo({pos:new T.Vector3(...v.pos),look:new T.Vector3(...v.look)},850,()=>{location.hash='#/'+id});
 if(!RM())W.el.animate([{opacity:1},{opacity:1,offset:.7},{opacity:0}],{duration:850,fill:'forwards'})}

// ---------- gắn vào trang: vòng vẽ, đổi cỡ, vào / rời phòng ----------
let r3raf=0;
function r3Loop(t){r3raf=requestAnimationFrame(r3Loop);const W=R3.W,c=W.renderer.domElement;if(document.hidden)return;
 if(c.clientWidth!==W.cw||c.clientHeight!==W.ch)r3Fit();
 const dt=Math.min(.1,(t-(W.last||t))/1000);W.last=t;W.frame.forEach(f=>f(t,dt));W.anims=W.anims.filter(f=>f(t));W.renderer.render(W.scene,W.camera)}
function r3Fit(){const W=R3.W,sc=$('scene');if(!W||!sc)return;const w=sc.clientWidth,h=sc.clientHeight;if(!w||!h)return;
 W.renderer.setSize(w,h,false);W.cw=w;W.ch=h;const a=w/h,hf=74*Math.PI/180,p=a<1;W.camera.aspect=a;
 W.camera.fov=Math.min(70,2*Math.atan(Math.tan(hf/2)/a)*180/Math.PI);W.yawMax=p?.55:.28;W.camera.updateProjectionMatrix();
 // màn hình dọc: đứng gần hơn cho đồ đạc to, dễ chạm; vuốt ngang để nhìn hai bên
 const home=W.home,atHome=W.cam.pos.distanceTo(home.pos)<.05;home.pos.set(0,p?1.5:1.62,p?3.1:4.35);home.look.set(0,p?1.32:1.22,p?-2:-1.1);if(atHome&&!W.flying())W.place(home)}
let r3ro=null;
function r3Mount(from){const W=R3.W,sc=$('scene');if(!W||!sc)return;
 sc.classList.add('s3d');sc.replaceChildren(W.el);W.el.getAnimations().forEach(a=>a.cancel());
 if(!r3ro){r3ro=new ResizeObserver(r3Fit);r3ro.observe(sc)}r3Fit();
 W.lights(document.body.classList.contains('lights-off'));r3Refresh();
 const P=from&&W.picks[from],T=W.T;
 if(P&&!RM()){W.place({pos:new T.Vector3(...P.view.pos),look:new T.Vector3(...P.view.look)});W.flyTo(W.home,900)}else W.place(W.home);
 cancelAnimationFrame(r3raf);r3raf=requestAnimationFrame(r3Loop);
 if(!from&&!RM())W.el.animate([{opacity:0},{opacity:1}],{duration:500})}
function r3Refresh(){const W=R3.W;if(!W)return;r3Books(W);r3Garments(W);r3Calendar(W)}
const r3Active=()=>R3.st==='ready'&&curRoom==='phong'&&!!$('scene')&&$('scene').contains(R3.W.el);
// Vào phòng: đã dựng xong thì gắn ngay; chưa thì vẽ phòng 2D trước rồi chuyển sang 3D khi tải xong. Trả về false nếu chỉ dùng được 2D.
function r3Enter(from){if(R3.st==='fail'||!r3Supported())return false;
 if(R3.st==='ready'){r3Mount(from);return true}
 drawRoom();$('scene').classList.add('r3wait');
 r3Load().then(()=>{if(curRoom==='phong')r3Mount(null)}).catch(()=>{}).finally(()=>{const sc=$('scene');if(sc)sc.classList.remove('r3wait')});return true}
function r3Leave(){cancelAnimationFrame(r3raf);r3raf=0;const sc=$('scene');if(sc)sc.classList.remove('s3d')}
