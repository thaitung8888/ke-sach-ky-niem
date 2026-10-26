// Khu vực LỊCH LUYỆN TẬP (#/lich-tap): check thói quen hằng ngày + bảng ô vuông kiểu GitHub màu xanh xô thơm.
// Mỗi ô = % việc đã làm trên số việc có lịch hôm đó. Ngày nghỉ có phép không làm đứt chuỗi.
const HB={habits:[],checks:new Map(),rest:new Set(),loaded:false};
const GOOD=.8;               // ngày "đạt" để tính chuỗi chung: hoàn thành từ 80% trở lên
const EDIT_BACK=7;           // chủ kệ được sửa lại tối đa 7 ngày trước
const DOWN=['T2','T3','T4','T5','T6','T7','CN'],DOWL=['Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy','Chủ nhật'];
const HICONS=['🌅','🤸','💧','💻','🏋️','🚶','📖','🧘','🏃','🥗','😴','✍️','🎸','🧹','💊','📵'];
let habSel=null,habP=null;

// ---------- tính toán ----------
const hv=(h,d)=>HB.checks.get(h.id+'|'+d)||0;
const hfrac=(h,d)=>h.kind==='count'?Math.min(1,hv(h,d)/h.target):(hv(h,d)>=1?1:0);
const hdue=(h,d)=>d>=h.start&&(!h.archived||d<h.archived)&&(!h.days||h.days.includes(isoDow(d)));
function dayStat(d){if(HB.rest.has(d))return{rest:1};const L=HB.habits.filter(h=>hdue(h,d));if(!L.length)return{none:1};
 const s=L.reduce((a,h)=>a+hfrac(h,d),0);return{p:s/L.length,done:L.filter(h=>hfrac(h,d)===1).length,n:L.length}}
const hlevel=p=>p<=0?0:p<=.25?1:p<=.5?2:p<=.75?3:4;
const firstDay=()=>HB.habits.reduce((m,h)=>h.start<m?h.start:m,dayKey());
// Chuỗi: test(d) trả về 'ok' | 'skip' (ngày nghỉ / không có lịch) | 'bad'. Hôm nay chưa xong thì chưa tính là đứt.
function streaks(test,from){const t=dayKey();let cur=0,best=0,run=0;
 for(let d=t;d>=from;d=addDays(d,-1)){const s=test(d);if(s==='skip')continue;if(s==='ok'){cur++;continue}if(d===t)continue;break}
 for(let d=from;d<=t;d=addDays(d,1)){const s=test(d);if(s==='skip')continue;if(s==='ok'){run++;best=Math.max(best,run)}else if(d!==t)run=0}
 return{cur,best:Math.max(best,cur)}}
const habitStreak=h=>streaks(d=>HB.rest.has(d)||!hdue(h,d)?'skip':hfrac(h,d)===1?'ok':'bad',h.start);
const allStreak=()=>streaks(d=>{const s=dayStat(d);return s.rest||s.none?'skip':s.p>=GOOD?'ok':'bad'},firstDay());
const schedTxt=h=>!h.days?'Hằng ngày':h.days.map(x=>DOWN[x-1]).join(' · ');
const fmtDay=d=>{const x=kd(d);return `${DOWL[isoDow(d)-1]}, ${x.getUTCDate()}/${x.getUTCMonth()+1}`};

// ---------- tải dữ liệu ----------
function loadHabits(force){if(habP&&!force)return habP;
 return habP=dbLoadHabits(addDays(dayKey(),-400)).then(r=>{Object.assign(HB,r,{loaded:true});if(curRoom==='lich-tap')renderHabits();if(curRoom==='phong'&&typeof drawRoom==='function')drawRoom();return HB})
  .catch(e=>{habP=null;fail(e);if(curRoom==='lich-tap')$('hwrap').innerHTML=`<p class="empty">${esc(e.message||'Không tải được lịch tập')}</p>`;return HB})}
hooks.auth.push(()=>loadHabits(true));

// ---------- giao diện ----------
const ring=(p,txt)=>{const C=2*Math.PI*42;return `<svg class="ring" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="42" class="rtrack"/><circle cx="50" cy="50" r="42" class="rfill" stroke-dasharray="${(C*p).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 50 50)"/><text x="50" y="49" text-anchor="middle" class="rbig">${Math.round(p*100)}%</text><text x="50" y="64" text-anchor="middle" class="rsmall">${txt}</text></svg>`};
function rowHtml(h,d,ro){const f=hfrac(h,d),v=hv(h,d),st=habitStreak(h),nm=h.name==null?'Thói quen riêng tư':esc(h.name);
 const ctrl=h.kind==='count'?`<div class="hcnt"><button type="button" data-d="-1" aria-label="Bớt" ${ro||v<=0?'disabled':''}>−</button><span><b>${v}</b>/${h.target}${h.unit?' '+esc(h.unit):''}</span><button type="button" data-d="1" aria-label="Thêm" ${ro?'disabled':''}>+</button></div>`
  :`<button type="button" class="hchk" aria-pressed="${f===1}" aria-label="${f===1?'Bỏ đánh dấu':'Đánh dấu đã làm'}" ${ro?'disabled':''}><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></button>`;
 return `<li class="hrow${f===1?' done':''}${h.name==null?' locked':''}" data-id="${h.id}" style="--f:${f}"><span class="hic">${h.icon}</span>
  <button type="button" class="hnm" ${ro||h.name==null?'disabled':''} title="${ro?'':'Sửa thói quen'}"><b>${nm}${h.private&&h.name!=null?` <i class="hpv" title="Riêng tư">${ic('lock')}</i>`:''}</b><small>${st.cur?`🔥 ${st.cur} ngày · `:''}${schedTxt(h)}</small></button>${ctrl}<i class="hbar"></i></li>`}
function heatHtml(){const t=dayKey(),start=addDays(t,-(52*7+isoDow(t)-1)),f0=firstDay();let cells='',months='',lastM=-1;
 for(let w=0;w<53;w++){const d0=addDays(start,w*7),m=kd(d0).getUTCMonth(),dd=kd(d0).getUTCDate();
  if(m!==lastM&&dd<=7){months+=`<span style="grid-column:${w+1}">Th${m+1}</span>`;lastM=m}else if(lastM===-1)lastM=m;
  for(let r=0;r<7;r++){const d=addDays(d0,r);if(d>t){cells+='<i class="fut"></i>';continue}
   const s=d<f0?{none:1}:dayStat(d),x=kd(d),lab=`${x.getUTCDate()}/${x.getUTCMonth()+1}/${x.getUTCFullYear()}`;
   cells+=s.rest?`<i class="rest" title="${lab}: nghỉ có phép" data-d="${d}"></i>`:s.none?`<i class="lv0" title="${lab}: không có lịch" data-d="${d}"></i>`
    :`<i class="lv${hlevel(s.p)}${d===t?' today':''}" title="${lab}: ${s.done}/${s.n} việc (${Math.round(s.p*100)}%)" data-d="${d}"></i>`}}
 return `<div class="heatwrap" id="heatwrap"><div class="hmonths">${months}</div><div class="hdays"><span>T2</span><span></span><span>T4</span><span></span><span>T6</span><span></span><span></span></div><div class="heat">${cells}</div></div>
  <div class="hlegend"><span>Ít</span><i class="lv0"></i><i class="lv1"></i><i class="lv2"></i><i class="lv3"></i><i class="lv4"></i><span>Nhiều</span><i class="rest"></i><span>Nghỉ có phép</span></div>`}
function statsHtml(){const t=dayKey(),A=allStreak(),f0=firstDay();let sum=0,n=0,checks=0;
 for(let d=addDays(t,-29);d<=t;d=addDays(d,1)){if(d<f0)continue;const s=dayStat(d);if(s.rest||s.none)continue;sum+=s.p;n++}
 HB.checks.forEach(v=>{if(v>0)checks++});
 const per=HB.habits.filter(h=>!h.archived).map(h=>{let s=0,c=0;for(let d=addDays(t,-29);d<=t;d=addDays(d,1)){if(HB.rest.has(d)||!hdue(h,d))continue;s+=hfrac(h,d);c++}
  return{h,p:c?s/c:0,st:habitStreak(h)}});
 const wd=Array.from({length:7},()=>[0,0]);for(let d=addDays(t,-89);d<=t;d=addDays(d,1)){if(d<f0)continue;const s=dayStat(d);if(s.rest||s.none)continue;const k=isoDow(d)-1;wd[k][0]+=s.p;wd[k][1]++}
 const wp=wd.map(([s,c])=>c?s/c:0),bestW=wp.indexOf(Math.max(...wp));
 return `<div class="kpis"><div><b>🔥 ${A.cur}</b><small>chuỗi ngày đạt hiện tại</small></div><div><b>${A.best}</b><small>chuỗi dài nhất</small></div><div><b>${n?Math.round(sum/n*100):0}%</b><small>hoàn thành 30 ngày</small></div><div><b>${checks}</b><small>lượt đánh dấu</small></div></div>
  <h3>365 ngày qua</h3>${heatHtml()}
  <div class="hsplit"><div><h3>Từng thói quen · 30 ngày</h3><ul class="hper">${per.map(({h,p,st})=>`<li><span>${h.icon} ${h.name==null?'Riêng tư':esc(h.name)}</span><i style="--p:${p}"></i><b>${Math.round(p*100)}%</b><small>${st.best?`dài nhất ${st.best}`:''}</small></li>`).join('')}</ul></div>
  <div><h3>Theo thứ trong tuần · 90 ngày</h3><div class="hweek">${wp.map((p,k)=>`<div class="${k===bestW&&p>0?'best':''}"><i style="--p:${p}"></i><span>${DOWN[k]}</span></div>`).join('')}</div>
  <p class="hnote">${wp[bestW]>0?`Bạn chăm nhất vào <b>${DOWL[bestW]}</b>.`:'Chưa đủ dữ liệu.'} Ngày “đạt” là ngày hoàn thành từ ${GOOD*100}% việc trở lên.</p></div></div>`}
function renderHabits(){const w=$('hwrap');if(!w)return;if(!HB.loaded){w.innerHTML='<p class="empty">Đang tải lịch tập...</p>';return}
 const t=dayKey();if(!habSel||habSel>t||habSel<addDays(t,-EDIT_BACK))habSel=t;const d=habSel,s=dayStat(d),ro=!me,rest=HB.rest.has(d);
 const L=HB.habits.filter(h=>hdue(h,d)),off=HB.habits.filter(h=>!hdue(h,d)&&!h.archived&&d>=h.start);
 const head=d===t?'Hôm nay':d===addDays(t,-1)?'Hôm qua':`${Math.round((kd(t)-kd(d))/864e5)} ngày trước`;
 w.innerHTML=`<div class="hgrid"><section class="hcard htoday" aria-label="Việc trong ngày">
  <div class="hday"><button type="button" id="hprev" aria-label="Ngày trước" ${d<=addDays(t,-EDIT_BACK)?'disabled':''}>${ic('chevL')}</button><div><b>${head}</b><small>${fmtDay(d)}</small></div><button type="button" id="hnext" aria-label="Ngày sau" ${d>=t?'disabled':''}>${ic('chevR')}</button></div>
  <div class="hring${s.p===1?' full':''}">${rest?ring(0,'nghỉ'):s.none?ring(0,'trống'):ring(s.p,`${s.done}/${s.n} việc`)}</div>
  ${rest?`<p class="hrestmsg">🌿 Ngày nghỉ có phép. Chuỗi ngày vẫn được giữ.</p>`:''}
  <ul class="hlist${rest?' resting':''}">${L.map(h=>rowHtml(h,d,ro||rest)).join('')||'<li class="hempty">Không có việc nào theo lịch hôm nay.</li>'}</ul>
  ${off.length?`<p class="hoff">Không có lịch hôm nay: ${off.map(h=>h.name==null?'🔒':`${h.icon} ${esc(h.name)}`).join(', ')}</p>`:''}
  <div class="hact adm"><button type="button" class="btn" id="hrest">${rest?'Bỏ nghỉ có phép':'🌿 Nghỉ có phép'}</button><button type="button" class="btn pri" id="hadd">${ic('check')}Thêm thói quen</button></div>
  ${ro?`<p class="hro">${ic('lock')}Chỉ chủ phòng mới đánh dấu được.</p>`:''}
 </section><section class="hcard hstats" aria-label="Thống kê">${statsHtml()}</section></div>`;
 const hw=$('heatwrap');if(hw)hw.scrollLeft=hw.scrollWidth}

// ---------- thao tác ----------
async function setVal(h,d,v){const k=h.id+'|'+d,old=hv(h,d),before=dayStat(d).p;
 if(v>0)HB.checks.set(k,v);else HB.checks.delete(k);SFX.play(v>old?'tick':'click');renderHabits();
 const after=dayStat(d).p;if(after===1&&before<1)toast(d===dayKey()?'Hoàn thành trọn vẹn hôm nay! 🎉':'Ngày này đã hoàn thành trọn vẹn 🎉');
 try{await dbSetCheck(h.id,d,v)}catch(e){if(old>0)HB.checks.set(k,old);else HB.checks.delete(k);renderHabits();fail(e)}}
function habitEditor(h){const nw=!h;h=h||{name:'',icon:HICONS[0],kind:'check',target:1,unit:'',days:null,private:false,pos:HB.habits.length+1};let days=h.days?[...h.days]:[1,2,3,4,5,6,7];
 show(`<div class="panel"><div class="phead">${ic('check')}<h3>${nw?'Thói quen mới':'Sửa thói quen'}</h3></div>
  <form class="form" id="hf" novalidate><label for="hn">Tên</label><input type="text" id="hn" maxlength="40" value="${esc(h.name)}" placeholder="Ví dụ: Đọc sách 20 phút" autocomplete="off">
  <label>Biểu tượng</label><div class="chips hico" id="hi"></div>
  <label>Kiểu</label><div class="chips hkind" id="hk"></div>
  <div class="htgt" id="ht"><label for="hq">Mục tiêu mỗi ngày</label><div class="hrowf"><input type="number" id="hq" min="1" max="999" value="${h.target}"><input type="text" id="hu" maxlength="10" value="${esc(h.unit)}" placeholder="ly, phút, từ…"></div></div>
  <label>Lịch trong tuần</label><div class="hdays7" id="hd">${DOWN.map((x,k)=>`<button type="button" data-k="${k+1}">${x}</button>`).join('')}</div>
  <label class="chk" for="hp"><input type="checkbox" id="hp" ${h.private?'checked':''}>${ic('lock')}<span>Riêng tư: người xem chỉ thấy màu ô, không thấy tên</span></label>
  <p class="lerr" id="herr" role="alert"></p>
  <div class="bar">${nw?'':`<button type="button" class="btn ghost hstop" id="hx">Ngừng theo dõi</button>`}<button type="button" class="btn" id="no">Hủy</button><button type="submit" class="btn pri" id="ok">${ic('check')}Lưu</button></div></form></div>`);
 chips('hi',HICONS.map(x=>`<span class="em">${x}</span>`),null,Math.max(0,HICONS.indexOf(h.icon)));
 chips('hk',['Có / không','Số lượng'],k=>{$('ht').hidden=k!==1},h.kind==='count'?1:0);$('ht').hidden=h.kind!=='count';
 const drawD=()=>[...$('hd').children].forEach(b=>{const on=days.includes(+b.dataset.k);b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});drawD();
 $('hd').onclick=e=>{const b=e.target.closest('button');if(!b)return;const k=+b.dataset.k;days=days.includes(k)?days.filter(x=>x!==k):[...days,k].sort();drawD()};
 $('no').onclick=()=>hide();setTimeout(()=>$('hn').focus(),50);
 if($('hx'))$('hx').onclick=async()=>{if(!await ask(`Ngừng theo dõi “${h.name}”? Lịch sử cũ vẫn được giữ trên bảng thống kê.`,'Ngừng theo dõi'))return;
  try{await dbArchiveHabit(h,dayKey());h.archived=dayKey();hide();renderHabits();toast('Đã ngừng theo dõi')}catch(e){fail(e)}};
 $('hf').onsubmit=async e=>{e.preventDefault();const name=$('hn').value.trim();if(!name){$('herr').textContent='Cần đặt tên cho thói quen';$('hn').focus();return}
  if(!days.length){$('herr').textContent='Chọn ít nhất một ngày trong tuần';return}
  const kind=$('hk').dataset.v==='1'?'count':'check',obj={...h,name,icon:HICONS[+$('hi').dataset.v],kind,target:kind==='count'?Math.max(1,+$('hq').value||1):1,unit:kind==='count'?$('hu').value.trim():'',days:days.length===7?null:days,private:$('hp').checked};
  const bt=$('ok');bt.disabled=true;
  try{const id=await dbSaveHabit(obj);if(nw){obj.id=id;obj.start=dayKey();HB.habits.push(obj)}else Object.assign(h,obj);hide();renderHabits();toast(nw?`Đã thêm “${name}”`:'Đã lưu thói quen')}catch(err){fail(err);bt.disabled=false}}}
document.addEventListener('click',async e=>{const w=e.target.closest('#hwrap');if(!w)return;const t=dayKey();
 if(e.target.closest('#hprev')){habSel=addDays(habSel,-1);renderHabits();return}
 if(e.target.closest('#hnext')){habSel=addDays(habSel,1);renderHabits();return}
 const cell=e.target.closest('.heat i[data-d]');if(cell){const d=cell.dataset.d;if(d>=addDays(t,-EDIT_BACK)&&d<=t){habSel=d;renderHabits();$('hwrap').scrollIntoView({behavior:RM()?'auto':'smooth'})}return}
 if(!me)return;
 if(e.target.closest('#hadd'))return habitEditor();
 if(e.target.closest('#hrest')){const d=habSel,on=!HB.rest.has(d);on?HB.rest.add(d):HB.rest.delete(d);renderHabits();SFX.play('click');
  try{await dbSetRest(d,on);toast(on?'Đã đánh dấu nghỉ có phép':'Đã bỏ nghỉ có phép')}catch(err){on?HB.rest.delete(d):HB.rest.add(d);renderHabits();fail(err)}return}
 const row=e.target.closest('.hrow');if(!row)return;const h=HB.habits.find(x=>x.id===row.dataset.id);if(!h)return;
 if(e.target.closest('.hnm'))return habitEditor(h);
 if(e.target.closest('.hchk'))return setVal(h,habSel,hv(h,habSel)>=1?0:1);
 const b=e.target.closest('.hcnt button');if(b)setVal(h,habSel,Math.max(0,hv(h,habSel)+(+b.dataset.d)))});

room('lich-tap',{title:'Lịch luyện tập',enter(from){scrollTo({top:0,behavior:'instant'});habSel=dayKey();
 const sec=document.querySelector('[data-room=lich-tap]');if(from&&!RM())sec.animate([{opacity:0,transform:'scale(.97)'},{opacity:1,transform:'none'}],{duration:420,easing:'ease-out'});
 renderHabits();loadHabits()}});
