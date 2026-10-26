// Khu vực TỦ ĐỒ SƯU TẦM (#/tu-do): áo treo trên một thanh như cửa hàng; bấm một chiếc để xem lớn kèm câu chuyện.
// Chủ kệ thêm áo bằng ảnh chụp thường: web tự tách nền, cắt sát mép và lấy màu chủ đạo.
let garments=[],gP=null,wOpen=-1;
const loadGarments=()=>gP||(gP=dbLoadGarments().then(g=>{garments=g;hooks.books.forEach(f=>f());return g}).catch(e=>{gP=null;fail(e);return garments}));
const hangerSvg=`<svg class="hgr" viewBox="0 0 120 46" aria-hidden="true"><path d="M60 22V14a7 7 0 1 0-7-7" fill="none" stroke="#6b6560" stroke-width="2.6" stroke-linecap="round"/><path d="M60 21L8 41a3 3 0 0 0 1 5h102a3 3 0 0 0 1-5z" fill="#d9c4a0"/><path d="M60 21L8 41a3 3 0 0 0 1 5h102a3 3 0 0 0 1-5z" fill="none" stroke="#b99a72" stroke-width="1.2"/></svg>`;
// Áo mẫu (vẽ) cho tủ trống, để người xem hình dung.
const teeSvg=c=>`<svg viewBox="0 0 200 230" aria-hidden="true"><path d="M70 10q30 18 60 0l58 30-18 46-22-10v158H52V76L30 86 12 40z" fill="${c}"/><path d="M70 10q30 18 60 0" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="5"/><path d="M52 90v130M148 90v130" stroke="rgba(0,0,0,.08)" stroke-width="10"/></svg>`;

function drawWardrobe(){const st=$('wstage');if(!st)return;wOpen=-1;
 const n=garments.length;$('wcount').textContent=n?`${n} món · bấm một chiếc để xem câu chuyện`:'';
 const items=n?garments.map((g,i)=>`<button type="button" class="gi" data-i="${i}" style="--c:${g.c}" aria-label="${esc(g.name)}${g.brand?' · '+esc(g.brand):''}">${hangerSvg}<span class="gimgw"><img src="${g.img}" alt="" loading="lazy" draggable="false"></span>${g.private?`<i class="gpriv" title="Riêng tư">${ic('lock')}</i>`:''}</button>`).join('')
  :['#2c3e5c','#6f747a','#e6dcc6','#2f6b4a','#1f1f22','#c9b98f'].map(c=>`<span class="gi ghost">${hangerSvg}<span class="gimgw">${teeSvg(c)}</span></span>`).join('');
 st.innerHTML=`<div class="rail${n?'':' empty'}"><div class="rod"><i></i><i></i></div><div class="hang" id="hang">${items}</div></div>
  <p class="gname" id="gname" aria-live="polite">${n?'':me?'Tủ đồ đang trống. Bấm “Thêm món đồ” để treo chiếc áo đầu tiên.':'Tủ đồ đang được sắp xếp. Hẹn bạn quay lại sau!'}</p><div class="gdet" id="gdet" hidden></div>`;
 const h=$('hang');requestAnimationFrame(()=>{if(h.scrollWidth>h.clientWidth)h.scrollLeft=(h.scrollWidth-h.clientWidth)/2})}
function nameOf(i){const g=garments[i];$('gname').innerHTML=g?`<b>${esc(g.name)}</b>${g.brand?`<small>${esc(g.brand)}</small>`:''}`:''}
document.addEventListener('pointerover',e=>{const b=e.target.closest&&e.target.closest('#hang .gi:not(.ghost)');if(b&&wOpen<0)nameOf(+b.dataset.i)});
document.addEventListener('focusin',e=>{const b=e.target.closest&&e.target.closest('#hang .gi:not(.ghost)');if(b&&wOpen<0)nameOf(+b.dataset.i)});
document.addEventListener('click',e=>{const b=e.target.closest('#hang .gi:not(.ghost)');if(b)openGarment(+b.dataset.i,b)});

// Trang chi tiết: áo bay từ thanh treo ra giữa, thông tin bên phải.
function openGarment(i,from){const g=garments[i];if(!g)return;const d=$('gdet'),first=wOpen<0;wOpen=i;SFX.play('pull');
 d.innerHTML=`<button type="button" class="gnav" id="gprev" aria-label="Áo trước">${ic('chevL')}</button>
  <div class="gbig"><img id="gbimg" src="${g.img}" alt="${esc(g.name)}"></div>
  <div class="ginfo">${g.brand?`<small>${esc(g.brand)}</small>`:''}<h2>${esc(g.name)}</h2>${g.story?`<p>${esc(g.story).replace(/\n/g,'<br>')}</p>`:'<p class="nost">Chưa có câu chuyện cho món này.</p>'}
   <span class="gpos">${i+1} / ${garments.length}</span>
   <div class="bar gbar"><button type="button" class="btn" id="gback">${ic('chevL')}Về thanh treo</button>
    <button type="button" class="btn adm" id="gedit">${ic('pen')}Sửa</button><button type="button" class="btn adm" id="gpv">${ic(g.private?'lock':'unlock')}${g.private?'Riêng tư':'Công khai'}</button><button type="button" class="btn ghost adm" id="gdel">${ic('trash')}Xóa</button></div></div>
  <button type="button" class="gnav" id="gnext" aria-label="Áo sau">${ic('chevR')}</button>`;
 d.hidden=false;$('wstage').classList.add('det');$('gprev').disabled=i<=0;$('gnext').disabled=i>=garments.length-1;
 $('gprev').onclick=()=>openGarment(i-1);$('gnext').onclick=()=>openGarment(i+1);$('gback').onclick=closeGarment;
 $('gedit').onclick=()=>garmentForm(g);$('gdel').onclick=async()=>{if(!await ask(`Xóa “${g.name}” khỏi tủ đồ? Ảnh cũng bị xóa khỏi kho.`,'Xóa'))return;
  try{await dbDeleteGarment(g);garments.splice(i,1);drawWardrobe();hooks.books.forEach(f=>f());toast('Đã xóa món đồ')}catch(e){fail(e)}};
 $('gpv').onclick=async()=>{const v=!g.private;try{await dbUpdateGarment(g,{private:v});g.private=v;openGarment(i);toast(v?'Chỉ bạn thấy món này':'Đã công khai món này')}catch(e){fail(e)}};
 const img=$('gbimg'),src=from&&from.querySelector('img');
 if(first&&src&&!RM()){const a=src.getBoundingClientRect(),run=()=>{const b=img.getBoundingClientRect();if(!b.width)return;
   img.animate([{transform:`translate(${a.left-b.left}px,${a.top-b.top}px) scale(${a.width/b.width})`,transformOrigin:'0 0'},{transform:'none',transformOrigin:'0 0'}],{duration:560,easing:'cubic-bezier(.3,.9,.3,1)'})};
  img.complete?run():img.onload=run;d.querySelector('.ginfo').animate([{opacity:0,transform:'translateX(20px)'},{opacity:1,transform:'none'}],{duration:420,delay:180,fill:'backwards'})}
 else if(!RM())img.animate([{opacity:0,transform:'scale(.96)'},{opacity:1,transform:'none'}],{duration:260})}
function closeGarment(){if(wOpen<0)return;const i=wOpen;wOpen=-1;$('wstage').classList.remove('det');$('gdet').hidden=true;$('gdet').innerHTML='';SFX.play('slide');
 const b=document.querySelector(`#hang .gi[data-i="${i}"]`);if(b){b.focus({preventScroll:true});b.scrollIntoView({inline:'center',block:'nearest'});nameOf(i)}}
addEventListener('keydown',e=>{if(curRoom!=='tu-do'||wOpen<0||$('ov').classList.contains('on')||$('dlg').classList.contains('on'))return;
 if(e.key==='Escape')closeGarment();if(e.key==='ArrowLeft'&&wOpen>0)openGarment(wOpen-1);if(e.key==='ArrowRight'&&wOpen<garments.length-1)openGarment(wOpen+1)});

// ---------- tách nền và chuẩn bị ảnh ----------
let bgP;const loadBg=()=>bgP||(bgP=import('https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/+esm').catch(()=>{bgP=null;throw new Error('Không tải được bộ tách nền (cần mạng)')}));
async function toJpegIfHeic(f){if(/\.hei[cf]$/i.test(f.name||'')||/hei[cf]/i.test(f.type)){await loadHeic();const o=await heic2any({blob:f,toType:'image/jpeg',quality:.9});return Array.isArray(o)?o[0]:o}return f}
async function cutout(file,onP){const m=await loadBg();
 return m.removeBackground(file,{output:{format:'image/png'},progress:(k,c,t)=>{if(onP&&t)onP(/fetch/.test(k)?'Đang tải bộ tách nền':'Đang tách nền',c/t)}})}
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

// Bảng thêm / sửa món đồ (chỉ chủ kệ).
function garmentForm(edit){const g=edit||{name:'',brand:'',story:'',private:false};let cut=null;
 show(`<div class="panel wide"><div class="phead">${ic(edit?'pen':'imagePlus')}<h3>${edit?'Sửa món đồ':'Thêm món đồ vào tủ'}</h3></div>
 <div class="pgrid"><div class="pv"><div class="gprev${edit?' has':''}" id="gpv2">${edit?`<img src="${g.img}" alt="">`:`<button type="button" class="gpick" id="gpick">${ic('camera')}<span>Chọn ảnh áo</span><small>Chụp thẳng, áo trải phẳng hoặc treo móc</small></button>`}</div><p class="ph" id="gst">${edit?'Ảnh giữ nguyên':'Web sẽ tự tách nền'}</p></div>
 <div class="form"><label for="gn">Tên món đồ</label><input type="text" id="gn" maxlength="40" placeholder="Ví dụ: Áo đấu sân khách 2024" value="${esc(g.name)}" autocomplete="off">
 <label for="gb">Thương hiệu</label><input type="text" id="gb" maxlength="30" placeholder="Ví dụ: Nike" value="${esc(g.brand)}" autocomplete="off">
 <label for="gs">Câu chuyện</label><textarea id="gs" maxlength="500" placeholder="Mua ở đâu, mặc trong dịp nào, vì sao quý…" style="height:110px">${esc(g.story)}</textarea>
 ${edit?'':`<label class="chk" for="gnocut"><input type="checkbox" id="gnocut"><span>Ảnh đã tách nền sẵn (PNG trong suốt)</span></label>`}
 <label class="chk" for="gpr"><input type="checkbox" id="gpr" ${g.private?'checked':''}>${ic('lock')}<span>Riêng tư: chỉ mình tôi xem</span></label></div></div>
 <input type="file" id="gfi" accept="image/*,.heic,.heif" hidden>
 <div class="bar"><button class="btn" id="no">Hủy</button><button class="btn pri" id="ok">${ic('check')}${edit?'Lưu thay đổi':'Treo lên thanh'}</button></div></div>`);
 setTimeout(()=>$('gn').focus(),50);$('no').onclick=hide;
 const pick=async f=>{if(!f)return;const pv=$('gpv2'),st=$('gst'),ok=$('ok');ok.disabled=true;pv.classList.add('busy');
  pv.innerHTML=`<div class="gprog"><i id="gbar"></i></div><span class="gpt" id="gpt">Đang chuẩn bị…</span>`;
  try{const src=await toJpegIfHeic(f);let out=src;
   if(!$('gnocut').checked){try{out=await cutout(src,(t,p)=>{if($('gpt')){$('gpt').textContent=t+'…';$('gbar').style.width=Math.round(p*100)+'%'}})}
    catch(e){console.warn(e);toast('Chưa tách được nền ('+(e.message||e)+'). Dùng ảnh gốc, bạn có thể tách sẵn rồi tải lại.',1)}}
   if(cut)URL.revokeObjectURL(cut.url);cut=await prepCut(out);
   pv.classList.remove('busy');pv.classList.add('has');pv.innerHTML=`<img src="${cut.url}" alt="Ảnh xem trước"><button type="button" class="gre" id="gpick">${ic('camera')}Đổi ảnh</button>`;
   st.innerHTML=`Màu chủ đạo <i class="gsw" style="background:${cut.c}"></i>`}
  catch(e){pv.classList.remove('busy');pv.innerHTML=`<button type="button" class="gpick" id="gpick">${ic('camera')}<span>Chọn lại ảnh</span></button>`;fail(e)}
  ok.disabled=false};
 $('slot').querySelector('.panel').addEventListener('click',e=>{if(e.target.closest('#gpick'))$('gfi').click()});
 $('gfi').onchange=e=>{const f=e.target.files[0];e.target.value='';pick(f)};
 $('ok').onclick=async()=>{const name=$('gn').value.trim();if(!name){$('gn').classList.add('err');$('gn').focus();toast('Cần đặt tên cho món đồ',1);return}
  if(!edit&&!cut){toast('Chọn ảnh chiếc áo trước đã',1);return}
  const f={name,brand:$('gb').value.trim(),story:$('gs').value.trim(),private:$('gpr').checked},bt=$('ok');bt.disabled=true;bt.innerHTML=`${ic('camera')}Đang lưu…`;
  try{if(edit){await dbUpdateGarment(edit,f);Object.assign(edit,f);hide();drawWardrobe();openGarment(garments.indexOf(edit))}
   else{const ng=await dbAddGarment({...f,c:cut.c},cut.blob,Math.max(-1,...garments.map(x=>x.pos))+1);garments.push(ng);hide();drawWardrobe();openGarment(garments.length-1)}
   hooks.books.forEach(x=>x());toast(edit?'Đã lưu':'Đã treo áo lên thanh')}catch(e){fail(e);bt.disabled=false;bt.innerHTML=`${ic('check')}${edit?'Lưu thay đổi':'Treo lên thanh'}`}};
}
$('addg').onclick=()=>garmentForm();
hooks.auth.push(async()=>{gP=null;await loadGarments();if(curRoom==='tu-do')drawWardrobe()});

room('tu-do',{title:'Tủ đồ sưu tầm',enter(from){scrollTo({top:0,behavior:'instant'});
 const sec=document.querySelector('[data-room=tu-do]');if(from&&!RM())sec.animate([{opacity:0,transform:'scale(.97)'},{opacity:1,transform:'none'}],{duration:420,easing:'ease-out'});
 drawWardrobe();loadGarments().then(()=>{if(curRoom==='tu-do')drawWardrobe()})},
 leave(){if($('ov').classList.contains('on'))hide()}});
