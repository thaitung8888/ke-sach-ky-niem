// Khu vực TỦ ĐỒ SƯU TẦM (#/tu-do): áo treo trên một thanh như cửa hàng; bấm một chiếc để xem lớn kèm câu chuyện.
// Chủ kệ thêm áo bằng ảnh đã tách nền sẵn (PNG/WebP trong suốt): web cắt sát mép và lấy màu chủ đạo.
let garments=[],gP=null,wOpen=-1;
const loadGarments=()=>gP||(gP=dbLoadGarments().then(g=>{garments=g;hooks.books.forEach(f=>f());return g}).catch(e=>{gP=null;fail(e);return garments}));
// TẠM CHƯA DÙNG (đang làm lại cho hợp hơn). Móc treo gỗ: móc kim loại sáng bóng, ốc nối, thân gỗ có vân và viền sáng. Vẽ hai góc: nhìn thẳng và nhìn nghiêng (thấy đầu thanh gỗ).
// Màu chuyển (gradient) khai báo một lần cho cả trang để các móc dùng chung.
document.body.insertAdjacentHTML('beforeend',`<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
 <linearGradient id="hgChrome" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbfbfb"/><stop offset=".45" stop-color="#a9abae"/><stop offset=".7" stop-color="#e6e7e8"/><stop offset="1" stop-color="#7d7f82"/></linearGradient>
 <linearGradient id="hgWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ecd09f"/><stop offset=".45" stop-color="#d3a86f"/><stop offset="1" stop-color="#a5733c"/></linearGradient>
 <linearGradient id="hgWoodS" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e6c38e"/><stop offset=".55" stop-color="#bf8e53"/><stop offset="1" stop-color="#8d5f2f"/></linearGradient>
</defs></svg>`);
const hookFront=`<path d="M80 39V21c0-7 5-13 12-13s11 5 11 10c0 3-1.5 5.5-4 7" fill="none" stroke="#5c5e61" stroke-width="3.6" stroke-linecap="round"/><path d="M80 39V21c0-7 5-13 12-13s11 5 11 10c0 3-1.5 5.5-4 7" fill="none" stroke="url(#hgChrome)" stroke-width="2.3" stroke-linecap="round"/>`;
const hangerSvg=`<svg class="hgr hf" viewBox="0 0 160 70" aria-hidden="true">${hookFront}<rect x="76.5" y="35.5" width="7" height="5.5" rx="1.2" fill="url(#hgChrome)" stroke="#6d6f72" stroke-width=".6"/>
 <path d="M80 39C62 40 32 49 9 57c-4 1.5-5 5-1.5 6.5L11 64c25-6 50-10 69-10s44 4 69 10l3.5-.5c3.5-1.5 2.5-5-1.5-6.5C128 49 98 40 80 39z" fill="url(#hgWood)" stroke="rgba(90,58,26,.45)" stroke-width=".7"/>
 <path d="M78 40.6C60 41.8 33 50.5 11 58.4M82 40.6c18 1.2 45 9.9 67 17.8" fill="none" stroke="rgba(255,250,235,.6)" stroke-width="1.1" stroke-linecap="round"/>
 <path d="M40 51.5c12-3.5 26-6.2 40-6.6M120 51.5c-12-3.5-26-6.2-40-6.6M26 58c16-4 34-6.6 54-7" fill="none" stroke="rgba(120,78,36,.22)" stroke-width=".6"/></svg>
 <svg class="hgr hs" viewBox="0 0 40 70" aria-hidden="true"><path d="M20 39V14c0-4 1-6 2.5-6S25 10 25 14v3" fill="none" stroke="#5c5e61" stroke-width="3.6" stroke-linecap="round"/><path d="M20 39V14c0-4 1-6 2.5-6S25 10 25 14v3" fill="none" stroke="url(#hgChrome)" stroke-width="2.3" stroke-linecap="round"/>
 <rect x="16.5" y="35.5" width="7" height="5.5" rx="1.2" fill="url(#hgChrome)" stroke="#6d6f72" stroke-width=".6"/>
 <path d="M15.5 40h9l1.6 3.2v17.3q0 3.2-3.2 3.2h-5.8q-3.2 0-3.2-3.2V43.2z" fill="url(#hgWoodS)" stroke="rgba(90,58,26,.45)" stroke-width=".7"/>
 <path d="M16.5 43.5v16" stroke="rgba(255,250,235,.55)" stroke-width="1.1" stroke-linecap="round"/></svg>`;
// Áo mẫu (vẽ) cho tủ trống, để người xem hình dung.
const teeSvg=c=>`<svg viewBox="0 0 200 230" aria-hidden="true"><path d="M70 10q30 18 60 0l58 30-18 46-22-10v158H52V76L30 86 12 40z" fill="${c}"/><path d="M70 10q30 18 60 0" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="5"/><path d="M52 90v130M148 90v130" stroke="rgba(0,0,0,.08)" stroke-width="10"/></svg>`;

function drawWardrobe(){const st=$('wstage');if(!st)return;wOpen=-1;st.classList.remove('det');
 const n=garments.length;$('wcount').textContent=n?`${n} món · bấm một chiếc để xem câu chuyện`:'';
 const items=n?garments.map((g,i)=>`<button type="button" class="gi${g.side?' two':''}" data-i="${i}" style="--c:${g.c}" aria-label="${esc(g.name)}${g.brand?' · '+esc(g.brand):''}"><span class="gface"><span class="gimgw"><span class="gpic"><img class="gfront" src="${g.img}" alt="" loading="lazy" draggable="false">${g.side?`<img class="gside" src="${g.side}" alt="" loading="lazy" draggable="false">`:''}</span></span></span><i class="gtag">${num(i)}</i>${g.private?`<i class="gpriv" title="Riêng tư">${ic('lock')}</i>`:''}</button>`).join('')
  :['#2c3e5c','#6f747a','#e6dcc6','#2f6b4a','#1f1f22','#c9b98f'].map(c=>`<span class="gi ghost"><span class="gface"><span class="gimgw"><span class="gpic">${teeSvg(c)}</span></span></span></span>`).join('');
 st.innerHTML=`<div class="rail${n?'':' empty'}"><div class="rod"><i></i><i></i></div><div class="hang" id="hang">${items}</div></div>
  <p class="gname" id="gname" aria-live="polite">${n?'':me?'Tủ đồ đang trống. Bấm “Thêm món đồ” để treo chiếc áo đầu tiên.':'Tủ đồ đang được sắp xếp. Hẹn bạn quay lại sau!'}</p><div class="gdet" id="gdet" hidden></div>`;
 const h=$('hang');let raf=0;
 h.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')faceOn(null)});
 h.addEventListener('scroll',()=>{if(TOUCH.matches&&!raf)raf=requestAnimationFrame(()=>{raf=0;faceCenter()})},{passive:true});
 requestAnimationFrame(()=>{if(h.scrollWidth>h.clientWidth)h.scrollLeft=(h.scrollWidth-h.clientWidth)/2;if(TOUCH.matches)faceCenter()})}
const num=i=>String(i+1).padStart(2,'0');
function nameOf(i){const g=garments[i];$('gname').innerHTML=g?`<b>${esc(g.name)}</b>${g.brand?`<small>${esc(g.brand)}</small>`:''}`:''}
// Áo trên thanh treo quay mặt nghiêng; chiếc đang chọn xoay ra mặt trước, các chiếc khác dạt sang hai bên (CSS lo phần dạt).
const TOUCH=matchMedia('(hover:none)');
// Khoảng dạt ra tính theo bề ngang thật của chiếc đang chọn, để mặt trước vừa khít, không đè lên chiếc bên cạnh.
function faceOn(b){const h=$('hang');if(!h)return;h.querySelectorAll('.gi.on').forEach(x=>x!==b&&x.classList.remove('on'));
 if(b){const f=b.querySelector('.gpic');if(f&&f.offsetWidth)h.style.setProperty('--push',Math.max(0,(f.offsetWidth-b.offsetWidth)/2+10)+'px');
  b.classList.add('on');if(!b.classList.contains('ghost'))nameOf(+b.dataset.i)}}
// Áo có ảnh mặt nghiêng: chỗ trên thanh rộng đúng bằng bề nghiêng của ảnh đó.
function fitSide(gi){const s=gi.querySelector('.gside');if(s&&s.offsetWidth)gi.style.setProperty('--sw',Math.round(s.offsetWidth+6)+'px')}
// ảnh tải xong mới biết kích thước thật: đo lại chỗ trên thanh và khoảng dạt của chiếc đang chọn
document.addEventListener('load',e=>{const gi=e.target.closest&&e.target.closest('#hang .gi');if(!gi)return;if(gi.classList.contains('two'))fitSide(gi);if(gi.classList.contains('on'))faceOn(gi)},true);
// Điện thoại không rê chuột được: chiếc nằm giữa khung lướt tự xoay ra mặt trước.
function faceCenter(){const h=$('hang');if(!h||wOpen>=0)return;const c=h.scrollLeft+h.clientWidth/2;let best=null,bd=1e9;
 for(const g of h.children){const d=Math.abs(g.offsetLeft+g.offsetWidth/2-c);if(d<bd){bd=d;best=g}}faceOn(best)}
document.addEventListener('pointerover',e=>{const b=e.target.closest&&e.target.closest('#hang .gi');if(b&&e.pointerType==='mouse'&&wOpen<0)faceOn(b)});
document.addEventListener('focusin',e=>{const b=e.target.closest&&e.target.closest('#hang .gi:not(.ghost)');if(b&&wOpen<0)faceOn(b)});
document.addEventListener('click',e=>{const b=e.target.closest('#hang .gi:not(.ghost)');if(!b)return;
 // chạm lần đầu vào chiếc đang nghiêng thì chỉ kéo nó ra giữa cho xoay mặt, chạm lần nữa mới mở
 if(TOUCH.matches&&!b.classList.contains('on')){b.scrollIntoView({inline:'center',block:'nearest',behavior:RM()?'auto':'smooth'});faceOn(b);return}
 openGarment(+b.dataset.i,b)});

// Trang chi tiết: áo bay từ thanh treo ra giữa, thông tin bên phải.
function openGarment(i,from){const g=garments[i];if(!g)return;const d=$('gdet'),first=wOpen<0;wOpen=i;SFX.play('pull');
 d.innerHTML=`<div class="gtop"><span class="gpos">${num(i)} / ${num(garments.length-1)}</span><button type="button" class="gx" id="gx">Đóng${ic('x')}</button></div>
  <button type="button" class="gnav" id="gprev" aria-label="Áo trước">${ic('chevL')}</button>
  <div class="gbig"><div class="gfit" id="gfit"><img id="gbimg" src="${g.img}" alt="${esc(g.name)}"></div></div>
  <div class="ginfo">${g.brand?`<small>${esc(g.brand)}</small>`:''}<h2>${esc(g.name)}</h2><i class="grule"></i>${g.side?`<div class="gviews" role="group" aria-label="Góc nhìn"><button type="button" class="gv on" data-v="front"><img src="${g.img}" alt=""><span>Mặt trước</span></button><button type="button" class="gv" data-v="side"><img src="${g.side}" alt=""><span>Mặt nghiêng</span></button></div>`:''}${g.story?`<p>${esc(g.story).replace(/\n/g,'<br>')}</p>`:'<p class="nost">Chưa có câu chuyện cho món này.</p>'}
   <button type="button" class="glink" id="gback">${ic('chevL')}Về thanh treo</button>
   <div class="bar gbar"><button type="button" class="btn adm" id="gedit">${ic('pen')}Sửa</button><button type="button" class="btn adm" id="gpv">${ic(g.private?'lock':'unlock')}${g.private?'Riêng tư':'Công khai'}</button><button type="button" class="btn ghost adm" id="gdel">${ic('trash')}Xóa</button></div></div>
  <button type="button" class="gnav" id="gnext" aria-label="Áo sau">${ic('chevR')}</button>`;
 d.hidden=false;$('wstage').classList.add('det');$('gprev').disabled=i<=0;$('gnext').disabled=i>=garments.length-1;
 $('gprev').onclick=()=>openGarment(i-1);$('gnext').onclick=()=>openGarment(i+1);$('gback').onclick=$('gx').onclick=closeGarment;
 d.querySelectorAll('.gv').forEach(v=>v.onclick=()=>{const side=v.dataset.v==='side',fit=$('gfit');if(fit.classList.contains('side')===side)return;
  d.querySelectorAll('.gv').forEach(x=>x.classList.toggle('on',x===v));SFX.play('slide');
  const swap=()=>{$('gbimg').src=side?g.side:g.img;fit.classList.toggle('side',side)};
  if(RM())return swap();fit.animate([{transform:'none',opacity:1},{transform:'scaleX(.2)',opacity:.2}],{duration:180,easing:'ease-in'}).onfinish=()=>{swap();fit.animate([{transform:'scaleX(.2)',opacity:.2},{transform:'none',opacity:1}],{duration:260,easing:'cubic-bezier(.3,1.3,.5,1)'})}});
 $('gedit').onclick=()=>garmentForm(g);$('gdel').onclick=async()=>{if(!await ask(`Xóa “${g.name}” khỏi tủ đồ? Ảnh cũng bị xóa khỏi kho.`,'Xóa'))return;
  try{await dbDeleteGarment(g);garments.splice(i,1);drawWardrobe();hooks.books.forEach(f=>f());toast('Đã xóa món đồ')}catch(e){fail(e)}};
 $('gpv').onclick=async()=>{const v=!g.private;try{await dbUpdateGarment(g,{private:v});g.private=v;openGarment(i);toast(v?'Chỉ bạn thấy món này':'Đã công khai món này')}catch(e){fail(e)}};
 const img=$('gbimg'),src=from&&from.querySelector('.gfront');
 if(first&&src&&!RM()){const a=src.getBoundingClientRect(),run=()=>{const b=img.getBoundingClientRect();if(!b.width)return;
   img.animate([{transform:`translate(${a.left-b.left}px,${a.top-b.top}px) scale(${a.width/b.width})`,transformOrigin:'0 0'},{transform:'none',transformOrigin:'0 0'}],{duration:560,easing:'cubic-bezier(.3,.9,.3,1)'})};
  img.complete?run():img.onload=run;d.querySelector('.ginfo').animate([{opacity:0,transform:'translateX(20px)'},{opacity:1,transform:'none'}],{duration:420,delay:180,fill:'backwards'})}
 else if(!RM())img.animate([{opacity:0,transform:'scale(.96)'},{opacity:1,transform:'none'}],{duration:260})}
function closeGarment(){if(wOpen<0)return;const i=wOpen;wOpen=-1;$('wstage').classList.remove('det');$('gdet').hidden=true;$('gdet').innerHTML='';SFX.play('slide');
 const b=document.querySelector(`#hang .gi[data-i="${i}"]`);if(b){b.focus({preventScroll:true});b.scrollIntoView({inline:'center',block:'nearest'});faceOn(b)}}
addEventListener('keydown',e=>{if(curRoom!=='tu-do'||wOpen<0||$('ov').classList.contains('on')||$('dlg').classList.contains('on'))return;
 if(e.key==='Escape')closeGarment();if(e.key==='ArrowLeft'&&wOpen>0)openGarment(wOpen-1);if(e.key==='ArrowRight'&&wOpen<garments.length-1)openGarment(wOpen+1)});

// ---------- chuẩn bị ảnh ----------
async function toJpegIfHeic(f){if(/\.hei[cf]$/i.test(f.name||'')||/hei[cf]/i.test(f.type)){await loadHeic();const o=await heic2any({blob:f,toType:'image/jpeg',quality:.9});return Array.isArray(o)?o[0]:o}return f}
// Cắt sát phần áo, thu về tối đa 900px, lấy màu chủ đạo; xuất WebP (giữ nền trong suốt) hoặc PNG.
function prepCut(blob){return new Promise((ok,no)=>{const u=URL.createObjectURL(blob),im=new Image();
 im.onerror=()=>{URL.revokeObjectURL(u);no(new Error('Không đọc được ảnh'))};
 im.onload=()=>{URL.revokeObjectURL(u);const W=im.naturalWidth,H=im.naturalHeight,s0=Math.min(1,1400/Math.max(W,H)),c=document.createElement('canvas');c.width=Math.round(W*s0);c.height=Math.round(H*s0);
  const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(im,0,0,c.width,c.height);const d=x.getImageData(0,0,c.width,c.height).data;
  let x0=c.width,y0=c.height,x1=0,y1=0,r=0,g=0,b=0,n=0;
  for(let y=0;y<c.height;y+=2)for(let X=0;X<c.width;X+=2){const p=(y*c.width+X)*4;if(d[p+3]>24){if(X<x0)x0=X;if(X>x1)x1=X;if(y<y0)y0=y;if(y>y1)y1=y;r+=d[p];g+=d[p+1];b+=d[p+2];n++}}
  if(!n){x0=0;y0=0;x1=c.width-1;y1=c.height-1;n=1;r=g=b=138}
  const pad=8,cw=Math.min(c.width,x1-x0+1+pad*2),chh=Math.min(c.height,y1-y0+1+pad*2),s=Math.min(1,900/Math.max(cw,chh)),o=document.createElement('canvas');
  o.width=Math.round(cw*s);o.height=Math.round(chh*s);o.getContext('2d').drawImage(c,Math.max(0,x0-pad),Math.max(0,y0-pad),cw,chh,0,0,o.width,o.height);
  const hex='#'+[r,g,b].map(v=>Math.round(v/n).toString(16).padStart(2,'0')).join(''),webp=o.toDataURL('image/webp').startsWith('data:image/webp');
  o.toBlob(bl=>bl?ok({blob:bl,c:hex,url:URL.createObjectURL(bl)}):no(new Error('Không xuất được ảnh')),webp?'image/webp':'image/png',.86)}
 im.src=u})}

// Bảng thêm / sửa món đồ (chỉ chủ kệ). Hai ô ảnh: mặt trước (bắt buộc) và mặt nghiêng (không bắt buộc), ảnh đã tách nền sẵn.
const VIEWS={front:{cap:'Mặt trước',tip:'Áo trải phẳng hoặc treo, chụp thẳng'},side:{cap:'Mặt nghiêng',tip:'Áo treo, chụp từ bên cạnh'}};
function garmentForm(edit){const g=edit||{name:'',brand:'',story:'',private:false},cut={front:null,side:null},had={front:edit&&edit.img,side:edit&&edit.side};let busy=0;
 const slot=v=>{const cur=had[v];return`<div class="gslot"><div class="gprev${cur?' has':''}" id="gpv_${v}" data-v="${v}">${cur?`<img src="${cur}" alt=""><button type="button" class="gre" data-v="${v}">${ic('camera')}Đổi ảnh</button>`
  :`<button type="button" class="gpick" data-v="${v}">${ic('camera')}<span>Chọn ảnh</span><small>${VIEWS[v].tip}</small></button>`}</div>
  <span class="gcap">${VIEWS[v].cap}${v==='side'?' <small>không bắt buộc</small>':''}</span></div>`};
 show(`<div class="panel wide"><div class="phead">${ic(edit?'pen':'imagePlus')}<h3>${edit?'Sửa món đồ':'Thêm món đồ vào tủ'}</h3></div>
 <div class="pgrid"><div class="pv"><div class="gpair">${slot('front')}${slot('side')}</div><p class="ph" id="gst">${edit?'Bấm “Đổi ảnh” để thay':'Dùng ảnh đã tách nền sẵn (PNG trong suốt)'}</p></div>
 <div class="form"><label for="gn">Tên món đồ</label><input type="text" id="gn" maxlength="40" placeholder="Ví dụ: Áo đấu sân khách 2024" value="${esc(g.name)}" autocomplete="off">
 <label for="gb">Thương hiệu</label><input type="text" id="gb" maxlength="30" placeholder="Ví dụ: Nike" value="${esc(g.brand)}" autocomplete="off">
 <label for="gs">Câu chuyện</label><textarea id="gs" maxlength="500" placeholder="Mua ở đâu, mặc trong dịp nào, vì sao quý…" style="height:110px">${esc(g.story)}</textarea>
 <label class="chk" for="gpr"><input type="checkbox" id="gpr" ${g.private?'checked':''}>${ic('lock')}<span>Riêng tư: chỉ mình tôi xem</span></label></div></div>
 <input type="file" id="gfi" accept="image/*,.heic,.heif" hidden>
 <div class="bar"><button class="btn" id="no">Hủy</button><button class="btn pri" id="ok">${ic('check')}${edit?'Lưu thay đổi':'Treo lên thanh'}</button></div></div>`);
 setTimeout(()=>$('gn').focus(),50);$('no').onclick=hide;
 const pick=async(f,v)=>{if(!f)return;const pv=$('gpv_'+v),ok=$('ok');busy++;ok.disabled=true;pv.classList.remove('has');pv.classList.add('busy');
  pv.innerHTML=`<span class="gpt">Đang chuẩn bị ảnh…</span>`;
  try{const out=await toJpegIfHeic(f);
   if(cut[v])URL.revokeObjectURL(cut[v].url);cut[v]=await prepCut(out);
   pv.classList.remove('busy');pv.classList.add('has');pv.innerHTML=`<img src="${cut[v].url}" alt="Ảnh xem trước"><button type="button" class="gre" data-v="${v}">${ic('camera')}Đổi ảnh</button>`;
   if(v==='front')$('gst').innerHTML=`Màu chủ đạo <i class="gsw" style="background:${cut.front.c}"></i>`}
  catch(e){pv.classList.remove('busy');pv.innerHTML=`<button type="button" class="gpick" data-v="${v}">${ic('camera')}<span>Chọn lại ảnh</span></button>`;fail(e)}
  if(!--busy)ok.disabled=false};
 let want='front';
 $('slot').querySelector('.panel').addEventListener('click',e=>{const t=e.target.closest('.gpick,.gre');if(t){want=t.dataset.v;$('gfi').click()}});
 $('gfi').onchange=e=>{const f=e.target.files[0];e.target.value='';pick(f,want)};
 $('ok').onclick=async()=>{const name=$('gn').value.trim();if(!name){$('gn').classList.add('err');$('gn').focus();toast('Cần đặt tên cho món đồ',1);return}
  if(!edit&&!cut.front){toast('Chọn ảnh mặt trước của chiếc áo trước đã',1);return}
  const f={name,brand:$('gb').value.trim(),story:$('gs').value.trim(),private:$('gpr').checked},bt=$('ok');bt.disabled=true;bt.innerHTML=`${ic('camera')}Đang lưu…`;
  try{if(edit){await dbUpdateGarment(edit,f);Object.assign(edit,f);
    if(cut.front){await dbSetGarmentPhoto(edit,'photo',cut.front.blob,{color:cut.front.c});edit.c=cut.front.c}
    if(cut.side)await dbSetGarmentPhoto(edit,'photo_side',cut.side.blob);
    hide();drawWardrobe();openGarment(garments.indexOf(edit))}
   else{const ng=await dbAddGarment({...f,c:cut.front.c},cut.front.blob,Math.max(-1,...garments.map(x=>x.pos))+1,cut.side&&cut.side.blob);garments.push(ng);hide();drawWardrobe();openGarment(garments.length-1)}
   hooks.books.forEach(x=>x());toast(edit?'Đã lưu':'Đã treo áo lên thanh')}catch(e){fail(e);bt.disabled=false;bt.innerHTML=`${ic('check')}${edit?'Lưu thay đổi':'Treo lên thanh'}`}};
}
$('addg').onclick=()=>garmentForm();
hooks.auth.push(async()=>{gP=null;await loadGarments();if(curRoom==='tu-do')drawWardrobe()});

room('tu-do',{title:'Tủ đồ sưu tầm',enter(from){scrollTo({top:0,behavior:'instant'});
 const sec=document.querySelector('[data-room=tu-do]');if(from&&!RM())sec.animate([{opacity:0,transform:'scale(.97)'},{opacity:1,transform:'none'}],{duration:420,easing:'ease-out'});
 drawWardrobe();loadGarments().then(()=>{if(curRoom==='tu-do')drawWardrobe()})},
 leave(){if($('ov').classList.contains('on'))hide()}});
