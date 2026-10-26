// Khu vực KỆ SÁCH KỶ NIỆM: gáy sách, book nook, nhìn gần / nhìn xa, mở sách, lật trang, thêm trang, vé lưu niệm.
// Dùng các tiện ích chung trong core/ui.js và dữ liệu trong shelf/shelf-db.js.
// Hình nhỏ cho các kiểu trang, dùng trong bảng thêm trang.
const LAYIC={
 scatter:'<svg viewBox="0 0 40 52" aria-hidden="true"><rect width="40" height="52" rx="2" fill="#fff"/><rect x="4" y="5" width="15" height="17" fill="#c9d9e6" transform="rotate(-6 11 13)"/><rect x="21" y="8" width="15" height="17" fill="#e8d2b8" transform="rotate(5 28 16)"/><rect x="11" y="28" width="16" height="18" fill="#cfe3cf" transform="rotate(-3 19 37)"/></svg>',
 hero:'<svg viewBox="0 0 40 52" aria-hidden="true"><rect width="40" height="52" rx="2" fill="#fff"/><rect x="4" y="4" width="32" height="33" fill="#c9d9e6" stroke="#fbfaf6" stroke-width="2" transform="rotate(-2 20 20)"/><rect x="9" y="42" width="22" height="2.5" rx="1" fill="#b9a78d"/></svg>',
 ticket:'<svg viewBox="0 0 40 52" aria-hidden="true"><rect width="40" height="52" rx="2" fill="#fff"/><g transform="rotate(-6 20 15)"><path d="M5 8h30v14H5z" fill="#e8c15a"/><circle cx="27" cy="8" r="2" fill="#fff"/><circle cx="27" cy="22" r="2" fill="#fff"/><path d="M27 10v10" stroke="#fff" stroke-dasharray="1.4 1.4"/></g><path d="M12 27h17v19l-1.7-1.6-1.7 1.6-1.7-1.6-1.7 1.6-1.7-1.6-1.7 1.6-1.7-1.6-1.7 1.6-1.7-1.6-1.7 1.6z" fill="#f2ece0" stroke="#d9cdb6" stroke-width=".6" transform="rotate(4 20 36)"/><path d="M15 31h11M15 34h8M15 37h10" stroke="#b9a78d" stroke-width="1" transform="rotate(4 20 36)"/></svg>',
 quote:'<svg viewBox="0 0 40 52" aria-hidden="true"><rect width="40" height="52" rx="2" fill="#fff"/><rect x="7" y="19" width="26" height="2.5" rx="1" fill="#b9a78d"/><rect x="9" y="25" width="22" height="2.5" rx="1" fill="#b9a78d"/><rect x="12" y="31" width="16" height="2.5" rx="1" fill="#b9a78d"/></svg>'
};
const COL=['#8b1e2b','#c97b63','#e07a5f','#f4b6a6','#e9965a','#f2d08a','#e8c15a','#a3a35a','#a9bf8f','#7fa37a','#2f6f5e','#3f8f8b','#9fd3c7','#8cc1d9','#3f6ea8','#2c4a7c','#7a6fb0','#b9aee0','#e8a7c0','#f4c2d7','#b08968','#efe6d6','#8a8f98','#3d3a36'];
const ARTN=['Vòm cổng','Hoa','Sóng','Núi','Cọ','Chùa','Thuyền','Hoa sen','Đèn lồng','Nón lá','Máy bay','Cây thông'];
const BG=['white','cream','grid','kraft','mint','rose'],BGN=['Trắng','Kem','Ô vuông','Kraft','Mint','Hồng'];
const LAY=['scatter','hero','quote','ticket'],LAYN=['Ảnh rải','Ảnh lớn','Chỉ chữ','Vé lưu niệm'];
const STK=['','🌿','☀️','🌊','⛰️','🍜','📷','❤️','⭐','🎒'];
const MARKC=['#d9483b','#e8c15a','#3f6ea8','#2f6f5e','#e8a7c0'];
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

let look='near',morphing=0,nook=true,layout='up',books=[],mode='color',cur=null,i=0,busy=0,faces=[],pulled=null;

// ---------- Bụi: quyển lâu không mở sẽ phủ bụi (ghi nhớ trên trình duyệt này) ----------
const SEEN=(()=>{try{return JSON.parse(store.get('ksk3seen')||'{}')||{}}catch(e){return{}}})();
const dustOf=b=>{const t=SEEN[b.id]||b.ts||Date.now(),days=(Date.now()-t)/864e5;return Math.max(0,Math.min(1,(days-14)/150))};
function markSeen(id){SEEN[id]=Date.now();store.set('ksk3seen',JSON.stringify(SEEN))}
function dustOff(el){if(!el||!el.classList.contains('dusty'))return;SFX.play('puff');el.classList.add('puff');setTimeout(()=>{el.classList.remove('dusty','puff');el.querySelector('.dust')?.remove()},800)}

// ---------- Vé lưu niệm: ảnh vé thành mẩu giấy, bấm để lật xem ghi chú mặt sau ----------
// Vị trí cho 1, 2, 3 vé: [trái %, trên %, rộng tối đa cqw, góc xoay, cao tối đa cqw]
const TKP=[[[12,13,80,-3,92]],[[4,6,66,-4,60],[30,46,64,3,58]],[[3,3,58,-5,44],[38,25,58,4,44],[8,54,58,-2,42]]];
const torn=s=>{let v=s*7919+13;const r=()=>(v=(v*9301+49297)%233280)/233280,P=[];
 for(let x=0;x<=100;x+=5)P.push(`${x}% ${(r()*2.4).toFixed(1)}%`);for(let y=5;y<=95;y+=6)P.push(`${(100-r()*2.4).toFixed(1)}% ${y}%`);
 for(let x=100;x>=0;x-=5)P.push(`${x}% ${(100-r()*2.8).toFixed(1)}%`);for(let y=95;y>=5;y-=6)P.push(`${(r()*2.4).toFixed(1)}% ${y}%`);return `polygon(${P.join(',')})`};
function tickets(f){const im=(f.im||[]).slice(0,3),n=im.length,P=TKP[n-1],tk=(f.x&&f.x.tk)||[],sub=esc((cur&&cur.sub)||'');
 return im.map((u,k)=>{const d=tk[k]||{},r=Math.max(.25,Math.min(4,+d.r||1.5)),[x0,y,W,rot,H]=P[k],w=Math.min(W,H*r),x=n===1?(100-w)/2:Math.min(x0,98-w);
  // vé dài như hóa đơn: mép răng cưa; vé ngang: có lỗ bấm và đường xé; còn lại: mép giấy xé
  const kind=r<.7?'receipt':r>1.25?'stub':'torn',len=Math.max(8,(d.n||'Chưa có ghi chú').length+6),fs=Math.max(2.4,Math.min(4.8,Math.sqrt(w*(w/r)*.42/(len*.55)))),cp=kind==='torn'?'clip-path:'+torn(k*7+n+(d.n||'').length):'',clip=cp?` style="${cp}"`:'';
  return `<div class="tk tk-${kind}" role="button" tabindex="0" aria-label="Vé ${k+1}: bấm để lật xem mặt sau" style="--k:${k};--r:${rot}deg;left:${x.toFixed(1)}%;top:${y}%;width:${w.toFixed(1)}cqw;aspect-ratio:${r.toFixed(3)}"><div class="tki">
   <div class="tkf"><div class="tkm"${clip}><i style="background-image:url('${u}')"></i></div></div>
   <div class="tkb"><div class="tkm" style="--fs:${fs.toFixed(2)}cqw;${cp}"><p>${d.n?esc(d.n):'<em>Chưa có ghi chú</em>'}</p>${sub?`<span class="tks">${sub}</span>`:''}</div></div></div></div>`}).join('')+(f.t?`<div class="cap">${esc(f.t)}</div>`:'')}
document.addEventListener('click',e=>{const t=e.target.closest('.tk');if(!t||t.closest('.leaf'))return;t.classList.toggle('flip');SFX.play('tick')});
document.addEventListener('keydown',e=>{const t=e.target.closest&&e.target.closest('.tk');if(t&&(e.key==='Enter'||e.key===' ')){e.preventDefault();e.stopPropagation();t.click()}},true);

// ---------- gáy sách ----------
const stats=b=>{const np=b.pages.length,ni=b.pages.reduce((s,p)=>s+(p.im||[]).length,0);return `${np} trang · ${ni} ảnh`};
const bh=b=>190+(b.seed*13%46);
function mkSpine(b){const e=document.createElement('button'),lt=lum(b.c)>.62,h=bh(b);
 e.className='spine s'+(hs(b.id+b.title)%4);
 e.style.cssText=`--t:${b.t}px;--h:${h}px;--fs:${Math.min(24,Math.max(9,(h-100)/(b.title.length*.95))).toFixed(1)}px;--ff:${Math.min(30,b.t*.46).toFixed(1)}px;--bd:${shade(b.c,-.32)};--bl:${shade(b.c,.4)};background-color:${b.c};color:${lt?shade(b.c,-.5):'#fff'}`;
 e.innerHTML=`<span class="tt">${esc(b.title)}</span><small>${esc(b.sub||'')}</small>${b.private?`<i class="plock" title="Riêng tư: chỉ bạn thấy">${ic('lock')}</i>`:''}`;
 e.title=`${b.title} · ${stats(b)}`;e.setAttribute('aria-label',`Mở sách ${b.title}, ${stats(b)}`);
 const du=dustOf(b);if(du>.02){e.classList.add('dusty');e.style.setProperty('--dust',du.toFixed(2));e.insertAdjacentHTML('beforeend','<i class="dust" aria-hidden="true"></i>')}
 e.dataset.id=b.id;e.onclick=()=>pull(e,b.id);return e}

function tower(){
 pulled=null;
 const L=[...books].sort((a,b)=>mode==='color'?hue(a.c)-hue(b.c):b.ts-a.ts),t=$('tower');t.innerHTML='';
 t.className='tower '+(layout==='flat'?'flat':'up');t.hidden=look==='far';$('far').hidden=look!=='far';
 $('hint').textContent=layout==='flat'?'Chạm một quyển để rút nó ra khỏi chồng sách':'Chạm một quyển để rút ra đọc. Rê chuột qua hộp nook để nhìn sâu vào trong, bấm công tắc để tắt đèn';
 if(!books.length){t.innerHTML=`<div class="empty">${ic('bookOpen')}<p>${me?'Kệ còn trống. Bấm “Làm quyển sách mới” để xếp quyển đầu tiên.':'Kệ sách đang trống.'}</p></div>`;return}
 layout==='flat'?flatScene(t,L):upScene(t,L);
 if(look==='far'){renderFar(L);$('hint').textContent=farHint()}req();
}

// ---------- Góc nhìn xa: cả tủ sách thu nhỏ vừa màn hình ----------
const RH=294,CASEP=[16,16,16,16];// chiều cao một tầng (kệ + ván + khoảng hở), đệm của tủ: trên, phải, dưới, trái
function renderFar(L){const f=$('far');f.innerHTML='';
 if(!L)L=[...books].sort((a,b)=>mode==='color'?hue(a.c)-hue(b.c):b.ts-a.ts);f.hidden=false;
 if(layout==='flat')return renderFarFlat(L,f);
 const NW=126,seq=[];L.forEach((b,k)=>{seq.push(b);if(nook&&(k+1)%7===4)seq.push({nk:1,t:NW})});
 const tot=seq.reduce((s,b)=>s+b.t+1,0),big=Math.max(...seq.map(b=>b.t)),aw=Math.min(innerWidth-24,1500),ah=Math.max(240,innerHeight-document.querySelector('header').offsetHeight-48);
 // thử số tầng để tủ có tỉ lệ gần với màn hình nhất (tủ to nhất mà vẫn vừa)
 let best=null;for(let r=1;r<=Math.max(1,Math.ceil(tot/300));r++){const w=Math.max(tot/r*1.06+big,560)+CASEP[1]+CASEP[3]+36,h=r*RH+CASEP[0]+CASEP[2]-2,s=Math.min(aw/w,ah/h,.72);if(!best||s>best.s)best={r,w,s}}
 const W=best.w-CASEP[1]-CASEP[3]-36;let rows=[[]],u=0,nn=0;
 seq.forEach(b=>{if(u+b.t+1>W&&rows.at(-1).length){rows.push([]);u=0}rows.at(-1).push(b);u+=b.t+1});
 const cs=document.createElement('div');cs.className='case';cs.style.width=best.w+'px';const bk=document.createElement('div');bk.className='cback';cs.append(bk);
 rows.forEach(r=>{while(r.length&&r.at(-1).nk)r.pop();while(r[0]&&r[0].nk)r.shift();if(!r.length)return;const row=document.createElement('div');row.className='row';
  r.forEach(b=>{if(b.nk)row.append(mkNook(nn++));else{const e=mkSpine(b);e.onclick=()=>setView('near',b.id);e.setAttribute('aria-label',`Phóng tới sách ${b.title}`);row.append(e)}});
  bk.append(row);const bd=document.createElement('div');bd.className='board';bk.append(bd)});
 f.append(cs);const nr=bk.querySelectorAll('.row').length,H=CASEP[0]+CASEP[2]+22+nr*RH-26,s=Math.max(.2,Math.min(aw/best.w,(ah-30)/H,.72));
 cs.style.transform=`scale(${s})`;f.style.width=best.w*s+'px';f.style.height=H*s+'px'}

// Xếp nằm nhìn xa: chia thành các chồng tối đa 50 quyển, đứng cạnh nhau trên một chiếc ghế dài.
const PILE=50,farHint=()=>layout==='flat'?'Toàn cảnh các chồng sách, mỗi chồng tối đa 50 quyển. Bấm một quyển để phóng tới chỗ nó':'Toàn cảnh tủ sách. Bấm một quyển để phóng tới chỗ nó';
function renderFarFlat(L,f){const aw=Math.min(innerWidth-24,1500),ah=Math.max(240,innerHeight-document.querySelector('header').offsetHeight-48);
 const sc=document.createElement('div');sc.className='tower flat fflat';const ps=document.createElement('div');ps.className='piles';
 for(let k=0;k<L.length;k+=PILE){const pile=document.createElement('div');pile.className='pile';const st=document.createElement('div');st.className='stack';
  [...L.slice(k,k+PILE)].reverse().forEach(b=>{const s=document.createElement('div');s.className='slot';s.style.setProperty('--o',(hs(b.id+b.title)%20)-4+'px');
   const e=mkSpine(b);e.onclick=()=>setView('near',b.id);e.setAttribute('aria-label',`Phóng tới sách ${b.title}`);s.append(e);st.append(s)});
  const n=document.createElement('span');n.className='pnum';n.textContent=`${k+1}–${Math.min(L.length,k+PILE)}`;pile.append(st,n);ps.append(pile)}
 const bn=document.createElement('div');bn.className='bench';sc.append(ps,bn);f.append(sc);
 const W=sc.offsetWidth,H=sc.offsetHeight,s=Math.max(.12,Math.min(aw/W,(ah-10)/H,.6));
 sc.style.transform=`scale(${s})`;f.style.width=W*s+'px';f.style.height=H*s+'px'}
// Chuyển giữa gần và xa: cảnh cũ phóng/thu về phía một quyển sách, cảnh mới hiện ra từ đúng chỗ quyển đó.
function centerSpine(box){let best=null,d=1e9;const cx=innerWidth/2,cy=innerHeight/2;
 box.querySelectorAll('.spine').forEach(e=>{const r=e.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;const q=Math.hypot(r.left+r.width/2-cx,r.top+r.height/2-cy);if(q<d){d=q;best=e}});return best}
function setView(v,id){if(morphing||(v===look&&!id))return;const from=look;if(!books.length)v='near';look=v;store.set('ksk3view',v);drawView();
 const out=from==='far'?$('far'):$('tower'),inc=v==='far'?$('far'):$('tower');
 // đo quyển mốc ở cảnh cũ trước khi dựng cảnh mới
 const a=from===v?null:id?out.querySelector(`.spine[data-id="${CSS.escape(id)}"]`):centerSpine(out),bid=a&&a.dataset.id,skip=RM()||!a||out.hidden;
 const ra=a&&a.getBoundingClientRect(),ro=out.getBoundingClientRect();
 if(v==='far'){renderFar();$('hint').textContent=farHint()}else tower();
 if(from===v){inc.hidden=false;return found(inc,id)}
 SFX.play(v==='far'?'slide':'pull');
 if(skip){out.hidden=true;inc.hidden=false;if(v==='far')scrollTo({top:0,behavior:'instant'});return found(inc,bid)}
 morphing=1;
 out.hidden=false;out.style.cssText+=`;position:fixed;left:${ro.left}px;top:${ro.top}px;width:${ro.width}px;height:${ro.height}px;margin:0;z-index:7;pointer-events:none`;
 inc.hidden=false;const b=inc.querySelector(`.spine[data-id="${CSS.escape(bid)}"]`);
 if(v==='near'&&b){const r=b.getBoundingClientRect();scrollTo({top:Math.max(0,scrollY+r.top+r.height/2-innerHeight*.55),behavior:'instant'})}else scrollTo({top:0,behavior:'instant'});
 const fin=()=>{out.hidden=true;out.style.position=out.style.left=out.style.top=out.style.margin=out.style.zIndex=out.style.pointerEvents='';if(out.id==='tower')out.style.width=out.style.height='';
  inc.style.transformOrigin='';morphing=0;req();found(inc,bid)};
 if(!b){fin();return}
 const rb=b.getBoundingClientRect(),ri=inc.getBoundingClientRect(),k=Math.sqrt(ra.width*ra.height/(rb.width*rb.height)),D=760,E='cubic-bezier(.6,0,.2,1)';
 inc.style.transformOrigin=`${rb.left-ri.left}px ${rb.top-ri.top}px`;out.style.transformOrigin=`${ra.left-ro.left}px ${ra.top-ro.top}px`;
 inc.animate({transform:[`translate(${ra.left-rb.left}px,${ra.top-rb.top}px) scale(${k})`,'none']},{duration:D,easing:E});
 inc.animate({opacity:[0,1]},{duration:D*.5,easing:'ease-out'});
 out.animate({transform:['none',`translate(${rb.left-ra.left}px,${rb.top-ra.top}px) scale(${1/k})`]},{duration:D,easing:E});
 out.animate({opacity:[1,1,0]},{duration:D,easing:'linear'}).onfinish=fin}
function found(box,id){if(!id||look!=='near')return;const e=box.querySelector(`.spine[data-id="${CSS.escape(id)}"]`);if(!e)return;e.classList.remove('found');void e.offsetWidth;e.classList.add('found');setTimeout(()=>e.classList.remove('found'),2000)}
function drawView(){$('v1').classList.toggle('on',look==='near');$('v2').classList.toggle('on',look==='far');$('v1').setAttribute('aria-pressed',look==='near');$('v2').setAttribute('aria-pressed',look==='far')}
{const g=document.createElement('div');g.className='seg';g.setAttribute('role','group');g.setAttribute('aria-label','Góc nhìn');
 g.innerHTML=`<button id="v1" type="button">${ic('zoomIn')}<span>Nhìn gần</span></button><button id="v2" type="button">${ic('bookcase')}<span>Nhìn xa</span></button>`;
 document.querySelector('.toolbar').prepend(g);$('v1').onclick=()=>setView('near');$('v2').onclick=()=>setView('far');
 const f=document.createElement('div');f.id='far';f.className='farwrap';f.hidden=true;$('tower').after(f)}

// Xếp đứng: kệ ván phẳng như bản đầu, nook xen giữa sách.
function mkNook(n){const e=document.createElement('div');e.className='nook';e.innerHTML=NK.nook(n);return e}
function upScene(t,L){
 const W=Math.min(t.clientWidth||880,880)-36,NW=126,seq=[];let rows=[[]],u=0,nn=0;
 L.forEach((b,k)=>{seq.push(b);if(nook&&(k+1)%7===4)seq.push({nk:1,t:NW})});if(nook&&L.length<2)seq.push({nk:1,t:NW});
 seq.forEach(b=>{if(u+b.t+1>W&&rows.at(-1).length){rows.push([]);u=0}rows.at(-1).push(b);u+=b.t+1});
 rows.forEach((r,ri)=>{while(r[0]&&r[0].nk)r.shift();if(ri<rows.length-1)while(r.length&&r.at(-1).nk)r.pop();if(!r.length)return;
  const row=document.createElement('div');row.className='row';
  r.forEach(b=>row.append(b.nk?mkNook(nn++):mkSpine(b)));
  t.append(row);const bd=document.createElement('div');bd.className='board';t.append(bd)});
}

// Xếp nằm: chồng sách trên mặt bàn như bản đầu.
function flatScene(t,L){
 const st=document.createElement('div');st.className='stack';
 [...L].reverse().forEach(b=>{const s=document.createElement('div');s.className='slot';s.style.setProperty('--o',(hs(b.id+b.title)%20)-4+'px');s.append(mkSpine(b));st.append(s)});
 const tb=document.createElement('div');tb.className='table';t.append(st,tb);
}

// Rút sách: xếp đứng thì nhấc lên khỏi kệ, xếp nằm thì trượt ra ngang và các quyển phía trên hạ xuống.
function pull(el,id){if(pulled||cur)return;SFX.play('pull');dustOff(el);
 if(layout==='flat'){const slot=el.parentElement,all=[...slot.parentElement.children],k=all.indexOf(slot),above=all.slice(k+1),H=slot.offsetHeight+1,n=above.length;
  slot.style.setProperty('--dir',k%2?-1:1);slot.classList.add('out');const T=[];pulled={slot,above,T};
  if(matchMedia('(prefers-reduced-motion:reduce)').matches){T.push(setTimeout(()=>openBook(id),150));return}
  const at=(ms,f)=>T.push(setTimeout(f,ms));
  // 1) quyển được chọn trượt ra, các quyển phía trên rung nhẹ vì ma sát
  at(130,()=>above.forEach((a,j)=>{a.style.animationDelay=j*22+'ms';a.classList.add('jig')}));
  // 2) cả chồng phía trên rơi xuống lấp chỗ trống, từng quyển một, có nảy nhẹ khi chạm
  at(600,()=>above.forEach((a,j)=>{a.classList.remove('jig');a.style.transitionDelay=j*50+'ms';a.style.translate=`0 ${H}px`}));
  // 3) quyển vừa rút nhấc về phía người xem rồi mở ra
  at(1050+n*50,()=>slot.classList.add('lift'));
  at(1330+n*50,()=>openBook(id))}
 else{el.classList.add('out');pulled={el};setTimeout(()=>openBook(id),380)}}
function unpull(){const p=pulled;pulled=null;if(!p)return;SFX.play('slide');
 if(p.slot){p.T.forEach(clearTimeout);p.slot.classList.remove('lift');const n=p.above.length;
  // chồng phía trên nâng lên trước, rồi quyển được trượt lại vào chỗ cũ
  p.above.forEach((a,j)=>{a.classList.remove('jig');a.style.transitionDelay=(n-1-j)*30+'ms';a.style.translate=''});
  setTimeout(()=>{p.slot.classList.remove('out');p.slot.style.removeProperty('--dir')},280+n*30)}
 else p.el.classList.remove('out')}

// Góc nhìn vào nook đi theo chuột (máy tính) hoặc vị trí cuộn (điện thoại).
let eye=null,rq=0;
const req=()=>{if(!rq)rq=requestAnimationFrame(()=>{rq=0;view()})};
addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){eye=[e.clientX,e.clientY];req()}},{passive:true});
addEventListener('scroll',req,{passive:true});
function view(){const ex=eye?eye[0]:innerWidth/2,ey=eye?eye[1]:innerHeight*.45;
 document.querySelectorAll('.nk-clip').forEach(c=>{const r=c.getBoundingClientRect();if(r.bottom<-50||r.top>innerHeight+50)return;
  const px=Math.max(-70,Math.min(170,(ex-r.left)/r.width*100)),py=Math.max(-25,Math.min(125,(ey-r.top)/r.height*100));
  const pb=Math.max(-90,Math.min(125,py+(+c.dataset.bias||0)));c.style.perspectiveOrigin=`${px.toFixed(1)}% ${pb.toFixed(1)}%`;c.style.setProperty('--gx',((px-50)/120).toFixed(3))})}

document.addEventListener('click',e=>{const b=e.target.closest('.nk-sw');if(!b)return;const n=b.closest('.nook'),off=n.classList.toggle('off');SFX.play('click');b.setAttribute('aria-pressed',String(!off));b.setAttribute('aria-label',(off?'Bật':'Tắt')+' đèn nook')});
let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{if(!cur)tower()},200)});
function setLayout(v){layout=v;$('l1').classList.toggle('on',v==='up');$('l2').classList.toggle('on',v==='flat');$('l1').setAttribute('aria-pressed',v==='up');$('l2').setAttribute('aria-pressed',v==='flat');$('l3').disabled=v==='flat';store.set('ksk3layout',v);tower()}
$('l1').onclick=()=>setLayout('up');$('l2').onclick=()=>setLayout('flat');
$('l3').onclick=()=>{nook=!nook;$('l3').classList.toggle('on',nook);$('l3').setAttribute('aria-pressed',nook);store.set('ksk3nook',nook?'1':'0');tower()};

function face(f,n,pv){
 if(!f)return '<div class="pg b-white"></div>';
 if(f.end)return '<div class="pg b-white"><div class="end">hết rồi, chờ chuyến sau ✈️</div></div>';
 if(f.endpaper)return '<div class="pg b-white"></div>';
 if(f.title)return `<div class="pg b-white"><div class="title"><h3>${esc(cur.title)}</h3><p>${esc(cur.sub||'')}</p></div></div>`;
 const im=f.im||[],ph=u=>`style="background-image:url('${u}')"`;let h='';
 if(f.l==='ticket'&&im[0])h=tickets(f);
 else if(f.l==='hero'&&im[0])h=`<div class="hero" ${ph(im[0])}></div><div class="cap" style="bottom:5%">${esc(f.t)}</div>`;
 else if(f.l==='quote'||!im.length)h=`<div class="cap big">${esc(f.t)}</div>`;
 else{const n=Math.min(im.length,5);
  const S=[[[14,14,72,-3]],[[6,5,52,-4],[40,50,52,3]],[[4,4,44,-4],[50,10,42,4],[24,58,50,-2]],[[3,3,38,-4],[55,5,38,3],[5,64,40,3],[53,62,40,-3]],[[3,3,38,-4],[55,5,36,3],[2,38,30,-3],[6,66,40,3],[53,64,40,-3]]][n-1];
  const T=[[10,76,80],[4,62,34],[22,46,56],[16,40,68],[36,38,60]][n-1];
  const w=(f.t||'').split(/\s+/).filter(Boolean),ln=[];for(let k=0;k<w.length;k+=2)ln.push(w.slice(k,k+2).join(' '));
  const fs=n===5||n===2?5.2:7;
  h=im.slice(0,n).map((u,k)=>`<div class="pol" style="--k:${k};--w:${S[k][2]}cqw;--x:${S[k][0]}%;--y:${S[k][1]}%;--r:${S[k][3]}deg"><i ${ph(u)}></i></div>`).join('')+
   `<div class="lab" style="left:${T[0]}%;top:${T[1]}%;width:${T[2]}%;font-size:${fs}cqw">${ln.map(x=>`<span>${esc(x)}</span>`).join('')}</div>`}
 return `<div class="pg b-${f.bg||'white'}">${h}${f.s?`<div class="stk">${f.s}</div>`:''}${pv?'':`<span class="pn">${n-1}</span><button class="pdel" data-i="${n-2}" aria-label="Xóa trang này" title="Xóa trang">${ic('trash')}</button>`}</div>`;
}

const single=()=>innerWidth<760;
function buildFaces(){faces=[{endpaper:1},{title:1},...cur.pages];if(faces.length%2)faces.push({end:1})}
function paint(drop){const s=single(),idx=s?[i]:[i,i+1];
 $('sp').innerHTML=idx.map(k=>`<div class="face${drop?' drop':''}">${face(faces[k],k)}</div>`).join('');
 $('pv').innerHTML=ic('chevL')+(i<=0?'Đóng bìa':'Trước');$('nx').disabled=i+(s?1:2)>=faces.length}
function openBook(id){
 cur=books.find(b=>b.id===id);buildFaces();i=0;busy=0;markSeen(id);
 const dk=lum(cur.c)>.62,tc=dk?shade(cur.c,-.45):'#fff',fs=Math.min(20,84/(cur.title.length*.47));
 show(`<div class="wrap ${single()?'one':''}" style="--cc:${cur.c}"><div class="bookbox" id="bb"><div class="spread" id="sp"></div>
 <div class="cover" id="cv"><div class="cf" style="background:${cur.c};color:${tc}"><h2 style="font-size:${fs}cqw">${esc(cur.title)}</h2>${art(cur.a,cur.c)}<small>${esc(cur.sub||'')}</small></div><div class="cb"></div></div></div>
 <p class="tap" id="tap">${ic('bookOpen')}Chạm vào bìa để mở · ${stats(cur)}</p>
 <div class="bar" id="bar" style="opacity:0;pointer-events:none"><button class="btn" id="pv"></button><button class="btn" id="nx">Sau${ic('chevR')}</button><button class="btn pri adm" id="ad">${ic('imagePlus')}Thêm trang</button><button class="btn adm" id="pvt"></button><button class="btn ghost adm" id="dl">${ic('trash')}Xóa sách</button></div></div>`);
 drawPriv();
 paint();dragFlip($('sp'));
 $('cv').onclick=openCover;
 $('sp').addEventListener('click',async e=>{const b=e.target.closest('.pdel');if(!b||busy)return;const k=+b.dataset.i,pg=cur.pages[k];if(!pg||!await ask('Xóa trang này? Ảnh của trang cũng bị xóa khỏi kho.','Xóa trang'))return;
  try{await dbDeletePage(pg);cur.pages.splice(k,1);buildFaces();i=Math.max(0,Math.min(i,faces.length-(single()?1:2)));paint();toast('Đã xóa trang')}catch(err){fail(err)}});
 $('pv').onclick=()=>i<=0?closeCover():flip(-1);$('nx').onclick=()=>flip(1);$('ad').onclick=addPage;
 $('dl').onclick=async()=>{if(!await ask(`Xóa quyển “${cur.title}” cùng ${stats(cur)}?`,'Xóa sách'))return;try{await dbDeleteBook(cur);books=books.filter(b=>b!==cur);cur=null;hide();tower();toast('Đã xóa sách')}catch(e){fail(e)}};
}
// Nút riêng tư trong sách đang mở (chỉ chủ kệ thấy).
function drawPriv(){const b=$('pvt');if(!b||!cur)return;b.innerHTML=ic(cur.private?'lock':'unlock')+(cur.private?'Riêng tư':'Công khai');b.title=cur.private?'Chỉ bạn thấy quyển này. Bấm để công khai':'Ai cũng xem được. Bấm để chuyển sang riêng tư';b.setAttribute('aria-pressed',String(cur.private));
 b.onclick=async()=>{const v=!cur.private;b.disabled=true;try{await dbSetPrivate(cur,v);cur.private=v;drawPriv();tower();toast(v?'Đã chuyển sang riêng tư: chỉ bạn thấy':'Đã công khai quyển này')}catch(e){fail(e)}b.disabled=false}}
function openCover(){const bb=$('bb');SFX.play('open');
 if(!store.get('ksk3hint')&&cur&&faces.length>2){store.set('ksk3hint','1');setTimeout(()=>toast('Mẹo: kéo trang sang trái hoặc phải để lật'),1100)}bb.classList.add('opened');$('tap').style.opacity=0;$('bar').style.opacity=1;$('bar').style.pointerEvents='auto';
 setTimeout(()=>{if(bb.classList.contains('opened'))bb.classList.add('gone')},1000)}
function closeCover(){if(busy)return;const bb=$('bb');SFX.play('close');bb.classList.remove('gone');void bb.offsetWidth;bb.classList.remove('opened');
 $('tap').style.opacity='';$('bar').style.opacity=0;$('bar').style.pointerEvents='none'}
// Lật trang: tạo lá trang, xoay theo tiến độ p (0..1), rồi lật hẳn hoặc trả về chỗ cũ.
// Trang sắp hiện ra có lớp "pre" (ẩn ảnh) để ảnh rơi xuống dán vào sau khi lật xong.
const NS=14;
// Tờ giấy được chia thành NS dải dọc lồng nhau; mỗi dải xoay thêm một chút so với dải trước nên cả tờ cong như giấy thật.
function mkLeaf(d){const s=single(),n=i+d*(s?1:2);if(busy||n<0||n>=faces.length)return null;busy=1;
 const sp=$('sp'),fw=(sp.querySelector('.face')||sp).offsetWidth/(sp.querySelector('.face')?1:(s?1:2)),w=fw/NS,R=d<0;
 const U=(k,pre)=>`<div class="face${pre?' pre':''}">${face(faces[k],k)}</div>`;
 const fk=s?i:(d>0?i+1:i),bk=s?-1:(d>0?i+2:i-1),fh=face(faces[fk],fk),bh=bk<0?'':face(faces[bk],bk);
 let h='';
 for(let k=NS-1;k>=0;k--){const fx=R?fw-(k+1)*w:k*w,bx=R?k*w:fw-(k+1)*w,pos=(R?'right:':'left:')+(k?w:0)+'px';
  h=`<div class="st" style="width:${(w+.7).toFixed(2)}px;${pos};transform-origin:${R?'right':'left'} center"><div class="sf"><div class="face" style="width:${fw}px;left:${(-fx).toFixed(2)}px">${fh}</div><i class="shd"></i></div><div class="sb">${bk<0?'<div class="pg b-white"></div>':`<div class="face pre" style="width:${fw}px;left:${(-bx).toFixed(2)}px">${bh}</div>`}<i class="shd"></i></div>${h}</div>`}
 sp.innerHTML=s?U(n,1):(d>0?U(i)+U(i+3,1):U(i-2,1)+U(i+1));
 const lf=document.createElement('div');lf.className='leaf curl '+(d>0?'r':'l');lf.innerHTML=h;
 const c1=document.createElement('i'),c2=document.createElement('i');c1.className='cast '+(d>0?'rt':'lt');c2.className='cast '+(d>0?'lt':'rt');
 sp.append(c1);if(!s)sp.append(c2);sp.append(lf);
 return{d,n,s,lf,c1,c2:s?null:c2,p:0,st:[...lf.querySelectorAll('.st')],sf:[...lf.querySelectorAll('.sf>.shd')],sb:[...lf.querySelectorAll('.sb>.shd')]}}
// p = tiến độ lật 0..1. Mép ngoài đi trước gáy một đoạn (độ cong B), cong nhiều nhất ở giữa chặng.
function setLeaf(L,p){L.p=p;const M=L.s?165:180,T=M*p,B=(L.s?50:75)*Math.sin(Math.PI*p),sg=L.d>0?-1:1;let prev=0;
 const A=L.st.map((e,k)=>Math.max(0,Math.min(M,T+B*(k/(NS-1)-.45)))),S=A.map(a=>Math.sin(a*Math.PI/180)),m=(x,y)=>(x+y)/2;
 // bóng chuyển màu mượt từ mép dải này sang dải kế tiếp để không thấy vết nối
 const g=(k,f,dir)=>{const s0=m(S[Math.max(0,k-1)],S[k])*f,s1=m(S[k],S[Math.min(NS-1,k+1)])*f;return `linear-gradient(${dir}deg,rgba(42,29,18,${s0.toFixed(3)}),rgba(42,29,18,${s1.toFixed(3)}))`};
 const df=L.d>0?90:270,db=L.d>0?270:90;
 L.st.forEach((e,k)=>{e.style.transform=`rotateY(${(sg*(A[k]-prev)).toFixed(2)}deg)`;prev=A[k];
  L.sf[k].style.background=g(k,.38,df);if(L.sb[k])L.sb[k].style.background=g(k,.3,db)});
 if(L.s)L.lf.style.opacity=(p<.7?1:1-(p-.7)/.3).toFixed(3);
 const c=Math.sin(Math.PI*p)*.75;L.c1.style.opacity=(c*(1-p*.6)).toFixed(3);if(L.c2)L.c2.style.opacity=(c*p).toFixed(3)}
function tween(L,to,ms,ease,done){const from=L.p,t0=performance.now();if(ms<=0||RM()){setLeaf(L,to);return done()}
 const f=now=>{const t=Math.min(1,(now-t0)/ms);setLeaf(L,from+(to-from)*ease(t));t<1?requestAnimationFrame(f):done()};requestAnimationFrame(f)}
const easeIO=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,easeOut=t=>1-Math.pow(1-t,3);
function endLeaf(L,ok,ms,ease=easeOut){tween(L,ok?1:0,ms,ease,()=>{if(ok)i=L.n;busy=0;paint(ok)})}
function flip(d){const L=mkLeaf(d);if(!L)return;SFX.play('flip');setLeaf(L,0);endLeaf(L,1,950,easeIO)}
// Kéo ở bất kỳ đâu trên trang: kéo sang trái để lật tới, sang phải để lật lui. Thả quá 1/3 hoặc vuốt nhanh thì lật hẳn.
function dragFlip(sp){let st=null,L=null;
 sp.addEventListener('pointerdown',e=>{if(busy||e.button>0||e.target.closest('button')||!$('bb').classList.contains('opened'))return;
  st={x:e.clientX,y:e.clientY,lx:e.clientX,lt:performance.now(),v:0,id:e.pointerId}});
 sp.addEventListener('pointermove',e=>{if(!st||e.pointerId!==st.id)return;const dx=e.clientX-st.x,dy=e.clientY-st.y,now=performance.now();
  if(!L){if(Math.abs(dx)<8||Math.abs(dx)<Math.abs(dy)*1.2){if(Math.abs(dy)>16)st=null;return}
   L=mkLeaf(dx<0?1:-1);if(!L){st=null;return}L.lf.style.transition='none';try{sp.setPointerCapture(e.pointerId)}catch(_){}sp.classList.add('drag')}
  const W=sp.getBoundingClientRect().width*(L.s?.85:.55);setLeaf(L,Math.max(0,Math.min(1,(L.d>0?-dx:dx)/W)));
  if(now-st.lt>12){st.v=(e.clientX-st.lx)/(now-st.lt);st.lx=e.clientX;st.lt=now}});
 const up=e=>{if(!st||e.pointerId!==st.id)return;const v=st.v;st=null;sp.classList.remove('drag');if(!L)return;const l=L;L=null;
  const fast=(l.d>0?-v:v)>.45,ok=l.p>.33||(fast&&l.p>.04);if(ok)SFX.play('flip');endLeaf(l,ok,Math.round(220+520*(ok?1-l.p:l.p)))};
 sp.addEventListener('pointerup',up);sp.addEventListener('pointercancel',up)}


hooks.hide.push(()=>{cur=null;unpull()});
addEventListener('keydown',e=>{if($('dlg').classList.contains('on')||$('ov').classList.contains('on')&&!cur)return;
 if(cur&&$('sp')){const op=$('bb').classList.contains('opened');if(e.key==='ArrowRight')op?flip(1):openCover();if(e.key==='ArrowLeft'&&op)$('pv').click()}});
const setMode=v=>{mode=v;$('m1').classList.toggle('on',v==='color');$('m2').classList.toggle('on',v==='new');$('m1').setAttribute('aria-pressed',v==='color');$('m2').setAttribute('aria-pressed',v==='new');tower()};
$('m1').onclick=()=>setMode('color');$('m2').onclick=()=>setMode('new');
$('addbook').onclick=()=>newBook();

// Bìa 3D xem trước khi tạo sách.
function book3d(c,a,title,sub){const tc=lum(c)>.62?shade(c,-.45):'#fff',T=title||'Tên sách',fs=Math.min(20,84/(T.length*.47));
 return `<div class="b3f" style="background:${c};color:${tc}"><b style="font-size:${fs}cqw">${esc(T)}</b>${art(a,c)}<small>${esc(sub||'')}</small></div>
 <div class="b3s" style="background:${shade(c,-.1)};color:${tc}"><span>${esc(T)}</span></div><div class="b3p"></div><div class="b3t"></div><div class="b3k" style="background:${shade(c,-.25)}"></div>`}

function newBook(){
 show(`<div class="panel wide"><div class="phead">${ic('bookPlus')}<h3>Quyển sách mới</h3></div>
 <div class="pgrid"><div class="pv"><div class="b3wrap"><div class="b3" id="b3"></div></div><p class="ph">Bìa xem trước</p></div>
 <div class="form"><label for="nt">Tên chuyến đi</label><input type="text" id="nt" placeholder="Ví dụ: Phú Quốc" maxlength="20" autocomplete="off">
 <label for="ns">Thời gian</label><input type="text" id="ns" placeholder="7 / 2026" maxlength="14" autocomplete="off">
 <label>Màu bìa</label><div class="chips sw" id="cc"></div>
 <label class="cpick" for="cu">${ic('palette')}<span>Chọn màu riêng</span><input type="color" id="cu" value="#c4a484"></label>
 <label>Hình trên bìa</label><div class="chips art" id="aa"></div>
 <label class="chk" for="npv"><input type="checkbox" id="npv">${ic('lock')}<span>Riêng tư: chỉ mình tôi xem</span></label></div></div>
 <div class="bar"><button class="btn" id="no">Hủy</button><button class="btn pri" id="ok">${ic('check')}Xếp lên kệ</button></div></div>`);
 let col=COL[0],custom=false;
 const upd=()=>{$('b3').innerHTML=book3d(col,+$('aa').dataset.v,$('nt').value.trim(),$('ns').value.trim())};
 const arts=()=>{const s=+($('aa').dataset.v||0);chips('aa',ARTN.map((n,k)=>`<i style="background:${col}">${art(k,col)}</i><span>${n}</span>`),upd,s)};
 chips('cc',COL.map(c=>`<i style="background:${c}"></i>`),k=>{col=COL[k];custom=false;arts();upd()});
 $('cu').oninput=e=>{col=e.target.value;custom=true;[...$('cc').children].forEach(x=>{x.classList.remove('sel');x.setAttribute('aria-pressed',false)});arts();upd()};
 arts();upd();$('nt').oninput=upd;$('ns').oninput=upd;setTimeout(()=>$('nt').focus(),50);
 $('no').onclick=hide;
 $('ok').onclick=async()=>{const t=$('nt').value.trim();if(!t){$('nt').focus();$('nt').classList.add('err');toast('Cần đặt tên cho quyển sách',1);return}
  const bt=$('ok');bt.disabled=true;
  try{books.push(await dbAddBook({title:t,sub:$('ns').value.trim(),c:col,a:+$('aa').dataset.v,t:34+Math.round(Math.random()*32),priv:$('npv').checked}));hide();tower();toast(`Đã xếp “${t}” lên kệ`)}catch(e){fail(e);bt.disabled=false}};
}

function addPage(){
 const keep=cur;let imgs=[],urls=[],nts=[],rat=[];const isT=()=>LAY[$('ll').dataset.v]==='ticket',MAX=()=>isT()?3:5;
 show(`<div class="panel wide"><div class="phead">${ic('imagePlus')}<h3>Thêm trang cho “${esc(keep.title)}”</h3></div>
 <div class="pgrid"><div class="pv"><div class="pvp face" id="pvp"></div><p class="ph">Trang xem trước</p></div>
 <div class="form" id="frm"><label>Ảnh <span class="cnt" id="cnt">0 / 5</span></label>
 <div class="pslots" id="pslots"></div><div class="tkrows" id="tkr" hidden></div><input type="file" id="fi" accept="image/*,.heic,.heif" multiple hidden>
 <p class="ph">Kéo thả ảnh vào khung hoặc bấm ô có dấu cộng. Ảnh được nén trước khi tải lên.</p>
 <label>Kiểu trang</label><div class="chips lay" id="ll"></div>
 <label>Nền giấy</label><div class="chips paper" id="bg"></div>
 <label>Hình dán</label><div class="chips stkc" id="st"></div>
 <label for="tx">Ghi chú</label><textarea id="tx" maxlength="120" placeholder="Ví dụ: Một năm của chúng mình"></textarea></div></div>
 <div class="bar"><button class="btn" id="no">${ic('chevL')}Quay lại sách</button><button class="btn pri" id="ok">${ic('check')}Lưu trang</button></div></div>`);
 const val=()=>({l:LAY[$('ll').dataset.v],bg:BG[$('bg').dataset.v],im:urls,t:$('tx').value.trim()||(isT()?'':'Ghi chú của bạn'),s:STK[$('st').dataset.v],x:{tk:urls.slice(0,3).map((_,k)=>({n:nts[k]||'',r:rat[k]||1.5}))}});
 const prev=()=>{$('pvp').innerHTML=face(val(),0,1)};
 const draw=()=>{const M=MAX();$('pslots').style.gridTemplateColumns=`repeat(${M},minmax(0,1fr))`;$('pslots').innerHTML=Array.from({length:M},(_,k)=>k<imgs.length?`<div class="pslot full"><img src="${urls[k]}" alt="Ảnh ${k+1}"><button type="button" class="rm" data-k="${k}" aria-label="Bỏ ảnh ${k+1}">${ic('x')}</button></div>`:k===imgs.length?`<button type="button" class="pslot add" id="pick" aria-label="Thêm ảnh">${ic('imagePlus')}<span>Thêm ảnh</span></button>`:`<div class="pslot"></div>`).join('');
  $('cnt').textContent=Math.min(imgs.length,M)+' / '+M;
  const tr=$('tkr');tr.hidden=!isT()||!imgs.length;tr.innerHTML=isT()?urls.slice(0,3).map((u,k)=>`<div class="tkrow"><img src="${u}" alt="Vé ${k+1}"><input type="text" data-k="${k}" maxlength="80" placeholder="Mặt sau vé ${k+1}: vd. Chuyến tàu đêm SE1" value="${esc(nts[k]||'')}" aria-label="Ghi chú mặt sau vé ${k+1}"><button type="button" class="btn" data-crop="${k}">${ic('crop')}Cắt</button></div>`).join(''):'';
  prev()};
 const addFiles=async fs=>{fs=fs.filter(f=>/^image\//.test(f.type)||/\.hei[cf]$/i.test(f.name)).slice(0,Math.max(0,MAX()-imgs.length));if(!fs.length)return;
  const p=$('pick');if(p){p.disabled=true;p.innerHTML=`${ic('camera')}<span>Đang xử lý</span>`}
  const bad=[];for(const f of fs){try{const b=await shrink(f,isT()?1100:600),u=URL.createObjectURL(b);imgs.push(b);urls.push(u);nts.push('');rat.push(await ratioOf(u))}catch(e){bad.push(e.message)}}
  draw();if(bad.length)toast(bad.join(' · '),1)};
 $('pslots').onclick=e=>{const rm=e.target.closest('.rm');if(rm){const k=+rm.dataset.k;URL.revokeObjectURL(urls[k]);imgs.splice(k,1);urls.splice(k,1);nts.splice(k,1);rat.splice(k,1);draw();return}if(e.target.closest('#pick'))$('fi').click()};
 $('fi').onchange=e=>{const f=[...e.target.files];e.target.value='';addFiles(f)};
 const fr=$('frm');fr.ondragover=e=>{e.preventDefault();fr.classList.add('drop')};fr.ondragleave=e=>{if(!fr.contains(e.relatedTarget))fr.classList.remove('drop')};
 fr.ondrop=e=>{e.preventDefault();fr.classList.remove('drop');addFiles([...e.dataTransfer.files])};
 chips('ll',LAY.map((l,k)=>LAYIC[l]+`<span>${LAYN[k]}</span>`),()=>{if(isT()&&imgs.length>3)toast('Kiểu vé dùng tối đa 3 ảnh, 3 ảnh đầu sẽ được giữ');draw()});
 $('tkr').oninput=e=>{const k=e.target.dataset.k;if(k!=null){nts[+k]=e.target.value;prev()}};
 $('tkr').onclick=async e=>{const b=e.target.closest('[data-crop]');if(!b)return;const k=+b.dataset.crop,res=await cropImg(urls[k]);if(!res)return;URL.revokeObjectURL(urls[k]);imgs[k]=res.blob;urls[k]=res.url;rat[k]=res.r;draw()};
 chips('bg',BG.map((b,k)=>`<i class="b-${b}"></i><span>${BGN[k]}</span>`),prev);
 chips('st',STK.map(s=>s||ic('x')),prev);
 $('tx').oninput=prev;draw();
 $('no').onclick=()=>openBook(keep.id);
 $('ok').onclick=async()=>{const bt=$('ok');bt.disabled=true;bt.innerHTML=`${ic('camera')}Đang tải ảnh lên...`;
  const T=isT(),use=T?imgs.slice(0,3):imgs;
  try{keep.pages.push(await dbAddPage(keep,{l:LAY[$('ll').dataset.v],bg:BG[$('bg').dataset.v],t:$('tx').value.trim(),s:STK[$('st').dataset.v],x:T?{tk:use.map((_,k)=>({n:(nts[k]||'').trim(),r:+(rat[k]||1.5).toFixed(3)}))}:null},use))}catch(e){fail(e);bt.disabled=false;bt.innerHTML=`${ic('check')}Lưu trang`;return}
  urls.forEach(u=>URL.revokeObjectURL(u));
  openBook(keep.id);openCover();buildFaces();const idx=1+keep.pages.length;i=single()?idx:idx-(idx%2);paint();toast('Đã thêm trang')};
}

// Tải lại kệ khi chủ kệ đăng nhập / đăng xuất (để hiện hoặc ẩn sách riêng tư).
async function reload(){try{books=await dbLoadBooks()}catch(e){fail(e)}if(cur)hide();tower()}
hooks.auth.push(reload);

// ---------- vào khu vực kệ sách (lần đầu thì tải dữ liệu) ----------
let shelfReady=false;
room('ke-sach',{title:'Kệ sách kỷ niệm',enter(){if(shelfReady){tower();return}shelfReady=true;
 look=store.get('ksk3view')==='far'?'far':'near';drawView();layout=store.get('ksk3layout')||'up';nook=store.get('ksk3nook')!=='0';
 $('l3').classList.toggle('on',nook);$('l3').setAttribute('aria-pressed',nook);
 (async()=>{$('tower').innerHTML='<p class="empty">Đang tải kệ sách...</p>';try{books=await dbLoadBooks()}catch(e){fail(e)}setLayout(layout)})()}});
