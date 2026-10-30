// Phần dùng chung cho mọi khu vực của căn phòng: tiện ích, thông báo, hộp thoại, ánh sáng theo giờ, âm thanh,
// xử lý ảnh, nhắc xoay ngang và đăng nhập chủ kệ. Mỗi khu vực (kệ sách, tủ đồ, bàn máy tính) nằm trong thư mục riêng.
const $=id=>document.getElementById(id);
const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const shade=(h,a)=>'#'+rgb(h).map(v=>Math.round(a>0?v+(255-v)*a:v*(1+a)).toString(16).padStart(2,'0')).join('');
const lum=h=>{const[r,g,b]=rgb(h);return(.299*r+.587*g+.114*b)/255};
const hue=h=>{let[r,g,b]=rgb(h).map(v=>v/255);const m=Math.max(r,g,b),n=Math.min(r,g,b),d=m-n;if(d<.08)return 400+(1-lum(h))*100;let x=m===r?((g-b)/d)%6:m===g?(b-r)/d+2:(r-g)/d+4;return((x*60)+360+30)%360};
const RM=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
let me=null,booted=false;
// Các khu vực đăng ký việc cần làm khi đóng lớp phủ hoặc khi đăng nhập / đăng xuất.
const hooks={hide:[],auth:[],books:[]};
const authChanged=()=>Promise.all(hooks.auth.map(f=>f()));
const hs=s=>{let h=7;for(const c of String(s))h=(h*31+c.charCodeAt(0))>>>0;return h};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const store={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};

// ---------- thông báo và hộp xác nhận (thay cho alert/confirm của trình duyệt) ----------
function toast(msg,bad){const t=$('toast');t.innerHTML=ic(bad?'x':'check')+`<span>${esc(msg)}</span>`;t.className='toast on'+(bad?' bad':'');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),bad?4200:2400)}
const fail=e=>{console.error(e);const m=e.message||String(e);toast(/row-level security|permission denied|chủ kệ/i.test(m)?'Chỉ chủ kệ (đã đăng nhập) mới được thay đổi':'Chưa lưu được: '+m+'. Kiểm tra mạng rồi thử lại.',1)};
function ask(msg,yes='Xóa'){return new Promise(r=>{const d=$('dlg');
 d.innerHTML=`<div class="dbox" role="alertdialog" aria-modal="true" aria-labelledby="dmsg"><p id="dmsg">${esc(msg)}</p><div class="bar"><button class="btn" id="dn">Giữ lại</button><button class="btn danger" id="dy">${ic('trash')}${esc(yes)}</button></div></div>`;
 d.classList.add('on');const done=v=>{d.classList.remove('on');d.innerHTML='';r(v)};
 $('dn').onclick=()=>done(false);$('dy').onclick=()=>done(true);d.onclick=e=>{if(e.target===d)done(false)};$('dn').focus()})}

// ---------- ánh sáng: luôn là đêm tím · vàng theo bảng màu 15 Xóm Lẻ (CSS vẫn đọc body[data-time]) ----------
function applyTime(){document.body.dataset.time='night'}

// ---------- Âm thanh: tạo bằng Web Audio, không cần file âm thanh ----------
const SFX=(()=>{let ctx=null,on=store.get('ksk3snd')!=='0';
 const ac=()=>{if(!ctx){const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;ctx=new A()}if(ctx.state==='suspended')ctx.resume();return ctx};
 const env=(g,t,a,pk,dur)=>{g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(pk,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+dur)};
 // tiếng sột soạt: nhiễu trắng qua bộ lọc dải, tần số trượt từ f0 đến f1
 function swish(dur,f0,f1,pk,q=.8){const c=ac();if(!c)return;const t=c.currentTime,n=Math.ceil(c.sampleRate*dur),b=c.createBuffer(1,n,c.sampleRate),d=b.getChannelData(0);
  for(let k=0;k<n;k++)d[k]=Math.random()*2-1;const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=b;f.type='bandpass';f.Q.value=q;
  f.frequency.setValueAtTime(f0,t);f.frequency.exponentialRampToValueAtTime(f1,t+dur);env(g,t,dur*.3,pk,dur);s.connect(f).connect(g).connect(c.destination);s.start(t);s.stop(t+dur)}
 // tiếng "bụp" trầm khi bìa hoặc sách chạm nhau
 function thump(fr,pk,dur){const c=ac();if(!c)return;const t=c.currentTime,o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(fr,t);o.frequency.exponentialRampToValueAtTime(fr*.5,t+dur);env(g,t,.004,pk,dur);o.connect(g).connect(c.destination);o.start(t);o.stop(t+dur)}
 const P={flip:()=>{swish(.34,800,3000,.2,.6);setTimeout(()=>swish(.09,2600,1800,.07,1.2),250)},
  pull:()=>swish(.4,450,1100,.12,.9),slide:()=>swish(.28,1100,500,.08,.9),
  open:()=>{thump(110,.3,.18);swish(.45,600,1900,.11,.7)},close:()=>{swish(.28,1800,600,.09,.7);setTimeout(()=>thump(95,.35,.16),230)},
  click:()=>{const c=ac();if(!c)return;const t=c.currentTime,o=c.createOscillator(),g=c.createGain();o.type='square';o.frequency.value=1700;env(g,t,.002,.05,.03);o.connect(g).connect(c.destination);o.start(t);o.stop(t+.04);setTimeout(()=>thump(170,.14,.05),35)},
  puff:()=>swish(.7,280,900,.13,.5),tick:()=>swish(.2,1400,2800,.1,.9)};
 return{play:n=>{if(on&&P[n])try{P[n]()}catch(e){}},get on(){return on},set on(v){on=v;store.set('ksk3snd',v?'1':'0')}}})();
const sndBtn=document.createElement('button');sndBtn.id='snd';sndBtn.type='button';$('l3').after(sndBtn);
const drawSnd=()=>{sndBtn.innerHTML=ic(SFX.on?'vol':'volX')+'<span>Âm thanh</span>';sndBtn.classList.toggle('on',SFX.on);sndBtn.setAttribute('aria-pressed',String(SFX.on));sndBtn.title=SFX.on?'Tắt âm thanh':'Bật âm thanh';sndBtn.setAttribute('aria-label',sndBtn.title)};
drawSnd();sndBtn.onclick=()=>{SFX.on=!SFX.on;drawSnd();SFX.play('click')};

// ---------- Ảnh: nén, đọc HEIC, cắt ----------
let heicP;const loadHeic=()=>heicP||(heicP=new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js';s.onload=ok;s.onerror=()=>{heicP=null;no(new Error('Không tải được bộ chuyển ảnh HEIC (cần mạng)'))};document.head.append(s)}));
async function shrink(file,max=600){
 const name=file.name;
 if(/\.hei[cf]$/i.test(name)||/hei[cf]/i.test(file.type)){await loadHeic();const o=await heic2any({blob:file,toType:'image/jpeg',quality:.8});file=Array.isArray(o)?o[0]:o}
 const url=URL.createObjectURL(file);
 return new Promise((ok,no)=>{const im=new Image();
  im.onload=()=>{const s=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*s;c.height=im.height*s;c.getContext('2d').drawImage(im,0,0,c.width,c.height);c.toBlob(b=>{URL.revokeObjectURL(url);ok(b)},'image/jpeg',.7)};
  im.onerror=()=>{URL.revokeObjectURL(url);no(new Error('Không đọc được ảnh: '+name))};im.src=url})}
// Cắt ảnh vé: kéo 4 góc hoặc kéo cả khung, trả về {blob,url,r} hoặc null nếu hủy.
function cropImg(src){return new Promise(done=>{const ov=document.createElement('div');ov.className='crop';
 ov.innerHTML=`<div class="cbox" role="dialog" aria-modal="true" aria-label="Cắt ảnh vé"><p class="ch">${ic('crop')}Kéo các góc để cắt sát mép vé</p><div class="cimg"><div class="cwrap"><img src="${src}" alt="Ảnh vé" draggable="false"><div class="crect"><i data-h="nw"></i><i data-h="ne"></i><i data-h="sw"></i><i data-h="se"></i></div></div></div><div class="bar"><button class="btn" type="button" data-a="no">Hủy</button><button class="btn pri" type="button" data-a="ok">${ic('check')}Cắt</button></div></div>`;
 document.body.append(ov);const img=ov.querySelector('img'),rc=ov.querySelector('.crect'),Q={x:.04,y:.04,w:.92,h:.92};let dr=null;
 const put=()=>{rc.style.cssText=`left:${Q.x*100}%;top:${Q.y*100}%;width:${Q.w*100}%;height:${Q.h*100}%`};put();
 rc.addEventListener('pointerdown',e=>{e.preventDefault();dr={h:e.target.dataset.h||'m',x:e.clientX,y:e.clientY,b:img.getBoundingClientRect(),q:{...Q}};try{rc.setPointerCapture(e.pointerId)}catch(_){}});
 rc.addEventListener('pointermove',e=>{if(!dr)return;const{b,q,h}=dr,dx=(e.clientX-dr.x)/b.width,dy=(e.clientY-dr.y)/b.height,m=.1,cl=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
  if(h==='m'){Q.x=cl(q.x+dx,0,1-q.w);Q.y=cl(q.y+dy,0,1-q.h)}
  else{let x0=q.x,y0=q.y,x1=q.x+q.w,y1=q.y+q.h;if(h.includes('w'))x0=cl(x0+dx,0,x1-m);if(h.includes('e'))x1=cl(x1+dx,x0+m,1);if(h.includes('n'))y0=cl(y0+dy,0,y1-m);if(h.includes('s'))y1=cl(y1+dy,y0+m,1);Object.assign(Q,{x:x0,y:y0,w:x1-x0,h:y1-y0})}put()});
 const end=()=>{dr=null};rc.addEventListener('pointerup',end);rc.addEventListener('pointercancel',end);
 const close=v=>{ov.remove();removeEventListener('keydown',esc0,true);done(v)},esc0=e=>{if(e.key==='Escape'){e.stopPropagation();close(null)}};addEventListener('keydown',esc0,true);
 ov.addEventListener('click',e=>{const a=e.target.closest('[data-a]');if(!a)return;if(a.dataset.a==='no')return close(null);
  const W=img.naturalWidth,H=img.naturalHeight,c=document.createElement('canvas');c.width=Math.max(1,Math.round(Q.w*W));c.height=Math.max(1,Math.round(Q.h*H));
  c.getContext('2d').drawImage(img,Q.x*W,Q.y*H,c.width,c.height,0,0,c.width,c.height);c.toBlob(b=>close(b?{blob:b,url:URL.createObjectURL(b),r:c.width/c.height}:null),'image/jpeg',.85)});
 ov.querySelector('[data-a="ok"]').focus()})}
const ratioOf=u=>new Promise(ok=>{const im=new Image();im.onload=()=>ok(im.naturalWidth/im.naturalHeight||1.5);im.onerror=()=>ok(1.5);im.src=u});

// ---------- Lớp phủ dùng chung (sách mở, bảng nhập liệu) ----------
function show(h){$('slot').innerHTML=h;$('ov').classList.add('on');document.body.classList.add('lock')}
function hide(){$('ov').classList.remove('on');$('slot').innerHTML='';document.body.classList.remove('lock');hooks.hide.forEach(f=>f())}
$('close').onclick=hide;
addEventListener('keydown',e=>{if($('dlg').classList.contains('on')){if(e.key==='Escape')$('dn').click();return}
 if(e.key==='Escape'&&$('ov').classList.contains('on'))hide()});

// Nhóm nút chọn: items là danh sách HTML, onPick gọi lại khi đổi lựa chọn.
function chips(id,items,onPick,sel=0){const el=$(id);
 el.innerHTML=items.map((h,k)=>`<button type="button" data-k="${k}" class="${k===sel?'sel':''}" aria-pressed="${k===sel}">${h}</button>`).join('');el.dataset.v=sel;
 el.onclick=e=>{const b=e.target.closest('button');if(!b)return;[...el.children].forEach(x=>{x.classList.toggle('sel',x===b);x.setAttribute('aria-pressed',x===b)});el.dataset.v=b.dataset.k;onPick&&onPick(+b.dataset.k)}}

// ---------- Xoay ngang trên điện thoại ----------
// Trình duyệt không cho web tự xoay màn hình. Android cho phép khóa ngang khi đang toàn màn hình (sau một lần bấm),
// còn iPhone thì không: lúc đó chỉ nhắc người xem tự xoay. Bấm "Vẫn xem dọc" thì không nhắc lại trong lần xem này.
const canLock=()=>!!(screen.orientation&&screen.orientation.lock&&document.documentElement.requestFullscreen);
{const r=document.createElement('div');r.className='rot';r.setAttribute('role','dialog');r.setAttribute('aria-label','Xoay ngang điện thoại');
 r.innerHTML=`<div class="rbox"><div class="rph" aria-hidden="true"><i></i></div><p><b>Xoay ngang điện thoại</b>Kệ sách và quyển sách mở ra sẽ rộng và đẹp hơn.</p>${canLock()?`<button class="btn pri" id="rgo" type="button">${ic('rotate')}Xoay ngang toàn màn hình</button>`:''}<button class="rskip" id="rskip" type="button">Vẫn xem dọc</button></div>`;
 document.body.append(r);try{if(sessionStorage.getItem('ksk3portrait'))document.body.classList.add('portrait-ok')}catch(e){}
 $('rskip').onclick=()=>{document.body.classList.add('portrait-ok');try{sessionStorage.setItem('ksk3portrait','1')}catch(e){}};
 if($('rgo'))$('rgo').onclick=async()=>{try{await document.documentElement.requestFullscreen({navigationUI:'hide'});await screen.orientation.lock('landscape')}
  catch(e){try{if(document.fullscreenElement)await document.exitFullscreen()}catch(_){}toast('Máy này không cho web tự xoay. Hãy tắt khóa xoay màn hình rồi xoay ngang điện thoại.',1)}}}

// ---------- Đăng nhập chủ kệ (dùng chung cho cả căn phòng) ----------
// Người xem không cần đăng nhập. Nút ổ khóa nhỏ cuối trang là lối vào duy nhất; quyền thật nằm ở luật RLS trên Supabase.
function drawAdmin(){document.body.classList.toggle('admin',!!me);const b=$('lk');
 b.innerHTML=me?ic('logout')+'<span>Đăng xuất</span>':ic('lock');b.title=me?'Đăng xuất ('+(me.email||'chủ kệ')+')':'Đăng nhập chủ kệ';b.setAttribute('aria-label',b.title)}
function login(){show(`<div class="panel"><div class="phead">${ic('lock')}<h3>Đăng nhập chủ kệ</h3></div>
 <form class="form" id="lf" novalidate><label for="le">Email</label><input type="email" id="le" autocomplete="username" required>
 <label for="lp">Mật khẩu</label><input type="password" id="lp" autocomplete="current-password" required>
 <p class="lerr" id="lerr" role="alert"></p>
 <div class="bar"><button type="button" class="btn" id="no">Hủy</button><button type="submit" class="btn pri" id="ok">${ic('check')}Đăng nhập</button></div></form></div>`);
 setTimeout(()=>$('le').focus(),50);$('no').onclick=hide;
 $('lf').onsubmit=async e=>{e.preventDefault();const em=$('le').value.trim(),pw=$('lp').value;if(!em||!pw){$('lerr').textContent='Nhập email và mật khẩu';return}
  const bt=$('ok');bt.disabled=true;$('lerr').textContent='';
  try{me=await dbSignIn(em,pw);drawAdmin();hide();await authChanged();toast('Chào chủ kệ! Bạn đã có thể thêm và sửa sách')}catch(err){$('lerr').textContent=err.message||'Không đăng nhập được';bt.disabled=false}}}
{const b=document.createElement('button');b.id='lk';b.type='button';b.className='lockbtn';$('foot').append(b);
 b.onclick=async()=>{if(!me)return login();try{await dbSignOut();me=null;drawAdmin();await authChanged();toast('Đã đăng xuất')}catch(e){fail(e)}}}
dbOnAuth(u=>{const was=!!me;me=u;drawAdmin();if(was!==!!u&&booted)authChanged()});
