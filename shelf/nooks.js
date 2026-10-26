// Phần trang trí của kệ: book nook 3D, đồ vật trên kệ, mèo, dây đèn, cửa sổ, đèn bàn.
// Chỉ để trang trí, không lưu vào database.
const NK=(()=>{
 let u=0;
 const lg=(id,st,dir='0 0 0 1')=>{const[a,b,c,d]=dir.split(' ');return `<linearGradient id="${id}" x1="${a}" y1="${b}" x2="${c}" y2="${d}">${st.map(([o,col,op])=>`<stop offset="${o}" stop-color="${col}"${op!=null?` stop-opacity="${op}"`:''}/>`).join('')}</linearGradient>`};
 const rgw=(id,c)=>`<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity=".85"/><stop offset=".45" stop-color="${c}" stop-opacity=".3"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;
 const stars=(pts)=>pts.map(([x,y,d],k)=>`<circle class="tw" cx="${x}" cy="${y}" r="${k%3?.6:.9}" fill="#fff" style="animation-delay:-${d}s"/>`).join('');
 const lan=(x,y,r,c,d,g)=>`<g class="sw" style="transform-origin:${x}px ${y-6}px;animation-delay:-${d}s"><line x1="${x}" y1="${y-6}" x2="${x}" y2="${y}" stroke="#2a1a14" stroke-width=".8"/><circle class="fl" cx="${x}" cy="${y+r+1}" r="${r*2.6}" fill="url(#${g})"/><rect x="${x-r*.45}" y="${y}" width="${r*.9}" height="2" fill="#5a1a12"/><ellipse cx="${x}" cy="${y+r+1}" rx="${r}" ry="${r*1.15}" fill="${c}"/><path d="M${x-r*.45} ${y+2.4}Q${x+r*.35} ${y+r+1} ${x-r*.45} ${y+r*2}M${x+r*.45} ${y+2.4}Q${x-r*.35} ${y+r+1} ${x+r*.45} ${y+r*2}" stroke="rgba(0,0,0,.2)" stroke-width=".8" fill="none"/><ellipse cx="${x-r*.35}" cy="${y+r*.7}" rx="${r*.22}" ry="${r*.45}" fill="#fff" opacity=".35"/><rect x="${x-r*.45}" y="${y+r*2.15}" width="${r*.9}" height="2" fill="#5a1a12"/><path d="M${x} ${y+r*2.15+2}v${r*.9}" stroke="#ffd27a" stroke-width="1.3"/></g>`;
 const steam=(x,y,d)=>`<path class="st" d="M${x} ${y}q-3-4 0-8t0-8" stroke="#fff" stroke-width="1.4" fill="none" stroke-linecap="round" style="animation-delay:-${d}s"/>`;
 const ff=(x,y,d,s)=>`<circle class="ff" cx="${x}" cy="${y}" r="1.5" fill="#efff9a" style="animation-delay:-${d}s;animation-duration:${s}s"/><circle class="ff" cx="${x}" cy="${y}" r="4" fill="#efff9a" opacity=".25" style="animation-delay:-${d}s;animation-duration:${s}s"/>`;
 const rain=()=>{let s='';for(let y=-24;y<124;y+=12)for(let k=0;k<7;k++){const x=18+k*10+(y/12%2?5:0);s+=`<path d="M${x} ${y}l-1.6 6" />`}return s};
 const leaf=(x,y,r,a,c)=>`<ellipse cx="${x}" cy="${y}" rx="${r*.55}" ry="${r}" fill="${c}" transform="rotate(${a} ${x} ${y})"/>`;

 // Mỗi cảnh: tên trên biển đồng, màu ánh sáng, nền 4 vách (trái, phải, trần, sàn), các lớp ảnh [độ sâu 0..1, nội dung svg].
 const SC=[
 id=>({n:'Phố Hội',c:'#ffb35a',
  w:['linear-gradient(#5b3420,#5b3420) 30% 34%/34% 16% no-repeat,linear-gradient(#ffcf6e,#ffcf6e) 64% 58%/22% 14% no-repeat,linear-gradient(90deg,#d6a24f,#b97f36)',
     'linear-gradient(#ffcf6e,#ffcf6e) 40% 34%/22% 14% no-repeat,linear-gradient(#5b3420,#5b3420) 66% 62%/30% 18% no-repeat,linear-gradient(270deg,#d6a24f,#b07433)',
     'radial-gradient(1px 1px at 30% 40%,#fff,transparent),radial-gradient(1px 1px at 70% 60%,#fff,transparent),linear-gradient(#1f1a3d,#3a2a55)',
     'repeating-linear-gradient(90deg,#5d4836 0 11px,#4a382b 11px 12px),#54412f'],
  L:[[1,`<defs>${lg('a'+id,[[0,'#2a2150'],[.55,'#8b4b6c'],[1,'#f2a766']])}</defs><rect width="100" height="196" fill="url(#a${id})"/>${stars([[12,14,0],[30,8,1],[88,18,2],[52,22,.6]])}<circle cx="74" cy="30" r="15" fill="#fff4d6" opacity=".14"/><circle cx="74" cy="30" r="7" fill="#fff4d6"/>
   <path d="M10 196V98h80v98z" fill="#e3b35f"/><path d="M0 102L50 70l50 32z" fill="#6a3424"/><path d="M0 101h100v6H0z" fill="#4a2318"/><path d="M40 196v-40a10 10 0 0 1 20 0v40z" fill="#3a2016"/>
   <rect class="fl" x="17" y="118" width="15" height="19" fill="#ffd27a"/><rect class="fl" x="68" y="118" width="15" height="19" fill="#ffd27a" style="animation-delay:-1.3s"/><path d="M17 127.5h15M24.5 118v19M68 127.5h15M75.5 118v19" stroke="#8a5a2a" stroke-width="1.2"/>`],
   [.55,`<defs>${rgw('g'+id,'#ffcf6e')}</defs><path d="M0 30Q50 56 100 30" stroke="#2a1a14" stroke-width=".9" fill="none"/>${lan(22,40,6.5,'#ff5a3c',0,'g'+id)}${lan(50,45,7.5,'#ffb03a',1.2,'g'+id)}${lan(78,40,6.5,'#e8434f',2.1,'g'+id)}
   <g class="pl" style="transform-origin:0px 0px">${[[3,5,9,'#d9407e'],[15,3,7,'#e6508f'],[8,16,8,'#f07aab'],[23,11,6,'#d9407e'],[2,27,6,'#e6508f'],[12,26,4,'#f6a1c2']].map(([x,y,r,c])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`).join('')}${leaf(26,4,4,40,'#3f7a3a')}${leaf(6,34,4,-20,'#3f7a3a')}</g>`],
   [.14,`<defs>${rgw('h'+id,'#ffcf6e')}</defs>${lan(9,4,10,'#e8434f',.5,'h'+id)}
   <g class="pl" style="transform-origin:84px 196px;animation-delay:-1.1s">${leaf(78,170,12,-25,'#3d7a45')}${leaf(90,168,13,20,'#4f9a58')}${leaf(84,160,12,0,'#5aa864')}</g><path d="M72 196l3-17h20l3 17z" fill="#b5653f"/><path d="M70 177h30v4H70z" fill="#9a5233"/>`]]}),
 id=>({n:'Cà phê mưa',c:'#ffc46b',
  w:['repeating-linear-gradient(180deg,#6a4630 0 13px,#5a3a27 13px 14px)','repeating-linear-gradient(180deg,#6a4630 0 13px,#5a3a27 13px 14px)',
     'radial-gradient(circle at 50% 70%,#8a5a34,#2b1c14 70%)','repeating-linear-gradient(90deg,#3e2a1f 0 9px,#33231a 9px 10px)'],
  L:[[1,`<defs>${lg('a'+id,[[0,'#0f1a3a'],[1,'#2d3e6e']])}<clipPath id="c${id}"><rect x="16" y="22" width="68" height="92"/></clipPath></defs><rect width="100" height="196" fill="#6b4a33"/><rect x="16" y="22" width="68" height="92" fill="url(#a${id})"/>
   <g clip-path="url(#c${id})"><path d="M16 114V82h9V72h10v14h6V60h11v26h7V74h10v20h6V68h11v46z" fill="#141a33"/>${[[22,90],[29,80],[46,66],[46,76],[54,92],[63,80],[70,98],[78,74],[78,84]].map(([x,y],k)=>`<rect class="fl" x="${x}" y="${y}" width="3" height="3.5" fill="#ffd98a" style="animation-delay:-${k*.7}s"/>`).join('')}
   <circle cx="30" cy="104" r="5" fill="#ffb35a" opacity=".35"/><circle cx="62" cy="108" r="6" fill="#7ab0ff" opacity=".3"/><circle cx="76" cy="102" r="4" fill="#ff7a8a" opacity=".3"/><g class="rn" stroke="#a9c0f0" stroke-width=".7" opacity=".6">${rain()}</g></g>
   <path d="M50 22v92M16 68h68" stroke="#3a2416" stroke-width="2.5"/><rect x="16" y="22" width="68" height="92" fill="none" stroke="#3a2416" stroke-width="4"/><rect x="11" y="114" width="78" height="5" fill="#8a5d3a"/>`],
   [.5,`<defs>${rgw('g'+id,'#ffc46b')}</defs><g class="sw" style="transform-origin:50px 0px;animation-duration:5s"><line x1="50" y1="0" x2="50" y2="34" stroke="#1a110c" stroke-width="1"/><circle class="fl" cx="50" cy="46" r="30" fill="url(#g${id})"/><path d="M38 44q12-17 24 0z" fill="#d9573a"/><ellipse cx="50" cy="44" rx="5" ry="2" fill="#fff1c0"/></g>
   <rect x="0" y="146" width="100" height="6" fill="#a2724a"/><rect x="0" y="152" width="100" height="44" fill="#4a3022"/><path d="M0 160h100" stroke="#3a2418" stroke-width="1"/>
   <path d="M20 131h15l-1.6 15H21.6z" fill="#f4ecdc"/><path d="M35 134q6 1 0 8" stroke="#f4ecdc" stroke-width="2" fill="none"/>${steam(24,129,0)}${steam(28,129,1.1)}${steam(32,129,2.2)}
   <rect x="58" y="140" width="28" height="6" fill="#3f6ea8"/><rect x="61" y="134" width="24" height="6" fill="#e8c15a"/><rect x="59" y="128.5" width="25" height="5.5" fill="#e07a5f"/>`],
   [.12,`<g transform="translate(66 150) scale(.75)"><path d="M0 46C0 26 6 14 14 12c-2-6 0-12 3-15l4 7h6l4-7c3 3 5 9 3 15 8 2 14 14 14 34z" fill="#1d1a1f"/><circle cx="17" cy="7" r="1.6" fill="#f2c94c"/><circle cx="27" cy="7" r="1.6" fill="#f2c94c"/><path class="tail" d="M40 44q18-2 15-22" stroke="#1d1a1f" stroke-width="4.5" fill="none" stroke-linecap="round" style="transform-origin:40px 44px"/></g>
   <g class="pl" style="transform-origin:10px 196px">${leaf(6,168,15,-15,'#2f6b45')}${leaf(18,160,13,25,'#3d8455')}${leaf(4,150,11,-40,'#4f9a62')}</g>`]]}),
 id=>({n:'Sân ga',c:'#ffd98a',
  w:['repeating-linear-gradient(180deg,#7a3e2c 0 6px,#5e2c1f 6px 7px)','repeating-linear-gradient(180deg,#7a3e2c 0 6px,#5e2c1f 6px 7px)',
     'radial-gradient(1px 1px at 20% 30%,#fff,transparent),radial-gradient(1px 1px at 60% 70%,#fff,transparent),linear-gradient(#0c1330,#1a2550)','linear-gradient(180deg,#3b3a40 0 36%,#e8c15a 36% 42%,#77726c 42%)'],
  L:[[1,`<defs>${lg('a'+id,[[0,'#0d1433'],[.6,'#2b3f6b'],[1,'#557590']])}</defs><rect width="100" height="196" fill="url(#a${id})"/>${stars([[10,12,0],[36,26,1.2],[60,10,.4],[86,30,2],[74,52,1.6],[20,48,.9]])}<circle cx="26" cy="32" r="13" fill="#f3ecd2" opacity=".12"/><circle cx="26" cy="32" r="6.5" fill="#f3ecd2"/>
   <path d="M0 124l24-28 18 16 22-32 36 42v74H0z" fill="#1d2b47"/><path d="M0 144l30-16 26 12 20-10 24 14v52H0z" fill="#162139"/>`],
   [.55,`<rect x="0" y="152" width="100" height="2.5" fill="#9aa0aa"/><rect x="0" y="160" width="100" height="2" fill="#6a6f78"/><g class="tr"><rect x="0" y="110" width="200" height="40" rx="4" fill="#2f5d7c"/><rect y="110" width="200" height="6" rx="3" fill="#234a64"/>${Array.from({length:10},(_,k)=>`<rect x="${7+k*19.5}" y="121" width="12" height="11" rx="1.5" fill="#ffd98a"/>`).join('')}<rect y="138" width="200" height="3" fill="#e8c15a"/><path d="M200 110h8q14 0 16 22v18h-24z" fill="#2f5d7c"/><rect x="204" y="118" width="11" height="10" rx="2" fill="#bfe3ff"/>${[20,60,120,160,206].map(x=>`<circle cx="${x}" cy="151" r="4" fill="#1a1d24"/>`).join('')}</g>`],
   [.15,`<defs>${rgw('g'+id,'#ffd98a')}</defs><rect x="10" y="58" width="3" height="138" fill="#1a1a22"/><path d="M5.5 58h12l-2.5-9H8z" fill="#1a1a22"/><circle class="fl" cx="11.5" cy="62" r="19" fill="url(#g${id})"/><rect x="8.5" y="55" width="6" height="7" fill="#fff0b0"/>
   <path d="M43 0v10M59 0v10" stroke="#1a1a22" stroke-width="1"/><rect x="34" y="10" width="34" height="12" rx="2" fill="#2a6b4f"/><text x="51" y="18.4" font-size="5.6" font-family="'Be Vietnam Pro',system-ui,sans-serif" font-weight="600" fill="#fff" text-anchor="middle">SÂN GA 1</text>
   <rect x="64" y="166" width="24" height="27" rx="3" fill="#c2553f"/><rect x="71" y="160" width="10" height="7" rx="2" fill="none" stroke="#7a2e22" stroke-width="2"/><rect x="64" y="177" width="24" height="2.5" fill="#7a2e22"/><circle cx="81" cy="186" r="3" fill="#e8c15a"/><rect x="67" y="183" width="7" height="5" rx="1" fill="#8cc1d9"/>`]]}),
 id=>({n:'Vườn đêm',c:'#d8ff8a',
  w:['radial-gradient(circle at 30% 40%,#2f6b4c,#183d2d 60%,#0f2a20)','radial-gradient(circle at 70% 50%,#2f6b4c,#183d2d 60%,#0f2a20)','linear-gradient(#0c1a30,#12304a)','linear-gradient(#1f4b38,#2b6047)'],
  L:[[1,`<defs>${lg('a'+id,[[0,'#0d1c35'],[.6,'#18445a'],[1,'#245b52']])}${rgw('m'+id,'#fff2c4')}</defs><rect width="100" height="196" fill="url(#a${id})"/>${stars([[12,14,0],[40,26,1],[28,8,2],[86,12,.5],[60,40,1.5],[8,40,.8]])}<circle cx="68" cy="40" r="26" fill="url(#m${id})"/><circle cx="68" cy="40" r="9" fill="#fff2c4"/>
   <path d="M0 140Q30 112 60 132T100 120V196H0z" fill="#1c4a40"/>`],
   [.5,`<defs>${rgw('g'+id,'#ffd37a')}</defs><rect x="52" y="122" width="30" height="28" fill="#3a2a22"/><path d="M47 123L67 105L87 123z" fill="#6d2f2a"/><circle class="fl" cx="65" cy="136" r="14" fill="url(#g${id})"/><rect class="fl" x="60" y="130" width="9" height="11" fill="#ffd37a"/><path d="M64.5 130v11M60 135.5h9" stroke="#3a2a22" stroke-width="1"/><rect x="73" y="135" width="6" height="15" fill="#241812"/>
   <g class="pl" style="transform-origin:20px 160px"><rect x="17" y="106" width="6" height="56" fill="#0d2422"/><circle cx="20" cy="98" r="22" fill="#1f6b52"/><circle cx="8" cy="112" r="13" fill="#1a5a46"/><circle cx="33" cy="110" r="13" fill="#25805f"/></g>
   <path d="M0 158h100" stroke="#5a4636" stroke-width="1.5"/>${[6,18,30,42,54,66,78,90].map(x=>`<rect x="${x}" y="150" width="3" height="18" fill="#6b5442"/>`).join('')}<path d="M0 160Q50 148 100 158V196H0z" fill="#153c37"/>`],
   [.14,`${ff(18,128,0,5)}${ff(44,150,1.2,6)}${ff(80,104,2,4.5)}${ff(34,92,.7,7)}${ff(88,150,3,5.5)}${ff(56,112,2.5,6.5)}${ff(10,170,1.8,5)}
   <path d="M0 196c4-14 6-24 8-30 1 8 3 18 2 30M12 196c2-10 6-20 9-24 0 8-2 16-2 24M76 196c3-12 8-20 11-24 0 8-3 16-3 24M88 196c1-10 4-18 7-22 0 9-1 16-1 22" fill="#0f2e25"/>
   <g class="pl" style="transform-origin:50px 196px;animation-delay:-1.5s"><path d="M50 196Q38 184 40 166Q50 174 50 196z" fill="#2f8f62"/><path d="M50 196Q62 184 60 166Q50 174 50 196z" fill="#3aa876"/><circle cx="40" cy="166" r="3.5" fill="#f4a6c2"/><circle cx="60" cy="166" r="3.5" fill="#ffd37a"/></g>`]]}),
 id=>({n:'Hải đăng',c:'#ffe9a0',
  w:['linear-gradient(90deg,#1c3a55,#0f2337)','linear-gradient(270deg,#1c3a55,#0f2337)','linear-gradient(#0a1430,#14284d)','linear-gradient(#0f3550,#1a4e6b)'],
  L:[[1,`<defs>${lg('a'+id,[[0,'#0a1432'],[.6,'#1f4a6b'],[1,'#3a7286']])}</defs><rect width="100" height="196" fill="url(#a${id})"/>${stars([[12,14,0],[34,32,1.1],[80,18,.4],[60,8,1.8],[88,50,2.2],[20,60,.7]])}<circle cx="22" cy="44" r="12" fill="#f1ead2" opacity=".12"/><circle cx="22" cy="44" r="6" fill="#f1ead2"/>
   <path d="M60 150q10-10 22-6t18 2v20H60z" fill="#183752"/>`],
   [.5,`<g class="bm" style="transform-origin:50px 86px"><path d="M50 86L104 64V108z" fill="#ffe9a0" opacity=".3"/><path d="M50 86L-4 64V108z" fill="#ffe9a0" opacity=".3"/></g>
   <path d="M14 196L30 158H70L86 196z" fill="#22333c"/><path d="M42 160L45 96H55L58 160z" fill="#f3efe6"/><path d="M43.4 128H56.6L57.3 140H42.7z" fill="#d9483b"/><path d="M44.5 104H55.5L56.1 115H43.9z" fill="#d9483b"/>
   <rect x="40.5" y="91" width="19" height="4" fill="#2a2f3a"/><rect class="fl" x="45" y="81" width="10" height="10" fill="#ffe28a"/><path d="M43 81L50 72L57 81z" fill="#d9483b"/>`],
   [.14,`<g class="bob"><path d="M66 166h18l-3 6H69z" fill="#8a5a3c"/><path d="M75 166v-14l7 12z" fill="#f3efe6"/><circle class="fl" cx="75" cy="151" r="1.4" fill="#ffd37a"/></g>
   <g class="wv"><path d="M-20 172q10-6 20 0t20 0 20 0 20 0 20 0 20 0 20 0 20 0V196H-20z" fill="#1c4b63" opacity=".95"/></g><g class="wv r"><path d="M-20 184q10-6 20 0t20 0 20 0 20 0 20 0 20 0 20 0 20 0V196H-20z" fill="#143a50"/></g>`]]})
 ];


 // Vỏ ngoài của nook: nhiều chất liệu (gạch, vữa, gỗ, đá, ván), đường khoét lởm chởm theo từng viên/ván, công tắc đèn ở chân.
 function shell(id,o){
  let sd=o.seed||11;const R=()=>(sd=sd*16807%2147483647)/2147483647;
  const H=7,hn=28,hl=[],hr=[],[a1,a2,b1,b2]=o.lim||[21,35,83,97];let xl=o.l0??28,xr=o.r0??90;
  for(let r=0;r<hn;r++){xl=Math.max(a1,Math.min(a2,xl+[-7,0,7][R()*3|0]));xr=Math.max(b1,Math.min(b2,xr+[-7,0,7][R()*3|0]));hl.push(xl);hr.push(xr)}
  const EL=[[hl[0],0]],ER=[[hr[hn-1],hn*H]];
  for(let r=0;r<hn;r++){EL.push([hl[r],(r+1)*H]);if(r+1<hn)EL.push([hl[r+1],(r+1)*H])}
  for(let r=hn-1;r>=0;r--){ER.push([hr[r],r*H]);if(r>0)ER.push([hr[r-1],r*H])}
  const pts=a=>a.map(p=>p.join(',')).join(' ');
  const poly=pts([[0,0],...EL,...ER,[118,0],[118,218],[0,218]]);
  const pal=['#a24a36','#b0553d','#9a4331','#bd6048','#8f3d2d','#a94f3b','#b8593f','#7f3626'];
  const pk=a=>a[R()*a.length|0];
  const MAT={
   brick:()=>{let s='';for(let r=0;r<32;r++){const y=r*H,q=(r%2)*7;for(let x=-q;x<118;x+=14)s+=`<rect x="${x+.5}" y="${y+.5}" width="13" height="6" fill="${pk(pal)}"/>`}return['#5b3f35',s]},
   // vữa vàng bong tróc, lộ gạch quanh mép khoét
   plaster:()=>{let s='';for(let k=0;k<30;k++)s+=`<rect x="${R()*108|0}" y="${R()*210|0}" width="${8+R()*16|0}" height="${3+R()*8|0}" fill="${R()<.5?'#c79c52':'#ecce8a'}" opacity=".5"/>`;
    for(let r=0;r<hn;r++){const y=r*H,q=(r%2)*7;for(const[x0,d]of[[hl[r],-1],[hr[r],1]])if(R()<.62){const m=1+(R()*2|0);for(let j=0;j<m;j++){const x=d<0?x0-14*(j+1)-q%7:x0+14*j+q%7;s+=`<rect x="${x+.5}" y="${y+.5}" width="13" height="6" fill="${pk(pal)}"/>`}}}
    s+=`<path d="M8 60l6 14-4 12 7 16M104 120l-6 12 5 14-6 12" stroke="#8a6230" stroke-width=".8" fill="none" opacity=".6"/>`;return['#dcb468',s]},
   // ván gỗ đứng, có thớ và đinh
   wood:()=>{let s='';const wp=['#6b4a33','#74513a','#5f4230','#7a5740'];
    for(let x=0;x<118;x+=7.4){s+=`<rect x="${x.toFixed(1)}" y="0" width="7.2" height="218" fill="${pk(wp)}"/>`;
     for(let g=0;g<5;g++)s+=`<rect x="${(x+1+R()*4).toFixed(1)}" y="${R()*200|0}" width=".7" height="${10+R()*30|0}" fill="#3a2618" opacity=".35"/>`;
     s+=`<circle cx="${(x+3.6).toFixed(1)}" cy="6" r=".9" fill="#2a1a10"/><circle cx="${(x+3.6).toFixed(1)}" cy="212" r=".9" fill="#2a1a10"/>`}return['#3a2a1e',s]},
   // khối đá xếp so le, rêu bám
   stone:()=>{let s='';const sp=o.moss?['#5f6f5c','#6a7a62','#56654f','#728068','#4f5e4a']:['#7d8089','#6f737c','#8a8d96','#656a75','#777b85'];
    for(let r=0;r<25;r++){const y=r*9,q=(r%2)*9;for(let x=-q;x<118;x+=18)s+=`<rect x="${x+.5}" y="${y+.5}" width="17" height="8" rx="1" fill="${pk(sp)}"/><rect x="${x+.5}" y="${y+.5}" width="17" height="1.2" fill="#fff" opacity=".12"/>`}
    for(let k=0;k<(o.moss?60:14);k++)s+=`<circle cx="${R()*118|0}" cy="${R()*218|0}" r="${1+R()*2.4}" fill="#5d8a4c" opacity=".55"/>`;return['#3c3f48',s]},
   // ván ngang quét sơn bạc màu, vệt gỉ
   board:()=>{let s='';const bp=['#e8e6df','#d9dbd6','#cfd6d9','#e2e0d6'];
    for(let y=0;y<218;y+=6)s+=`<rect x="0" y="${y}" width="118" height="5.4" fill="${bp[(y/6|0)%4]}"/><rect x="0" y="${y+5.4}" width=".." height=".6" fill="#6f7f88" opacity=".5"/>`.replace('width=".."','width="118"');
    for(let k=0;k<7;k++)s+=`<rect x="${R()*112|0}" y="${R()*170|0}" width="1.6" height="${20+R()*40|0}" fill="#a86a4a" opacity=".25"/>`;
    s+=`<rect y="180" width="118" height="10" fill="#3f6e8c" opacity=".55"/>`;return['#8a98a0',s]}};
  const[base,surf]=MAT[o.mat]();const g=o.glow||'#ffb870';
  const tabs=o.mat==='brick'||o.mat==='stone'?`<g fill="#7b5a40"><rect x="7" y="46" width="3" height="9"/><rect x="108" y="64" width="3" height="9"/><rect x="7" y="150" width="3" height="9"/><rect x="108" y="128" width="3" height="9"/></g>`:'';
  return `<svg class="nk-face" viewBox="0 0 118 218" aria-hidden="true"><defs><clipPath id="fc${id}"><polygon points="${poly}"/></clipPath>${rgw('sp'+id,g)}${lg('sh'+id,[[0,'#000',.35],[.35,'#000',0],[1,'#000',.25]])}</defs>
  <g clip-path="url(#fc${id})"><rect width="118" height="218" fill="${base}"/>${surf}<rect width="118" height="218" fill="url(#sh${id})"/><ellipse class="em" cx="59" cy="112" rx="66" ry="98" fill="url(#sp${id})" opacity=".6"/>
   <rect x="0" y="0" width="118" height="3" fill="#6e4d36"/><rect y="212" width="118" height="6" fill="#4a3224"/><rect y="196" width="118" height="2.4" fill="#2a120c" opacity=".55"/>${tabs}</g>
  <g fill="none" stroke-linejoin="miter"><polyline points="${pts(EL)}" stroke="#25100b" stroke-width="2.4" opacity=".75"/><polyline points="${pts(ER)}" stroke="#25100b" stroke-width="2.4" opacity=".75"/>
   <polyline class="em" points="${pts(EL)}" stroke="${g}" stroke-width=".9" opacity=".4" transform="translate(-1.7 0)"/><polyline class="em" points="${pts(ER)}" stroke="${g}" stroke-width=".9" opacity=".4" transform="translate(1.7 0)"/></g></svg>`}

 // Nook Phố cổ: con hẻm nhiều lớp phía sau vỏ gạch.
 const BRICK=id=>{
  const F="font-family=\"'Be Vietnam Pro',system-ui,sans-serif\" font-weight=\"700\" text-anchor=\"middle\"";
  const back=`<defs>${lg('a'+id,[[0,'#1b2044'],[.42,'#6a3f66'],[.78,'#e58f5a'],[1,'#f6c47c']])}${rgw('g'+id,'#ffc97a')}</defs><rect width="118" height="218" fill="url(#a${id})"/>${stars([[20,14,0],[46,26,1],[100,12,.5],[70,10,1.7],[30,40,2.2]])}
   <circle cx="90" cy="34" r="13" fill="#fff2cf" opacity=".14"/><circle cx="90" cy="34" r="6.5" fill="#fff2cf"/>
   <path d="M30 218V86h58v132z" fill="#dcab5c"/><path d="M26 86h66l-7-13H33z" fill="#7a3426"/><path d="M26 86h66v4H26z" fill="#4e2018"/>
   ${[36,53,70].map(x=>`<path class="wn" d="M${x} 120V104a6 6 0 0 1 12 0v16z" fill="#ffcf7a"/><rect x="${x-4.5}" y="102" width="3.5" height="18" fill="#2f5a48"/><rect x="${x+13}" y="102" width="3.5" height="18" fill="#2f5a48"/>`).join('')}
   <rect x="30" y="124" width="58" height="3" fill="#3a2a22"/>${Array.from({length:12},(_,k)=>`<rect x="${32+k*4.9}" y="127" width="1.2" height="7" fill="#3a2a22"/>`).join('')}
   ${[40,54,68].map(x=>`<path class="wn" d="M${x} 166V150a5 5 0 0 1 10 0v16z" fill="#ffcf7a"/>`).join('')}
   <path d="M49 218V190a10 10 0 0 1 20 0v28z" fill="#2c5a46"/><path class="wn" d="M53 218V193a6 6 0 0 1 12 0v25z" fill="#ffcf7a"/><ellipse class="em fl" cx="59" cy="206" rx="26" ry="14" fill="url(#g${id})"/>
   <rect y="60" width="118" height="158" fill="#4a3566" opacity=".26"/><path d="M0 218V200l26-6h66l26 6v18z" fill="#2f2822"/>`;
  const shops=`<defs>${lg('sl'+id,[[0,'#000',0],[1,'#000',.3]],'0 0 1 0')}${lg('sr'+id,[[0,'#000',.3],[1,'#000',0]],'0 0 1 0')}</defs>
   <path d="M0 40h42V218H0z" fill="#e0b160"/><path d="M-4 42L0 26h46l-4 16z" fill="#7a3426"/><rect y="40" width="42" height="178" fill="url(#sl${id})"/>
   <rect x="19" y="52" width="22" height="13" rx="1.5" fill="#b7352a"/><text x="30" y="61.6" font-size="7.6" fill="#ffe9b0" ${F}>PHỞ</text>
   <rect class="wn" x="9" y="92" width="17" height="26" fill="#ffcf7a"/><path d="M17.5 92v26M9 105h17" stroke="#6b3a22" stroke-width="1.2"/><rect x="3" y="92" width="5" height="26" fill="#2f5a48"/><rect x="27" y="92" width="5" height="26" fill="#2f5a48"/>
   <rect class="wn" x="9" y="142" width="17" height="24" fill="#ffcf7a"/><path d="M17.5 142v24M9 154h17" stroke="#6b3a22" stroke-width="1.2"/><rect x="3" y="142" width="5" height="24" fill="#2f5a48"/><rect x="27" y="142" width="5" height="24" fill="#2f5a48"/>
   <path d="M76 52h42V218H76z" fill="#c98a50"/><path d="M72 54L76 38h46v16z" fill="#6a2d22"/><rect x="76" y="52" width="42" height="166" fill="url(#sr${id})"/><rect x="0" y="26" width="118" height="192" fill="#4a3566" opacity=".1"/>
   <path d="M76 60h5M76 77h5" stroke="#1b1512" stroke-width="1.1"/><rect x="72" y="62" width="27" height="12" rx="1.5" fill="#27425f" stroke="#e8c15a" stroke-width=".6"/><text x="85.5" y="70.6" font-size="6" fill="#ffe9b0" ${F}>CÀ PHÊ</text>
   <path class="wn" d="M84 118V100a7 7 0 0 1 14 0v18z" fill="#ffcf7a"/><rect x="78" y="98" width="4.5" height="20" fill="#2f5a48"/><rect x="99" y="98" width="4.5" height="20" fill="#2f5a48"/>
   <rect x="78" y="122" width="30" height="3" fill="#3a2a22"/>${leaf(84,118,6,-20,'#3d7a45')}${leaf(92,117,6,20,'#4f9a58')}${leaf(100,118,6,-10,'#5aa864')}
   <path class="wn" d="M84 168V150a7 7 0 0 1 14 0v18z" fill="#ffcf7a"/><rect x="78" y="148" width="4.5" height="20" fill="#2f5a48"/><rect x="99" y="148" width="4.5" height="20" fill="#2f5a48"/>`;
  const mid=`${Array.from({length:9},(_,k)=>{const a=k*5.6,b=a+5.6,c=k%2?'#f1e3c0':'#c8412f';return `<path d="M${a} 126H${b}L${b} 144H${a}z" fill="${c}"/><circle cx="${a+2.8}" cy="144" r="2.8" fill="${c}"/>`}).join('')}<path d="M0 124h50v3H0z" fill="#7a2a20"/>
   <path d="M26 70v16M32 70v16" stroke="#3a2a22" stroke-width=".8"/><rect x="22" y="86" width="14" height="10" rx="1" fill="#6e4d36"/><text x="29" y="93.4" font-size="4.6" fill="#ffe9b0" ${F}>TRÀ</text>
   <rect x="86" y="96" width="5" height="26" fill="#2f5a48"/><path d="M82 138h8l-1 9h-6z" fill="#b5653f"/>${leaf(86,134,6,-25,'#3d7a45')}${leaf(90,133,6,25,'#4f9a58')}`;
  const over=`<defs>${rgw('h'+id,'#ffcf6e')}</defs><path d="M18 52Q59 80 100 52" stroke="#1a1210" stroke-width=".9" fill="none"/>${lan(34,63,5,'#e8434f',0,'h'+id)}${lan(59,69,5.5,'#ffb03a',1.2,'h'+id)}${lan(84,63,5,'#e8434f',2.1,'h'+id)}
   <path d="M0 30Q40 46 118 26M0 40Q50 58 118 38" stroke="#1a1210" stroke-width=".7" fill="none"/>`;
  const near=`<defs>${rgw('k'+id,'#ffc46b')}</defs>
   <rect x="20" y="16" width="38" height="12" rx="1.5" fill="#1f4e8c" stroke="#e9eef5" stroke-width="1"/><text x="39" y="24.4" font-size="4.8" fill="#fff" ${F}>PHỐ HÀNG MÃ</text>
   <path d="M118 40C100 40 90 36 82 30" stroke="#1b1512" stroke-width="2.2" fill="none"/><path d="M66 24h14l-2 14H68z" fill="#2a2420"/><rect class="wn" x="68.5" y="26" width="9" height="10" fill="#ffd98a"/><path d="M64 24l9-8 9 8z" fill="#1b1512"/><circle class="em fl" cx="73" cy="31" r="26" fill="url(#k${id})"/>
   <g class="pl" style="transform-origin:42px 194px">${leaf(37,176,11,-25,'#3d7a45')}${leaf(48,175,11,25,'#4f9a58')}${leaf(43,168,10,0,'#5aa864')}</g><path d="M34 194l2-14h14l2 14z" fill="#b5653f"/>
   <rect x="64" y="172" width="16" height="3" rx="1" fill="#8a5d3a"/><path d="M66 175l-2 20M78 175l2 20" stroke="#6e4d36" stroke-width="2"/>${steam(70,168,0)}${steam(74,168,1.2)}<path d="M66 172h12l-1.6 -6h-8.8z" fill="#f4ecdc"/>`;
  const cobble="radial-gradient(ellipse 5.5px 3.5px at 50% 50%,#9a9186 0 90%,transparent 100%) 0 0/14px 9px,radial-gradient(ellipse 5.5px 3.5px at 50% 50%,#8a8176 0 90%,transparent 100%) 7px 4.5px/14px 9px,#2e2823";
  return {n:'Phố cổ',c:'#ffb870',vb:'0 0 118 218',clipH:218,par:'slice',bias:-34,shell:{mat:'brick',glow:'#ffb870'},
   w:['linear-gradient(90deg,#e0b160,#8a5a30)','linear-gradient(270deg,#c98a50,#7a4a28)','#1d1a2e',cobble],
   L:[[1,back],[.72,shops],[.5,mid],[.28,over],[.1,near]]}};

 // Lớp thêm cho 5 nook cũ để có chiều sâu như nook Phố cổ: vật khung hai bên (gần), sương mờ xen giữa các lớp, vật phía trước.
 const hz=(id,col,o)=>`<defs>${lg('z'+id,[[0,col,o*.25],[.5,col,o*.6],[1,col,o]])}</defs><rect width="100" height="196" fill="url(#z${id})"/>`;
 const EXTRA=[
 id=>[[.86,hz(id,'#3a2a55',.3)],
  [.74,`<path d="M0 62h21v134H0z" fill="#b8843f"/><path d="M-3 64l3-15h25l-4 15z" fill="#5a2a1e"/><rect x="0" y="62" width="21" height="134" fill="#000" opacity=".16"/><path class="wn" d="M5 96V86a5 5 0 0 1 10 0v10z" fill="#ffd27a"/><path class="wn" d="M5 140v-10a5 5 0 0 1 10 0v10z" fill="#ffd27a"/><rect x="2" y="84" width="3" height="14" fill="#2f5a48"/><rect x="15" y="84" width="3" height="14" fill="#2f5a48"/>
   <path d="M79 80h21v116H79z" fill="#a87238"/><path d="M76 82l3-13h24v13z" fill="#5a2a1e"/><rect x="79" y="80" width="21" height="116" fill="#000" opacity=".16"/><path class="wn" d="M85 112v-10a5 5 0 0 1 10 0v10z" fill="#ffd27a"/><rect x="83" y="100" width="3" height="14" fill="#2f5a48"/><rect x="95" y="100" width="3" height="14" fill="#2f5a48"/>`],
  [.34,`<path d="M0 18Q22 34 44 20" stroke="#1a1210" stroke-width=".8" fill="none"/>${[6,18,30].map((x,k)=>`<path d="M${x} ${24+k*3}l3 8h-6z" fill="${k%2?'#f1e3c0':'#c8412f'}"/>`).join('')}`]],
 id=>[[.86,hz(id,'#2b1c14',.32)],
  [.74,`<rect x="0" y="34" width="19" height="128" fill="#4a2f1f"/><rect x="19" y="34" width="2" height="128" fill="#2c1a10"/>${[0,1,2,3].map(r=>{let s=`<rect x="0" y="${58+r*26}" width="21" height="3" fill="#2c1a10"/>`;let x=1;const cs=['#c2553f','#e8c15a','#3f6ea8','#7fa37a','#e8a7c0','#8b1e2b'];for(let k=0;x<18;k++){const w=2.2+((k*7+r*3)%3);s+=`<rect x="${x}" y="${58+r*26-17-(k%3)*2}" width="${w}" height="${17+(k%3)*2}" fill="${cs[(k+r)%6]}"/>`;x+=w+.4}return s}).join('')}
   <path d="M88 0v26M96 0v20" stroke="#1a110c" stroke-width=".8"/><path d="M84 26h18l-3 14H87z" fill="#b5653f"/><g class="pl" style="transform-origin:93px 26px">${leaf(86,44,8,-20,'#2f6b45')}${leaf(94,50,10,5,'#3d8455')}${leaf(100,42,8,25,'#4f9a62')}${leaf(90,60,7,-10,'#2f6b45')}</g>`],
  [.3,`<defs>${rgw('lp'+id,'#ffc46b')}</defs><circle class="fl" cx="8" cy="170" r="22" fill="url(#lp${id})"/><path d="M0 196v-22h20v22z" fill="#3a2418"/><rect x="0" y="172" width="22" height="4" rx="1" fill="#8a5d3a"/>`]],
 id=>[[.86,hz(id,'#557590',.34)],
  [.74,`<rect x="0" y="0" width="100" height="9" fill="#242a38"/><rect x="0" y="9" width="100" height="2" fill="#000" opacity=".3"/>${Array.from({length:7},(_,k)=>`<circle cx="${8+k*14}" cy="4.5" r="1.1" fill="#4a5266"/>`).join('')}
   <rect x="0" y="0" width="9" height="196" fill="#2a2f3d"/><rect x="8" y="0" width="1.4" height="196" fill="#4a5266"/><rect x="91" y="0" width="9" height="196" fill="#2a2f3d"/><rect x="91" y="0" width="1.4" height="196" fill="#4a5266"/>
   <path d="M9 0l12 14M91 0L79 14" stroke="#2a2f3d" stroke-width="2.5"/>`],
  [.3,`<rect x="12" y="166" width="38" height="4" rx="1" fill="#6b4a33"/><rect x="12" y="156" width="38" height="3" rx="1" fill="#7a553a"/><path d="M15 170v22M47 170v22M15 156v10M47 156v10" stroke="#3a2a22" stroke-width="2.4"/><rect x="62" y="176" width="26" height="3" rx="1" fill="#e8c15a" opacity=".75"/>`]],
 id=>[[.86,hz(id,'#1f6b52',.26)],
  [.74,`<path d="M0 196V14q9 6 7 38t4 144z" fill="#0b211c"/><circle cx="2" cy="30" r="18" fill="#12392f"/><circle cx="14" cy="14" r="12" fill="#0f3028"/><circle cx="4" cy="62" r="11" fill="#12392f"/>
   <path d="M100 196V6q-9 8-7 40t-4 150z" fill="#0b211c"/><circle cx="98" cy="22" r="19" fill="#12392f"/><circle cx="86" cy="8" r="12" fill="#0f3028"/><circle cx="96" cy="58" r="11" fill="#12392f"/>
   <path d="M14 28q3 22 0 40M22 14q2 18-1 30M84 24q-3 24 0 44M76 10q-2 18 1 32" stroke="#1c6a4a" stroke-width="1.1" fill="none"/>`],
  [.34,`<defs>${rgw('mz'+id,'#bfe8cf')}</defs><ellipse cx="50" cy="186" rx="46" ry="9" fill="url(#mz${id})" opacity=".5"/>`]],
 id=>[[.86,hz(id,'#3a7286',.3)],
  [.74,`<path d="M0 196V128q13-12 23 3t13 17l8 48z" fill="#0f2233"/><path d="M0 150q10-6 18 4" stroke="#1d3a52" stroke-width="1.4" fill="none"/><path d="M100 196V142q-10-8-19 6t-12 14l-7 34z" fill="#0f2233"/><path d="M100 160q-8-5-14 3" stroke="#1d3a52" stroke-width="1.4" fill="none"/>`],
  [.4,`<ellipse cx="26" cy="26" rx="28" ry="5" fill="#9db6c8" opacity=".13"/><ellipse cx="78" cy="48" rx="24" ry="4" fill="#9db6c8" opacity=".1"/>`],
  [.3,`<g class="bob"><path d="M8 162q5-6 10 0M18 158q4-5 8 0" stroke="#e9eef5" stroke-width="1.2" fill="none" stroke-linecap="round"/></g>`]]
 ];
 SC.unshift(BRICK);
 // 5 nook cũ dùng chung kiểu vỏ + công tắc, mỗi nook một chất liệu hợp cảnh.
 const W0={l0:20,r0:98,lim:[14,28,90,104]};
 const SHELLS={1:{...W0,mat:'plaster',glow:'#ffb35a',seed:5},2:{...W0,mat:'wood',glow:'#ffc46b',seed:8},3:{...W0,mat:'stone',glow:'#ffd98a',seed:13},4:{...W0,mat:'stone',moss:1,glow:'#d8ff8a',seed:17},5:{...W0,mat:'board',glow:'#ffe9a0',seed:21}};
 SC.forEach((f,k)=>{if(k)SC[k]=id=>{const s=f(id);s.L=s.L.concat(EXTRA[k-1](id));return Object.assign(s,{shell:SHELLS[k],clipH:196,par:'meet',bias:-24})}});

 function nook(k){const id='n'+(++u),s=SC[k%SC.length](id),d=70,vb=s.vb||'0 0 100 196',par=s.par==='meet'?'xMidYMid meet':'xMidYMid slice';
  const box=`<div class="nk-box" style="--d:${d}px"><i class="w wl" style="background:${s.w[0]}"></i><i class="w wr" style="background:${s.w[1]}"></i><i class="w wt" style="background:${s.w[2]}"></i><i class="w wb" style="background:${s.w[3]}"></i>
  ${s.L.map(([z,b])=>`<div class="ly" style="transform:translateZ(${-Math.round(z*d)}px)"><svg viewBox="${vb}" preserveAspectRatio="${par}">${b}</svg></div>`).join('')}<i class="glass"></i></div>`;
  return `<div class="nk-frame brick"><div class="nk-clip" style="height:${s.clipH||218}px" data-bias="${s.bias??-24}">${box}</div>${shell(id,s.shell)}<button class="nk-sw" type="button" aria-label="Tắt đèn nook ${s.n}" aria-pressed="true"></button></div><i class="nk-glow" style="--gc:${s.c}"></i>`}

 return {nook,count:SC.length};
})();
