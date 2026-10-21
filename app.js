const $=id=>document.getElementById(id);
const COL=['#8b1e2b','#c97b63','#e07a5f','#f4b6a6','#e9965a','#f2d08a','#e8c15a','#a3a35a','#a9bf8f','#7fa37a','#2f6f5e','#3f8f8b','#9fd3c7','#8cc1d9','#3f6ea8','#2c4a7c','#7a6fb0','#b9aee0','#e8a7c0','#f4c2d7','#b08968','#efe6d6','#8a8f98','#3d3a36'];
const bookColor=()=>$('cc').dataset.custom||COL[+$('cc').dataset.v];
const ARTN=['Vòm cổng','Hoa','Sóng','Núi','Cọ','Chùa','Thuyền','Hoa sen','Đèn lồng','Nón lá','Máy bay','Cây thông'];
const BG=['white','cream','grid','kraft','mint','rose'],BGN=['Trắng','Kem','Ô vuông','Kraft','Mint','Hồng'];
const LAY=['scatter','hero','quote'],LAYN=['Ảnh rải','Ảnh lớn','Chỉ chữ'];
const STK=['','🌿','☀️','🌊','⛰️','🍜','📷','❤️','⭐','🎒'];
const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const shade=(h,a)=>'#'+rgb(h).map(v=>Math.round(a>0?v+(255-v)*a:v*(1+a)).toString(16).padStart(2,'0')).join('');
const lum=h=>{const[r,g,b]=rgb(h);return(.299*r+.587*g+.114*b)/255};
const hue=h=>{let[r,g,b]=rgb(h).map(v=>v/255);const m=Math.max(r,g,b),n=Math.min(r,g,b),d=m-n;if(d<.08)return 400+(1-lum(h))*100;let x=m===r?((g-b)/d)%6:m===g?(b-r)/d+2:(r-g)/d+4;return((x*60)+360+30)%360};
function art(k,c){const d=shade(c,-.28),m=shade(c,-.13),l=shade(c,.4),g='#7d8f4a',s='#f2b36b';
 const A=[`<circle cx="130" cy="60" r="26" fill="${s}"/><rect x="20" y="96" width="46" height="94" rx="2" fill="${d}"/><path d="M26 96v-10h8v6h8v-6h8v6h8v-10h0v10" fill="${d}"/><path d="M33 190v-30a10 10 0 0 1 20 0v30z" fill="${l}"/><path d="M70 190V120a30 30 0 0 1 60 0v70z" fill="${m}"/><path d="M82 190v-50a18 18 0 0 1 36 0v50z" fill="${l}"/><path d="M134 190v-48a24 24 0 0 1 48 0v48z" fill="${d}"/><path d="M146 190v-30a12 12 0 0 1 24 0v30z" fill="${l}"/><rect x="186" y="120" width="14" height="70" rx="7" fill="${g}"/><rect x="170" y="140" width="10" height="26" rx="5" fill="${g}"/>`,
 [0,72,144,216,288].map(r=>`<ellipse cx="100" cy="62" rx="22" ry="44" fill="${r%144?m:d}" transform="rotate(${r} 100 100)"/>`).join('')+`<circle cx="100" cy="100" r="13" fill="${s}"/><g stroke="${d}" stroke-width="3" stroke-linecap="round"><path d="M100 100l30-8M100 100l26 18M100 100l-6 30"/></g>`,
 `<circle cx="100" cy="85" r="68" fill="${d}"/><circle cx="100" cy="85" r="50" fill="${l}"/><circle cx="100" cy="85" r="32" fill="${m}"/><circle cx="100" cy="85" r="15" fill="${d}"/><path d="M0 170q25-16 50 0t50 0 50 0 50 0v30H0z" fill="${m}"/><path d="M0 188q25-16 50 0t50 0 50 0 50 0v12H0z" fill="${d}"/>`,
 `<circle cx="150" cy="56" r="26" fill="${s}"/><path d="M0 190L70 70l55 80 25-34 50 74z" fill="${d}"/><path d="M40 190L110 96l70 94z" fill="${m}"/><path d="M70 70l-14 24 14-6 8 8z" fill="${l}"/><rect x="0" y="176" width="200" height="14" fill="${l}"/>`,
 `<circle cx="100" cy="150" r="64" fill="${s}"/><path d="M104 190C96 150 100 110 114 70" stroke="${d}" stroke-width="9" fill="none" stroke-linecap="round"/>`+[[-70,16],[-38,32],[0,40],[38,32],[70,16]].map(([r,y])=>`<ellipse cx="114" cy="${y+50}" rx="9" ry="36" fill="${r%2?g:shade(g,-.15)}" transform="rotate(${r} 114 74)"/>`).join('')+`<rect x="0" y="176" width="200" height="14" fill="${m}"/>`,
 `<circle cx="150" cy="50" r="22" fill="${s}"/><rect x="72" y="150" width="56" height="40" fill="${m}"/><rect x="90" y="162" width="20" height="28" fill="${l}"/><path d="M48 150h104l-14-18H62z" fill="${d}"/><rect x="80" y="114" width="40" height="18" fill="${m}"/><path d="M62 114h76l-12-18H74z" fill="${d}"/><rect x="87" y="82" width="26" height="14" fill="${m}"/><path d="M72 82h56l-28-30z" fill="${d}"/><rect x="98" y="34" width="4" height="20" fill="${d}"/><rect x="0" y="186" width="200" height="14" fill="${l}"/>`,
 `<circle cx="58" cy="56" r="24" fill="${s}"/><path d="M100 36v104H44z" fill="${l}"/><path d="M108 56v84h46z" fill="${m}"/><rect x="98" y="30" width="4" height="116" fill="${d}"/><path d="M28 142h144l-22 28H50z" fill="${d}"/><path d="M0 176q25-14 50 0t50 0 50 0 50 0v24H0z" fill="${m}"/><path d="M0 192q25-12 50 0t50 0 50 0 50 0v8H0z" fill="${d}"/>`,
 `<ellipse cx="100" cy="164" rx="76" ry="12" fill="${g}"/><path d="M100 156C68 148 56 108 66 74c22 10 34 44 34 82z" fill="${m}"/><path d="M100 156c32-8 44-48 34-82-22 10-34 44-34 82z" fill="${m}"/><path d="M100 158C82 124 82 84 100 44c18 40 18 80 0 114z" fill="${d}"/><path d="M100 160C58 160 36 140 30 110c28 4 54 20 70 50z" fill="${l}"/><path d="M100 160c42 0 64-20 70-50-28 4-54 20-70 50z" fill="${l}"/><path d="M0 182q25-10 50 0t50 0 50 0 50 0v18H0z" fill="${m}"/>`,
 `<rect x="98" y="14" width="4" height="26" fill="${d}"/><rect x="78" y="38" width="44" height="10" rx="4" fill="${d}"/><ellipse cx="100" cy="98" rx="54" ry="50" fill="${m}"/><ellipse cx="100" cy="98" rx="28" ry="50" fill="${l}"/><ellipse cx="100" cy="98" rx="8" ry="50" fill="${m}"/><rect x="78" y="144" width="44" height="10" rx="4" fill="${d}"/><g stroke="${s}" stroke-width="5" stroke-linecap="round"><path d="M86 156v28M100 156v34M114 156v28"/></g>`,
 `<ellipse cx="100" cy="142" rx="84" ry="16" fill="${d}"/><path d="M100 34L16 142Q100 172 184 142z" fill="${m}"/><path d="M100 34L56 154M100 34v132M100 34l44 120" stroke="${d}" stroke-width="2.5" opacity=".4" fill="none"/><path d="M62 150q38 34 76 0" stroke="${s}" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="0" y="186" width="200" height="14" fill="${l}"/>`,
 `<circle cx="150" cy="58" r="24" fill="${s}"/><g fill="${l}"><ellipse cx="46" cy="168" rx="32" ry="9"/><ellipse cx="150" cy="182" rx="28" ry="8"/></g><g transform="rotate(-18 100 110)"><path d="M80 108L112 44h22l-18 64z" fill="${d}"/><path d="M80 112l32 64h22l-18-64z" fill="${d}"/><path d="M34 106l-16-30h22l16 30z" fill="${d}"/><ellipse cx="100" cy="110" rx="78" ry="16" fill="${m}"/><circle cx="148" cy="106" r="5" fill="${l}"/><circle cx="130" cy="106" r="5" fill="${l}"/><circle cx="112" cy="106" r="5" fill="${l}"/></g>`,
 `<circle cx="44" cy="44" r="22" fill="${s}"/><rect x="108" y="150" width="12" height="40" fill="${d}"/><path d="M114 24l38 50h-76z" fill="${d}"/><path d="M114 58l48 58H66z" fill="${m}"/><path d="M114 94l58 64H56z" fill="${d}"/><rect x="38" y="150" width="8" height="40" fill="${d}"/><path d="M42 96l26 36H16z" fill="${m}"/><path d="M42 118l32 38H10z" fill="${d}"/><path d="M0 190q50-14 100-4t100-8v22H0z" fill="${l}"/>`];
 return `<svg viewBox="0 0 200 200">${A[k]}</svg>`}
let layout='up',books=[],mode='color',cur=null,i=0,busy=0,faces=[];
const fail=e=>{console.error(e);alert('Có lỗi khi kết nối Supabase: '+(e.message||e))};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function tower(){
 const L=[...books].sort((a,b)=>mode==='color'?hue(a.c)-hue(b.c):b.ts-a.ts),t=$('tower');t.innerHTML='';
 t.className='tower'+(layout==='flat'?' flat':'');
 if(!books.length){t.innerHTML='<p class="empty">Kệ còn trống. Bấm “Làm quyển sách mới” để bắt đầu.</p>';return}
 const mk=b=>{const e=document.createElement('button'),lt=lum(b.c)>.62;
  e.className='spine';e.style.cssText=`--t:${b.t}px;--h:${190+(b.seed*13%46)}px;--o:${(b.seed*37%20)-4}px;background-color:${b.c};color:${lt?shade(b.c,-.5):'#fff'}`;
  e.innerHTML=`${esc(b.title)}<small>${esc(b.sub||'')}</small>`;e.onclick=()=>openBook(b.id);return e};
 if(layout==='flat'){L.forEach(b=>t.append(mk(b)));const tb=document.createElement('div');tb.className='table';t.append(tb);return}
 const W=Math.min(t.clientWidth||880,880)-36;let rows=[[]],u=0;
 L.forEach(b=>{if(u+b.t+1>W&&rows.at(-1).length){rows.push([]);u=0}rows.at(-1).push(b);u+=b.t+1});
 rows.forEach(r=>{const d=document.createElement('div');d.className='row';r.forEach(b=>d.append(mk(b)));
  t.append(d);const bd=document.createElement('div');bd.className='board';t.append(bd)});
}
let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{if(!cur)tower()},200)});
function setLayout(v){layout=v;$('l1').classList.toggle('on',v==='up');$('l2').classList.toggle('on',v==='flat');try{localStorage.setItem('ksk3layout',v)}catch(e){}tower()}
$('l1').onclick=()=>setLayout('up');$('l2').onclick=()=>setLayout('flat');
function face(f,n){
 if(!f)return '<div class="pg b-white"></div>';
 if(f.end)return '<div class="pg b-white"><div class="end">hết rồi, chờ chuyến sau ✈️</div></div>';
 if(f.endpaper)return '<div class="pg b-white"></div>';
 if(f.title)return `<div class="pg b-white"><div class="title"><h3>${esc(cur.title)}</h3><p>${esc(cur.sub||'')}</p></div></div>`;
 const im=f.im||[],ph=u=>`style="background-image:url('${u}')"`;let h='';
 if(f.l==='hero'&&im[0])h=`<div class="hero" ${ph(im[0])}></div><div class="cap" style="bottom:5%">${esc(f.t)}</div>`;
 else if(f.l==='quote'||!im.length)h=`<div class="cap big">${esc(f.t)}</div>`;
 else{const n=Math.min(im.length,5);
  const S=[[[14,14,72,-3]],[[6,5,52,-4],[40,50,52,3]],[[4,4,44,-4],[50,10,42,4],[24,58,50,-2]],[[3,3,38,-4],[55,5,38,3],[5,64,40,3],[53,62,40,-3]],[[3,3,38,-4],[55,5,36,3],[2,38,30,-3],[6,66,40,3],[53,64,40,-3]]][n-1];
  const T=[[10,76,80],[4,62,34],[22,46,56],[16,40,68],[36,38,60]][n-1];
  const w=(f.t||'').split(/\s+/).filter(Boolean),ln=[];for(let k=0;k<w.length;k+=2)ln.push(w.slice(k,k+2).join(' '));
  const fs=n===5||n===2?5.2:7;
  h=im.slice(0,n).map((u,k)=>`<div class="pol" style="--w:${S[k][2]}cqw;--x:${S[k][0]}%;--y:${S[k][1]}%;--r:${S[k][3]}deg"><i ${ph(u)}></i></div>`).join('')+
   `<div class="lab" style="left:${T[0]}%;top:${T[1]}%;width:${T[2]}%;font-size:${fs}cqw">${ln.map(x=>`<span>${esc(x)}</span>`).join('')}</div>`}
 return `<div class="pg b-${f.bg||'white'}">${h}${f.s?`<div class="stk">${f.s}</div>`:''}<span class="pn">${n-1}</span></div>`;
}
const single=()=>innerWidth<760;
function buildFaces(){faces=[{endpaper:1},{title:1},...cur.pages];if(faces.length%2)faces.push({end:1})}
function paint(){const s=single(),idx=s?[i]:[i,i+1];
 $('sp').innerHTML=idx.map(k=>`<div class="face">${face(faces[k],k)}</div>`).join('');
 $('pv').textContent=i<=0?'‹ Đóng bìa':'‹ Trước';$('pv').disabled=false;$('nx').disabled=i+(s?1:2)>=faces.length}
function openBook(id){
 cur=books.find(b=>b.id===id);buildFaces();i=0;busy=0;
 const dk=lum(cur.c)>.62,tc=dk?shade(cur.c,-.45):'#fff',fs=Math.min(20,84/(cur.title.length*.47));
 show(`<div class="wrap ${single()?'one':''}" style="--cc:${cur.c}"><div class="bookbox" id="bb"><div class="spread" id="sp"></div>
 <div class="cover" id="cv"><div class="cf" style="background:${cur.c};color:${tc}"><h2 style="font-size:${fs}cqw">${esc(cur.title)}</h2>${art(cur.a,cur.c)}<small>${esc(cur.sub||'')}</small></div><div class="cb"></div></div></div>
 <div class="bar" id="bar" style="opacity:0;pointer-events:none"><button class="btn" id="pv">‹ Trước</button><button class="btn" id="nx">Sau ›</button><button class="btn pri" id="ad">+ Thêm trang</button><button class="btn" id="dl">Xóa sách</button></div></div>`);
 paint();
 $('cv').onclick=openCover;
 $('pv').onclick=()=>i<=0?closeCover():flip(-1);$('nx').onclick=()=>flip(1);$('ad').onclick=addPage;
 $('dl').onclick=async()=>{if(!confirm('Xóa quyển sách này?'))return;try{await dbDeleteBook(cur);books=books.filter(b=>b!==cur);tower();hide()}catch(e){fail(e)}};
}
function openCover(){const bb=$('bb');bb.classList.add('opened');$('bar').style.opacity=1;$('bar').style.pointerEvents='auto';
 setTimeout(()=>{if(bb.classList.contains('opened'))bb.classList.add('gone')},1000)}
function closeCover(){if(busy)return;const bb=$('bb');bb.classList.remove('gone');void bb.offsetWidth;bb.classList.remove('opened');
 $('bar').style.opacity=0;$('bar').style.pointerEvents='none'}
function flip(d){
 const s=single(),step=s?1:2,n=i+d*step;if(busy||n<0||n>=faces.length)return;busy=1;
 const sp=$('sp'),lf=document.createElement('div');lf.className='leaf '+(d>0?'r':'l');
 const F=k=>`<div class="face" style="width:100%;height:100%">${face(faces[k],k)}</div>`;
 if(s){lf.innerHTML=`<div class="fr">${F(i)}</div>`;sp.innerHTML=`<div class="face">${face(faces[n],n)}</div>`;sp.append(lf);lf.style.transformOrigin=d>0?'left':'right';
  requestAnimationFrame(()=>{lf.style.transform=`rotateY(${d>0?-100:100}deg)`;lf.style.opacity=0})}
 else{const a=d>0?i+1:i,b=d>0?i+2:i-1;lf.innerHTML=`<div class="fr">${F(a)}</div><div class="bk">${F(b)}</div>`;
  sp.innerHTML=`<div class="face">${face(faces[d>0?i:i-2],d>0?i:i-2)}</div><div class="face">${face(faces[d>0?i+3:i+1],d>0?i+3:i+1)}</div>`;sp.append(lf);
  requestAnimationFrame(()=>{lf.style.transform=`rotateY(${d>0?-180:180}deg)`})}
 lf.querySelectorAll('.fr,.bk').forEach(x=>x.style.background='#fff');
 setTimeout(()=>{i=n;busy=0;paint()},830);
}
function show(h){$('slot').innerHTML=h;$('ov').classList.add('on')}
function hide(){$('ov').classList.remove('on');$('slot').innerHTML='';cur=null}
$('close').onclick=hide;
addEventListener('keydown',e=>{if(e.key==='Escape')hide();if(cur&&$('sp')){const op=$('bb').classList.contains('opened');if(e.key==='ArrowRight')op?flip(1):openCover();if(e.key==='ArrowLeft'&&op)$('pv').click()}});
$('m1').onclick=()=>{mode='color';$('m1').classList.add('on');$('m2').classList.remove('on');tower()};
$('m2').onclick=()=>{mode='new';$('m2').classList.add('on');$('m1').classList.remove('on');tower()};
$('addbook').onclick=()=>newBook();
function chips(id,arr,fn){const el=$(id);el.innerHTML=arr.map((a,k)=>`<button data-k="${k}" class="${k?'':'sel'}" ${fn(a,k)}>${a.txt??''}</button>`).join('');
 el.onclick=e=>{const b=e.target.closest('button');if(!b)return;[...el.children].forEach(x=>x.classList.toggle('sel',x===b));el.dataset.v=b.dataset.k};el.dataset.v=0}
function newBook(){
 show(`<div class="panel"><h3>Quyển sách mới</h3><div class="cvp" id="cvp"></div><label>Tên</label><input type="text" id="nt" placeholder="Ví dụ: Phú Quốc" maxlength="20">
 <label>Thời gian</label><input type="text" id="ns" placeholder="7 / 2026" maxlength="14"><label>Màu bìa</label><div class="chips" id="cc"></div><div class="ph">Hoặc chọn màu riêng: <input type="color" id="cu" value="#c4a484" style="vertical-align:middle"></div>
 <label>Hình trên bìa</label><div class="chips t" id="aa"></div><div class="bar"><button class="btn" id="no">Hủy</button><button class="btn pri" id="ok">Xếp lên kệ</button></div></div>`);
 chips('cc',COL.map(c=>({c})),a=>`style="background:${a.c};box-shadow:inset 0 0 0 1px rgba(0,0,0,.15)"`);chips('aa',ARTN.map(t=>({txt:t})),()=>'');
 const pn=$('cvp').parentElement,upd=()=>{const c=bookColor(),p=$('cvp');p.style.background=c;p.style.color=lum(c)>.62?shade(c,-.45):'#fff';p.innerHTML=`<b>${esc($('nt').value.trim()||'Tên sách')}</b>${art(+$('aa').dataset.v,c)}`};
 $('cc').addEventListener('click',e=>{if(e.target.closest('button'))delete $('cc').dataset.custom});
 $('cu').oninput=e=>{$('cc').dataset.custom=e.target.value;[...$('cc').children].forEach(x=>x.classList.remove('sel'))};
 pn.addEventListener('input',upd);pn.addEventListener('click',upd);upd();
 $('no').onclick=hide;
 $('ok').onclick=async()=>{const t=$('nt').value.trim();if(!t){$('nt').focus();return}
  try{books.push(await dbAddBook({title:t,sub:$('ns').value.trim(),c:bookColor(),a:+$('aa').dataset.v,t:34+Math.round(Math.random()*32)}));tower();hide()}catch(e){fail(e)}};
}
function shrink(file){return new Promise(r=>{const fr=new FileReader();fr.onload=()=>{const im=new Image();im.onload=()=>{const s=Math.min(1,600/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*s;c.height=im.height*s;c.getContext('2d').drawImage(im,0,0,c.width,c.height);c.toBlob(bl=>r(bl),'image/jpeg',.7)};im.src=fr.result};fr.readAsDataURL(file)})}
function addPage(){
 const keep=cur;let imgs=[];
 show(`<div class="panel"><h3>Thêm trang</h3><label>Ảnh (tối đa 5)</label><input type="file" id="fi" accept="image/*" multiple style="width:100%"><div class="ph" id="ph"></div>
 <label>Kiểu trang</label><div class="chips t" id="ll"></div><label>Nền giấy</label><div class="chips t" id="bg"></div>
 <label>Hình dán</label><div class="chips" id="st"></div><label>Ghi chú (nên ngắn gọn)</label><textarea id="tx" placeholder="Ví dụ: Một năm của chúng mình"></textarea>
 <div class="bar"><button class="btn" id="no">Hủy</button><button class="btn pri" id="ok">Lưu trang</button></div></div>`);
 chips('ll',LAYN.map(t=>({txt:t})),()=>'');chips('bg',BGN.map(t=>({txt:t})),()=>'');chips('st',STK.map(t=>({txt:t||'∅'})),()=>'');
 $('fi').onchange=async e=>{imgs=[];for(const f of [...e.target.files].slice(0,5))imgs.push(await shrink(f));$('ph').textContent=imgs.length+' ảnh đã sẵn sàng'};
 $('no').onclick=()=>openBook(keep.id);
 $('ok').onclick=async()=>{const bt=$('ok');bt.disabled=true;bt.textContent='Đang lưu...';
  try{keep.pages.push(await dbAddPage(keep,{l:LAY[$('ll').dataset.v],bg:BG[$('bg').dataset.v],t:$('tx').value.trim(),s:STK[$('st').dataset.v]},imgs))}catch(e){fail(e);bt.disabled=false;bt.textContent='Lưu trang';return}
  openBook(keep.id);$('cv').click();buildFaces();i=single()?faces.length-1:faces.length-2;paint()};
}
try{layout=localStorage.getItem('ksk3layout')||'up'}catch(e){}
(async()=>{$('tower').innerHTML='<p class="empty">Đang tải kệ sách...</p>';try{books=await dbLoadBooks()}catch(e){fail(e)}setLayout(layout)})();