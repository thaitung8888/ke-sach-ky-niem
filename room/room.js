// Khu vực CĂN PHÒNG (sảnh chính, #/phong). Phong cách Japandi: kem ấm, gỗ sồi sáng, kim loại đen mờ.
// Cả phòng vẽ bằng SVG theo MỘT điểm tụ (VP) nên mọi món đồ có độ dày, mặt bên, bóng khớp nhau.
// Thêm món đồ mới: viết một hàm vẽ trả về SVG rồi thêm vào OBJS (id, tên, hàm vẽ, open).
const ROOM_NAME='Căn phòng của Thái';
// Nguồn sáng (đèn, màn hình, LED) được vẽ lại phía trên lớp tối ban đêm để trông như đang phát sáng.
let EM=[];
const VP={x:800,y:390},WALL={l:260,r:1340,t:90,b:650};   // khung 1600×900, tường sau và điểm tụ (tầm mắt)

// ---------- hình học phối cảnh ----------
const toVP=(p,k)=>[VP.x+(p[0]-VP.x)*k,VP.y+(p[1]-VP.y)*k];      // lùi về phía điểm tụ (xa hơn)
const fromVP=(p,k)=>[VP.x+(p[0]-VP.x)/k,VP.y+(p[1]-VP.y)/k];    // tiến ra phía người xem (gần hơn)
const pts=a=>a.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
const poly=(a,f,x='')=>`<polygon points="${pts(a)}" fill="${f}" ${x}/>`;
// Khối hộp áp vào tường: (x,y,w,h) là mặt sau chạm tường, k<1 là độ nhô ra (nhỏ = nhô nhiều). c: màu các mặt.
function box(x,y,w,h,k,c,front=''){const B=[[x,y],[x+w,y],[x+w,y+h],[x,y+h]],F=B.map(p=>fromVP(p,k));
 return poly([B[0],B[1],F[1],F[0]],c.t)+poly([F[3],F[2],B[2],B[3]],c.b)+poly([B[0],F[0],F[3],B[3]],c.l)+poly([F[1],B[1],B[2],F[2]],c.r)+
  poly(F,c.f)+`<polyline points="${pts([F[3],F[0],F[1]])}" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.2"/><polyline points="${pts([F[1],F[2],F[3]])}" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="1.2"/>`+front}
// Hộc lõm vào tường (x,y,w,h là miệng hộc), k là độ sâu.
function recess(id,x,y,w,h,k,c,inside=''){const A=[[x,y],[x+w,y],[x+w,y+h],[x,y+h]],b=A.map(p=>toVP(p,k));
 return `<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs><g clip-path="url(#${id})">${poly(b,c.back)}${poly([A[0],A[1],b[1],b[0]],c.t)}${poly([A[3],A[2],b[2],b[3]],c.b)}${poly([A[0],b[0],b[3],A[3]],c.l)}${poly([A[1],A[2],b[2],b[1]],c.r)}${inside}</g>`}
const floorAt=k=>VP.y+(WALL.b-VP.y)/k;        // cao độ sàn ở độ nhô k
const lp=(f,v)=>{const x=WALL.l-WALL.l*f,t=WALL.t-WALL.t*f,b=WALL.b+(900-WALL.b)*f;return [x,t+(b-t)*v]};  // điểm trên tường trái
const blurSh=(d,o,f='sh2')=>`<path d="${d}" fill="#3a2a1c" style="opacity:${o}" filter="url(#${f})"/>`;

// ---------- phòng: trần, tường, sàn, cửa sổ ----------
function shell(){
 const win=[lp(.2,.15),lp(.74,.12),lp(.74,.66),lp(.2,.63)],mid=[lp(.47,.135),lp(.47,.645)];
 const f=(900-VP.y)/(WALL.b-VP.y),X=x=>VP.x+(x-VP.x)*f;
 let planks='',seams='';for(let k=-22;k<=22;k++){const x0=800+k*50,x1=x0+50,q=[[x0,WALL.b],[x1,WALL.b],[X(x1),900],[X(x0),900]];
  if(k%3===0)planks+=poly(q,'#b98d5c','opacity=".07"');if((k+40)%4===1)planks+=poly(q,'#fff','opacity=".06"');
  seams+=`<line x1="${x0}" y1="${WALL.b}" x2="${X(x0).toFixed(0)}" y2="900"/>`}
 let joints='';[662,679,702,733,775,830,895].forEach((y,j)=>{const s=(y-VP.y)/(WALL.b-VP.y);for(let k=-22;k<=22;k+=3){const x=VP.x+(800+(k+j%3)*50-VP.x)*s;joints+=`<line x1="${x.toFixed(0)}" y1="${y}" x2="${x.toFixed(0)}" y2="${(y+5*s).toFixed(0)}"/>`}});
 return `<defs>
  <linearGradient id="gBack" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f6f0e6"/><stop offset=".45" stop-color="#efe8dc"/><stop offset="1" stop-color="#e6ddcf"/></linearGradient>
  <linearGradient id="gLeft" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d9cfbf"/><stop offset="1" stop-color="#e6ddd0"/></linearGradient>
  <linearGradient id="gRight" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#e3d9ca"/><stop offset="1" stop-color="#efe7da"/></linearGradient>
  <linearGradient id="gCeil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ece6dc"/><stop offset="1" stop-color="#f7f3ec"/></linearGradient>
  <linearGradient id="gFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d2b28a"/><stop offset=".5" stop-color="#d9bb93"/><stop offset="1" stop-color="#cba57a"/></linearGradient>
  <linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--sky1)"/><stop offset="1" stop-color="var(--sky2)"/></linearGradient>
  <linearGradient id="aoV" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5a4330" stop-opacity=".16"/><stop offset="1" stop-color="#5a4330" stop-opacity="0"/></linearGradient>
  <linearGradient id="aoV2" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#5a4330" stop-opacity=".16"/><stop offset="1" stop-color="#5a4330" stop-opacity="0"/></linearGradient>
  <linearGradient id="aoH" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a4330" stop-opacity=".13"/><stop offset="1" stop-color="#5a4330" stop-opacity="0"/></linearGradient>
  <linearGradient id="gBeam" x1="0" y1="0" x2="1" y2=".6"><stop offset="0" stop-color="#fff3d6" stop-opacity=".75"/><stop offset="1" stop-color="#fff3d6" stop-opacity="0"/></linearGradient>
  <radialGradient id="gPool"><stop offset="0" stop-color="#ffd85a" stop-opacity=".95"/><stop offset=".4" stop-color="#ffc700" stop-opacity=".42"/><stop offset="1" stop-color="#ffc700" stop-opacity="0"/></radialGradient>
  <radialGradient id="gCrt"><stop offset="0" stop-color="#9a8cff" stop-opacity=".7"/><stop offset="1" stop-color="#9a8cff" stop-opacity="0"/></radialGradient>
  <radialGradient id="gMoon"><stop offset="0" stop-color="#9a8cff" stop-opacity=".5"/><stop offset="1" stop-color="#9a8cff" stop-opacity="0"/></radialGradient>
  <filter id="neonGlow" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b1"/><feGaussianBlur in="SourceGraphic" stdDeviation="14" result="b2"/><feMerge><feMergeNode in="b2"/><feMergeNode in="b1"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="sh1" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4"/></filter>
  <filter id="sh2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="10"/></filter>
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 .35 0 0 0 0 .27 0 0 0 0 .2 0 0 0 .07 0"/></filter>
 </defs>
 ${poly([[0,0],[1600,0],[WALL.r,WALL.t],[WALL.l,WALL.t]],'url(#gCeil)')}
 ${poly([[0,0],[WALL.l,WALL.t],[WALL.l,WALL.b],[0,900]],'url(#gLeft)')}
 ${poly([[1600,0],[WALL.r,WALL.t],[WALL.r,WALL.b],[1600,900]],'url(#gRight)')}
 <rect x="${WALL.l}" y="${WALL.t}" width="${WALL.r-WALL.l}" height="${WALL.b-WALL.t}" fill="url(#gBack)"/>
 <rect x="${WALL.l}" y="${WALL.t}" width="${WALL.r-WALL.l}" height="${WALL.b-WALL.t}" filter="url(#grain)" opacity=".8"/>
 <!-- bóng góc tường (ambient occlusion) -->
 <rect x="${WALL.l}" y="${WALL.t}" width="70" height="${WALL.b-WALL.t}" fill="url(#aoV)"/><rect x="${WALL.r-70}" y="${WALL.t}" width="70" height="${WALL.b-WALL.t}" fill="url(#aoV2)"/>
 <rect x="${WALL.l}" y="${WALL.t}" width="${WALL.r-WALL.l}" height="46" fill="url(#aoH)"/>
 ${poly([[0,0],[WALL.l,WALL.t],[WALL.r,WALL.t],[1600,0],[1600,10],[WALL.r,WALL.t+5],[WALL.l,WALL.t+5],[0,10]],'#5a4330','opacity=".06"')}
 <line x1="${WALL.l}" y1="${WALL.t}" x2="${WALL.l}" y2="${WALL.b}" stroke="#bfb2a0" stroke-width="1.2" opacity=".7"/><line x1="${WALL.r}" y1="${WALL.t}" x2="${WALL.r}" y2="${WALL.b}" stroke="#bfb2a0" stroke-width="1.2" opacity=".7"/>
 <!-- cửa sổ trên tường trái: ô kính, khung gỗ sồi, bệ cửa -->
 ${poly([lp(.19,.135),lp(.75,.105),lp(.75,.675),lp(.19,.645)],'#cfc3b1')}
 ${poly(win,'url(#gSky)')}
 <g class="rnight">${[[.33,.24],[.6,.2],[.42,.36],[.66,.33],[.3,.45]].map(([a,v],k)=>{const p=lp(a,v);return `<circle class="tw" cx="${p[0].toFixed(0)}" cy="${p[1].toFixed(0)}" r="${k%2?1.3:2}" fill="#fff"/>`}).join('')}${(()=>{const p=lp(.58,.26);return `<circle cx="${p[0]}" cy="${p[1]}" r="11" fill="#fff6dc"/>`})()}</g>
 ${poly([lp(.2,.63),lp(.32,.47),lp(.43,.52),lp(.55,.42),lp(.66,.5),lp(.74,.45),lp(.74,.66)],'var(--hill)')}
 ${poly([lp(.2,.63),lp(.28,.56),lp(.4,.6),lp(.52,.53),lp(.74,.6),lp(.74,.66)],'var(--hill2)')}
 <polygon points="${pts(win)}" fill="url(#gBeam)" opacity=".25"/>
 <polyline points="${pts(mid)}" stroke="#c9ab80" stroke-width="7" fill="none"/>${(()=>{const a=lp(.2,.4),b=lp(.74,.39);return `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#c9ab80" stroke-width="5"/>`})()}
 <polygon points="${pts(win)}" fill="none" stroke="#d6bb92" stroke-width="10" stroke-linejoin="round"/>
 <polygon points="${pts(win)}" fill="none" stroke="#b69465" stroke-width="2" stroke-linejoin="round"/>
 ${poly([lp(.17,.63),lp(.77,.66),lp(.79,.69),lp(.15,.655)],'#e0c9a6')}${poly([lp(.15,.655),lp(.79,.69),lp(.79,.7),lp(.15,.665)],'#b99a70')}
 <!-- rèm vải lanh bên cạnh cửa sổ -->
 <g class="curtain">${poly([lp(.77,.08),lp(.92,.06),lp(.93,.95),lp(.78,.96)],'#f3ece0','opacity=".92"')}${[.8,.84,.88].map(a=>{const p=lp(a,.075),q=lp(a+.005,.955);return `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="#d8ccb8" stroke-width="3" opacity=".7"/>`}).join('')}</g>
 ${(()=>{const a=lp(.15,.07),b=lp(.95,.05);return `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#2a2725" stroke-width="3"/>`})()}
 <!-- sàn gỗ sồi: ván hội tụ về điểm tụ, đầu ván so le -->
 ${poly([[WALL.l,WALL.b],[WALL.r,WALL.b],[1600,900],[0,900]],'url(#gFloor)')}
 ${planks}<g stroke="#9c774c" stroke-width="1.1" opacity=".42">${seams}${joints}</g>
 ${poly([[WALL.l,WALL.b],[WALL.r,WALL.b],[1600,900],[0,900]],'url(#aoH)','opacity=".7"')}
 <!-- len chân tường -->
 <rect x="${WALL.l}" y="${WALL.b-12}" width="${WALL.r-WALL.l}" height="12" fill="#f6f1e8"/><rect x="${WALL.l}" y="${WALL.b-12}" width="${WALL.r-WALL.l}" height="1.5" fill="#fff"/>
 ${poly([[WALL.l,WALL.b-12],[0,900-46],[0,900],[WALL.l,WALL.b]],'#ece5d9')}${poly([[WALL.r,WALL.b-12],[1600,900-46],[1600,900],[WALL.r,WALL.b]],'#f3ede3')}
 <rect x="${WALL.l}" y="${WALL.b}" width="${WALL.r-WALL.l}" height="5" fill="#5a4330" opacity=".12" filter="url(#sh1)"/>
 <!-- đèn âm trần -->
 ${[[560,48],[1040,48]].map(([x,y])=>(EM.push(`<ellipse class="embulb" cx="${x}" cy="${y}" rx="9" ry="2.6"/><path class="embeam" d="M${x-9} ${y}L${x-110} ${y+260}H${x+110}L${x+9} ${y}z"/>`),`<ellipse cx="${x}" cy="${y}" rx="15" ry="4.2" fill="#d9d1c4"/><ellipse cx="${x}" cy="${y}" rx="9" ry="2.6" class="rbulb"/>`)).join('')}`}

// Vệt nắng từ cửa sổ hắt chéo lên tường sau và sàn (ban ngày), kèm hạt bụi lơ lửng.
function sunlight(){const pane=o=>`<polygon points="${pts(o)}"/>`;
 return `<g class="rsun" style="mix-blend-mode:screen">
  <polygon points="${pts([lp(.2,.15),lp(.74,.12),[700,830],[300,900]])}" fill="url(#gBeam)" opacity=".18"/>
  <g fill="#fff4d8" opacity=".55" filter="url(#sh1)">${pane([[268,196],[402,226],[402,486],[268,470]])}${pane([[412,228],[520,252],[520,500],[412,488]])}</g>
  <g fill="#fff4d8" opacity=".5" filter="url(#sh1)">${pane([[300,668],[520,660],[690,790],[380,822]])}${pane([[530,659],[660,654],[860,770],[700,788]])}</g>
  ${Array.from({length:14},(_,k)=>{const x=300+((k*97)%380),y=260+((k*61)%420);return `<circle class="mote" cx="${x}" cy="${y}" r="${1+(k%3)*.6}" fill="#fff" style="animation-delay:-${(k*.7).toFixed(1)}s;animation-duration:${6+k%5}s"/>`}).join('')}
 </g>`}

// ---------- các món đồ ----------
// Kệ sách module gỗ sồi có LED, sách là màu thật từ dữ liệu.
function bookcaseArt(){const x=640,y=118,w=320,k=.93,ins=16;
 const fo=fromVP([x,y],k),fw=fromVP([x+w,WALL.b],k);
 const X0=fo[0]+ins,X1=fw[0]-ins,Y0=fo[1]+ins,Y1=fw[1]-26,rows=4,rh=(Y1-Y0)/rows,bt=10;
 const L=[...books].sort((a,b)=>hue(a.c)-hue(b.c)),per=Math.ceil(L.length/4);let bi=0,inner='';
 const b0=toVP([X0,Y0],k),b1=toVP([X1,Y0],k),b2=toVP([X1,Y1],k),b3=toVP([X0,Y1],k);
 inner+=poly([b0,b1,b2,b3],'#e4dccf')+poly([[X0,Y0],b0,b3,[X0,Y1]],'#d8ccb9')+poly([[X1,Y0],[X1,Y1],b2,b1],'#d3c6b2')+poly([[X0,Y0],[X1,Y0],b1,b0],'#cdbfa9');
 for(let r=0;r<rows;r++){const sy=Y0+(r+1)*rh-bt,sb=toVP([X0,sy],k)[1];
  const by=sy-(sy-sb)*.35,maxH=rh-bt-14,deco=r===1?'vase':r===3?'stack':null,room=deco?66:0,cap=(X1-X0)-24-room;let u=0,row='';
  const start=X0+10+(deco&&r%2?room:0),end=Math.min(L.length,(r+1)*per);
  while(bi<end){const b=L[bi],bw=Math.max(10,b.t*.34);if(u+bw>cap)break;const bhh=Math.min(maxH,bh(b)*.52),bx=start+u;
   row+=`<rect x="${bx.toFixed(1)}" y="${(by-bhh).toFixed(1)}" width="${bw.toFixed(1)}" height="${bhh.toFixed(1)}" fill="${b.c}"/><rect x="${bx.toFixed(1)}" y="${(by-bhh).toFixed(1)}" width="1.6" height="${bhh.toFixed(1)}" fill="#fff" opacity=".28"/><rect x="${(bx+bw-1.4).toFixed(1)}" y="${(by-bhh).toFixed(1)}" width="1.4" height="${bhh.toFixed(1)}" fill="#000" opacity=".18"/><rect x="${bx.toFixed(1)}" y="${(by-bhh*.84).toFixed(1)}" width="${bw.toFixed(1)}" height="1.4" fill="#fff" opacity=".22"/>`;u+=bw+1.2;bi++}
  if(!books.length&&r===1)row+=`<text x="${(X0+X1)/2}" y="${by-30}" text-anchor="middle" font-size="13" fill="#a08c70" font-family="Be Vietnam Pro,system-ui">kệ còn trống</text>`;
  const dx=r%2?X0+12:X1-62;
  if(deco==='vase')row+=`<ellipse cx="${dx+24}" cy="${by-1}" rx="17" ry="3" fill="#000" opacity=".12"/><path d="M${dx+12} ${by}c-6-14 0-30 6-36v-8h12v8c6 6 12 22 6 36z" fill="#e9e1d3"/><path d="M${dx+30} ${by}c4-12 2-26-4-34" stroke="#cfc4b2" stroke-width="3" fill="none"/><path d="M${dx+24} ${by-44}c-2-18-14-26-20-30M${dx+24} ${by-44}c4-16 12-22 22-24M${dx+24} ${by-44}c0-14 2-22 0-34" stroke="#7a6a4f" stroke-width="1.6" fill="none"/>`;
  if(deco==='stack')row+=`<ellipse cx="${dx+26}" cy="${by-1}" rx="30" ry="3" fill="#000" opacity=".12"/><rect x="${dx}" y="${by-9}" width="52" height="9" fill="#c4a484"/><rect x="${dx+4}" y="${by-17}" width="46" height="8" fill="#3f6ea8"/><rect x="${dx+2}" y="${by-24}" width="48" height="7" fill="#e9e1d3"/><circle cx="${dx+28}" cy="${by-34}" r="10" fill="#d9c4a0"/><path d="M${dx+20} ${by-34}h16" stroke="#b3956a" stroke-width="1.5"/>`;
  inner+=row;
  // ván kệ: mặt trên (dưới tầm mắt) hoặc mặt dưới (trên tầm mắt) + dải LED
  const bb=toVP([X0,sy],k),bc=toVP([X1,sy],k),ub=toVP([X0,sy+bt],k),uc=toVP([X1,sy+bt],k);
  if(sy>VP.y)inner+=poly([[X0,sy],[X1,sy],bc,bb],'#e3cba6');
  if(sy+bt<VP.y)inner+=poly([[X0,sy+bt],[X1,sy+bt],uc,ub],'#bfa27a');
  inner+=`<rect x="${X0}" y="${sy}" width="${X1-X0}" height="${bt}" fill="#d6b88d"/><rect x="${X0}" y="${sy}" width="${X1-X0}" height="1.3" fill="#fff" opacity=".5"/>`;
  if(r<rows-1)EM.push(`<rect class="emled" x="${X0+6}" y="${sy+bt}" width="${X1-X0-12}" height="2.4" rx="1.2"/><ellipse class="empool" cx="${(X0+X1)/2}" cy="${sy+bt+40}" rx="${(X1-X0)/2-8}" ry="44"/>`);
  if(r<rows-1)inner+=`<rect class="led" x="${X0+6}" y="${sy+bt}" width="${X1-X0-12}" height="2.4" rx="1.2"/><ellipse class="ledg" cx="${(X0+X1)/2}" cy="${sy+bt+32}" rx="${(X1-X0)/2}" ry="36"/>`}
 return `${blurSh(`M${x+w-6} ${y+20}L${x+w+52} ${y+44}L${x+w+52} ${WALL.b}L${x+w-6} ${WALL.b}z`,'calc(var(--sun)*.22)')}
  <path d="M${fo[0]-6} ${fw[1]}L${fw[0]+6} ${fw[1]}L${x+w+6} ${WALL.b}L${x-6} ${WALL.b}z" fill="#3a2a1c" opacity=".35" filter="url(#sh1)"/>
  <ellipse cx="${(fo[0]+fw[0])/2}" cy="${fw[1]+4}" rx="${(fw[0]-fo[0])/2+20}" ry="9" fill="#3a2a1c" opacity=".22" filter="url(#sh2)"/>
  ${box(x,y,w,WALL.b-y,k,{f:'#e1c8a2',t:'#cdb08a',b:'#b99a72',l:'#d8bd96',r:'#c8a97f'})}
  <rect x="${X0-2}" y="${Y0-2}" width="${X1-X0+4}" height="${Y1-Y0+4}" fill="#b99a72"/>${inner}
  <rect x="${fo[0]}" y="${fw[1]-24}" width="${fw[0]-fo[0]}" height="24" fill="#d9bf98"/><rect x="${fo[0]}" y="${fw[1]-24}" width="${fw[0]-fo[0]}" height="1.4" fill="#fff" opacity=".5"/>
  <rect x="${fo[0]+18}" y="${fw[1]-16}" width="${fw[0]-fo[0]-36}" height="2" rx="1" fill="#b99a72"/>`}

// Bàn làm việc kiểu văn phòng cũ (như ảnh tham khảo): mặt bàn đen, chân thép, tủ ngăn kéo, máy tính CRT, ghế da.
function deskArt(){const k=.84,x=300,w=330,top=520,th=14,F=p=>fromVP(p,k),fA=F([x,top]),fB=F([x+w,top]),fy=floorAt(k);
 const legB=px=>`<rect x="${px-4}" y="${top+th}" width="7" height="${WALL.b-top-th}" fill="#7d8187"/>`;
 const legF=px=>{const p=F([px,top+th]);return `<rect x="${p[0]-4}" y="${p[1]}" width="9" height="${fy-p[1]}" fill="#9aa0a6"/><rect x="${p[0]-4}" y="${p[1]}" width="2.5" height="${fy-p[1]}" fill="#fff" opacity=".35"/>`};
 const dx=x+w-128,dr=box(dx,top+th,118,64,k,{f:'#e4e3df',t:'#d0cfca',b:'#bdbcb6',l:'#cfcec9',r:'#c6c5bf'}),dF=F([dx,top+th]),dW=F([dx+118,top+th+64]);
 const handles=[0,1].map(i=>{const yy=dF[1]+i*(dW[1]-dF[1])/2;return `${i?`<rect x="${dF[0]}" y="${yy}" width="${dW[0]-dF[0]}" height="1.2" fill="#b8b7b1"/>`:''}<rect x="${(dF[0]+dW[0])/2-16}" y="${yy+(dW[1]-dF[1])/4-2}" width="32" height="4" rx="2" fill="#3b3a38"/>`}).join('');
 // máy tính: thùng máy nằm, màn hình CRT, bàn phím, chuột
 const cx=360,caseB=box(cx,494,140,24,.95,{f:'#e2dccf',t:'#efeadf',b:'#c9c2b3',l:'#d7d0c2',r:'#cfc7b8'});
 const crt=box(cx+14,400,112,94,.9,{f:'#ebe6db',t:'#f4f0e7',b:'#cfc8ba',l:'#ddd6c8',r:'#d6cfc0'});
 const sc=fromVP([cx+14,400],.9),scW=fromVP([cx+126,494],.9),sw=scW[0]-sc[0],shh=scW[1]-sc[1];
 const screen=`<rect x="${sc[0]+11}" y="${sc[1]+10}" width="${sw-22}" height="${shh-30}" rx="8" fill="#b9b2a3"/><rect class="crt" x="${sc[0]+15}" y="${sc[1]+14}" width="${sw-30}" height="${shh-38}" rx="6"/>
  <!--crt--><g class="crtt" font-family="monospace" font-size="8" fill="#2f6b4a"><text x="${sc[0]+22}" y="${sc[1]+30}">C:\\&gt; THAI.EXE</text><text x="${sc[0]+22}" y="${sc[1]+43}">loading...</text><text x="${sc[0]+22}" y="${sc[1]+56}">SẮP RA MẮT<tspan class="blink">_</tspan></text></g>
  <rect x="${sc[0]+15}" y="${sc[1]+14}" width="${sw-30}" height="${(shh-38)/2}" rx="6" fill="#fff" opacity=".1"/>
  <rect x="${sc[0]+sw/2-8}" y="${scW[1]-14}" width="16" height="4" rx="1" fill="#9fd36b"/><circle cx="${scW[0]-16}" cy="${scW[1]-12}" r="2.5" fill="#b8b0a0"/>`;
 EM.push(`<rect class="emcrt" x="${sc[0]+15}" y="${sc[1]+14}" width="${sw-30}" height="${shh-38}" rx="6"/><g class="emcrtt" font-family="monospace" font-size="8"><text x="${sc[0]+22}" y="${sc[1]+30}">C:\\&gt; THAI.EXE</text><text x="${sc[0]+22}" y="${sc[1]+43}">loading...</text><text x="${sc[0]+22}" y="${sc[1]+56}">SẮP RA MẮT<tspan class="blink">_</tspan></text></g>`);
 const k0=F([368,top+2]),k1=F([476,top+2]);
 const kbd=`<polygon points="${pts([[k0[0]+6,k0[1]-7],[k1[0]-6,k1[1]-7],[k1[0],k1[1]+2],[k0[0],k0[1]+2]])}" fill="#e9e5dc"/><polygon points="${pts([[k0[0],k0[1]+2],[k1[0],k1[1]+2],[k1[0],k1[1]+4],[k0[0],k0[1]+4]])}" fill="#c9c3b6"/>
  <g fill="#cfc9bc">${Array.from({length:3},(_,r)=>Array.from({length:12},(_,c)=>`<rect x="${(k0[0]+7+c*(k1[0]-k0[0]-14)/12).toFixed(1)}" y="${(k0[1]-5+r*2.4).toFixed(1)}" width="${((k1[0]-k0[0]-22)/12).toFixed(1)}" height="1.6"/>`).join('')).join('')}</g>
  <ellipse cx="${k1[0]+20}" cy="${k1[1]-1}" rx="7" ry="3.5" fill="#ece8df"/>`;
 const m=F([528,top]),m2=F([536,top]);
 const props=`<path d="M${F([x+20,top])[0]} ${F([x,top])[1]-1}l14-10h48l-14 10z" fill="#f1eee8"/><path d="M${F([x+24,top])[0]} ${F([x,top])[1]-5}l14-10h48l-14 10z" fill="#f7f5f0"/>
  ${box(x+14,494,44,24,.94,{f:'#cdbfa8',t:'#ded3c1',b:'#b3a58d',l:'#c6b8a0',r:'#bfb197'})}
  ${box(556,418,18,100,.92,{f:'#5a3b2a',t:'#6d4a36',b:'#3e291d',l:'#4d3324',r:'#4a3122'})}${box(576,424,18,94,.92,{f:'#3f2b21',t:'#553a2c',b:'#2c1e17',l:'#382620',r:'#34241c'})}
  <path d="M${m[0]} ${m[1]-1}v-18a8 8 0 0 1 16 0v18z" fill="#f4f1ea"/><path d="M${m[0]+16} ${m[1]-15}q8 2 0 9" stroke="#f4f1ea" stroke-width="2.5" fill="none"/>
  <g class="steam">${[0,1].map(i=>`<path d="M${m[0]+5+i*6} ${m[1]-26}q-3-5 0-10t0-10" stroke="#fff" stroke-width="1.4" fill="none" style="animation-delay:-${i*1.4}s"/>`).join('')}</g>`;
 const ch=480,cy=fy+30;
 const chair=`<ellipse cx="${ch}" cy="${cy+70}" rx="66" ry="12" fill="#3a2a1c" opacity=".28" filter="url(#sh1)"/>
  <g stroke="#2a2725" stroke-width="7" stroke-linecap="round"><line x1="${ch}" y1="${cy+52}" x2="${ch-50}" y2="${cy+64}"/><line x1="${ch}" y1="${cy+52}" x2="${ch+50}" y2="${cy+64}"/><line x1="${ch}" y1="${cy+52}" x2="${ch-22}" y2="${cy+72}"/><line x1="${ch}" y1="${cy+52}" x2="${ch+24}" y2="${cy+72}"/></g>
  ${[[-50,66],[50,66],[-22,74],[24,74]].map(([d,yy])=>`<circle cx="${ch+d}" cy="${cy+yy}" r="5" fill="#1a1918"/>`).join('')}
  <rect x="${ch-5}" y="${cy-6}" width="10" height="58" fill="#7d8187"/><rect x="${ch-5}" y="${cy-6}" width="3" height="58" fill="#fff" opacity=".3"/>
  <rect x="${ch-4}" y="${cy-92}" width="8" height="70" fill="#8d9196"/>
  <rect x="${ch-36}" y="${cy-178}" width="72" height="92" rx="22" fill="#9a5a33"/><rect x="${ch-30}" y="${cy-172}" width="60" height="78" rx="18" fill="#b26e40"/><rect x="${ch-30}" y="${cy-172}" width="60" height="20" rx="10" fill="#fff" opacity=".1"/><path d="M${ch-18} ${cy-150}v44M${ch+18} ${cy-150}v44" stroke="#9a5a33" stroke-width="1.5" opacity=".6"/>
  <path d="M${ch-58} ${cy-22}q58-22 116 0l-6 22q-52 14-104 0z" fill="#8f532f"/><path d="M${ch-54} ${cy-24}q54-20 108 0l-4 12q-50 12-100 0z" fill="#b26e40"/><path d="M${ch-40} ${cy-28}q40-12 80 0" stroke="#fff" stroke-width="2" opacity=".2" fill="none"/>`;
 return `${blurSh(`M${x+w-10} ${top-120}L${x+w+46} ${top-104}L${x+w+50} ${WALL.b}L${x+w-10} ${WALL.b}z`,'calc(var(--sun)*.14)')}
  <path d="M${fA[0]} ${fy}L${fB[0]} ${fy}L${x+w} ${WALL.b}L${x} ${WALL.b}z" fill="#3a2a1c" opacity=".18" filter="url(#sh2)"/>
  ${legB(x+10)}${legB(x+w-10)}${dr}${handles}${legF(x+10)}${legF(x+w-10)}
  ${box(x,top,w,th,k,{f:'#2f2c2a',t:'#47423e',b:'#1f1d1b',l:'#2a2725',r:'#262321'})}
  ${caseB}${crt}${screen}${kbd}${props}${chair}`}

// Bảng lịch luyện tập treo tường (chỗ chừa sẵn, sắp có).
function calendarArt(){const x=318,y=170,w=176,h=156,k=.985,F=fromVP([x,y],k),G=fromVP([x+w,y+h],k);
 // Tháng hiện tại: mỗi ô tô màu theo mức hoàn thành thật (xanh xô thơm), hôm nay có viền đậm.
 const t=dayKey(),[yy,mm]=t.split('-').map(Number),first=`${yy}-${String(mm).padStart(2,'0')}-01`,off=isoDow(first)-1,dim=new Date(Date.UTC(yy,mm,0)).getUTCDate(),rows=Math.ceil((off+dim)/7);
 const LV=['#fbf8f2','#d3dec8','#a8c098','#7b9c6b','#52774a'],cw=(G[0]-F[0]-24)/7,chh=(G[1]-F[1]-52)/rows;let cells='';
 for(let n=1;n<=dim;n++){const p=off+n-1,cx=F[0]+12+(p%7)*cw,cy=F[1]+42+Math.floor(p/7)*chh,d=`${first.slice(0,8)}${String(n).padStart(2,'0')}`;
  let fill=LV[0],tc='#a59780';if(HB.loaded&&d<=t){const s=dayStat(d);if(s.rest)fill='#ecd9b0';else if(!s.none){const l=hlevel(s.p);fill=LV[l];if(l>=3)tc='#fff'}}
  cells+=`<rect x="${(cx+1).toFixed(1)}" y="${(cy+1).toFixed(1)}" width="${(cw-2).toFixed(1)}" height="${(chh-2).toFixed(1)}" rx="1.5" fill="${fill}"${d===t?' stroke="#3b2d20" stroke-width="1.4"':''}/><text x="${(cx+3).toFixed(1)}" y="${(cy+7.5).toFixed(1)}" font-size="5.6" fill="${tc}" font-family="Be Vietnam Pro,system-ui">${n}</text>`}
 return `${blurSh(`M${G[0]-4} ${F[1]+10}L${G[0]+16} ${F[1]+18}L${G[0]+16} ${G[1]+14}L${F[0]+12} ${G[1]+14}z`,'calc(var(--sun)*.18 + .06)','sh1')}
  ${box(x,y,w,h,k,{f:'#efe7d8',t:'#d9ccb6',b:'#c9b99e',l:'#d6c8b0',r:'#cdbfa5'})}
  <rect x="${F[0]+6}" y="${F[1]+6}" width="${G[0]-F[0]-12}" height="${G[1]-F[1]-12}" fill="#e8dcc6"/>
  <text x="${F[0]+12}" y="${F[1]+24}" font-size="13" fill="#3b2d20" font-family="Anton,Impact,sans-serif" letter-spacing=".5">LỊCH TẬP</text><text x="${G[0]-12}" y="${F[1]+23}" font-size="8" text-anchor="end" fill="#8a7a62" font-family="Be Vietnam Pro,system-ui">THÁNG ${mm}</text>
  <g font-size="5.6" fill="#a59780" font-family="Be Vietnam Pro,system-ui">${['T2','T3','T4','T5','T6','T7','CN'].map((d,c)=>`<text x="${(F[0]+14+c*cw).toFixed(1)}" y="${F[1]+36}">${d}</text>`).join('')}</g>${cells}
  <circle cx="${(F[0]+G[0])/2}" cy="${F[1]-3}" r="3" fill="#7a6a4f"/>`}

// Đồng hồ treo tường chạy theo giờ thật.
// Biển neon logo tròn treo giữa lịch tập và kệ sách: tấm đế tối gắn tường (luôn thấy), ống neon vàng phát sáng trên lớp tối.
const NEON={x:567,y:236,r:64};
function neonArt(){const{x,y,r}=NEON,s=r*2;
 EM.push(`<g class="emneon" filter="url(#neonGlow)">${logoSvg({bg:'none',line:'#ffd84d',mark:'#fff4cc',x:x-r,y:y-r,size:s,cls:'neon'})}</g>`);
 return `<circle cx="${x+6}" cy="${y+8}" r="${r+6}" fill="#3a2a1c" opacity=".22" filter="url(#sh1)"/><circle cx="${x}" cy="${y}" r="${r+5}" fill="#231b52"/>
 <circle cx="${x}" cy="${y}" r="${r+5}" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="1.2"/>${[[-1,-1],[1,-1],[-1,1],[1,1]].map(([a,b])=>`<circle cx="${(x+a*r*.78).toFixed(1)}" cy="${(y+b*r*.78).toFixed(1)}" r="1.8" fill="#8f86b8"/>`).join('')}`}
const CLK={x:1160,y:119,r:24};
function clockArt(){const{x:cx,y:cy,r}=CLK;return `<circle cx="${cx+8}" cy="${cy+7}" r="${r}" fill="#3a2a1c" opacity=".16" filter="url(#sh1)"/><circle cx="${cx}" cy="${cy}" r="${r+4}" fill="#c9a77c"/><circle cx="${cx}" cy="${cy}" r="${r+4}" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="1"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#fbf8f2"/>
 ${Array.from({length:12},(_,i)=>{const a=i*Math.PI/6,l=i%3?4:8;return `<line x1="${(cx+Math.sin(a)*(r-4)).toFixed(1)}" y1="${(cy-Math.cos(a)*(r-4)).toFixed(1)}" x2="${(cx+Math.sin(a)*(r-4-l)).toFixed(1)}" y2="${(cy-Math.cos(a)*(r-4-l)).toFixed(1)}" stroke="#3b2d20" stroke-width="${i%3?1:2}"/>`}).join('')}
 <line id="hh" x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy-17}" stroke="#2a2522" stroke-width="3" stroke-linecap="round"/><line id="mm" x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy-26}" stroke="#2a2522" stroke-width="2" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="2.6" fill="#c0503b"/>
 <ellipse cx="${cx-10}" cy="${cy-14}" rx="16" ry="9" fill="#fff" opacity=".35" transform="rotate(-30 ${cx-10} ${cy-14})"/>`}
function tickClock(){const d=new Date(),h=$('hh'),m=$('mm');if(!h)return;
 h.setAttribute('transform',`rotate(${(d.getHours()%12)*30+d.getMinutes()/2} ${CLK.x} ${CLK.y})`);m.setAttribute('transform',`rotate(${d.getMinutes()*6} ${CLK.x} ${CLK.y})`)}
setInterval(tickClock,20000);

// Hốc tường tủ đồ: thanh treo, áo, đèn rọi.
function wardrobeArt(){const x=1010,y=150,w=300,h=WALL.b-y,k=.9,B=p=>toVP(p,k);
 const b0=B([x,y]),b1=B([x+w,y]),b2=B([x+w,y+h]),rodY=b0[1]+64,rx0=b0[0]+8,rx1=b1[0]-8;
 const cols=garments.length?garments.slice(0,8).map(g=>g.c):['#2c3e5c','#6f747a','#e6dcc6','#2f6b4a','#1f1f22','#c9b98f','#3f8f5a','#a24d3a'];
 const tees=cols.map((c,j)=>{const tx=cols.length<2?(rx0+rx1)/2:rx0+20+j*((rx1-rx0-40)/(cols.length-1)),len=j%3!==1?92:72;
  return `<g class="tee" style="--j:${j}"><path d="M${tx} ${rodY}q0-7 5-7" stroke="#555" stroke-width="1.6" fill="none"/><path d="M${tx-12} ${rodY+10}l12-6l12 6" stroke="#7a6a4f" stroke-width="1.6" fill="none"/>
   <path d="M${tx-15} ${rodY+12}l9-4h12l9 4 6 18-8 3v${len-16}q-13 4-26 0v-${len-16}l-8-3z" fill="${c}"/><path d="M${tx-6} ${rodY+8}q6 6 12 0" stroke="rgba(0,0,0,.25)" stroke-width="1.4" fill="none"/>
   <path d="M${tx+9} ${rodY+20}v${len-12}" stroke="#000" stroke-width="5" opacity=".08"/><path d="M${tx-9} ${rodY+20}v${len-14}" stroke="#fff" stroke-width="2" opacity=".1"/></g>`}).join('');
 const sy=b2[1]-72;
 const inside=`<ellipse class="spot" cx="${(b0[0]+b1[0])/2}" cy="${b0[1]+160}" rx="${(b1[0]-b0[0])*.6}" ry="200"/>
  <rect x="${rx0+8}" y="${rodY+18}" width="${rx1-rx0}" height="96" fill="#3a2a1c" opacity=".14" filter="url(#sh1)"/>
  ${tees}
  <line x1="${rx0}" y1="${rodY}" x2="${rx1}" y2="${rodY}" stroke="#1d1b1a" stroke-width="4" stroke-linecap="round"/><line x1="${rx0}" y1="${rodY-1}" x2="${rx1}" y2="${rodY-1}" stroke="#fff" stroke-width="1" opacity=".35"/>
  ${box(b0[0]+16,sy,b1[0]-b0[0]-32,8,.96,{f:'#d6b88d',t:'#e3cba6',b:'#b99a72',l:'#cdb08a',r:'#c4a67e'})}
  <rect x="${b0[0]+34}" y="${sy-20}" width="66" height="20" rx="2" fill="#c9b08a"/><rect x="${b0[0]+38}" y="${sy-16}" width="58" height="12" fill="#b89b72"/>
  <rect x="${b0[0]+122}" y="${sy-12}" width="72" height="12" rx="2" fill="#e9e3d8"/><rect x="${b0[0]+126}" y="${sy-24}" width="64" height="12" rx="2" fill="#d8cfbf"/><rect x="${b0[0]+130}" y="${sy-34}" width="56" height="10" rx="2" fill="#6f747a"/>
  <path d="M${b1[0]-90} ${b2[1]-3}h46q9 0 11-9l-5-6h-28l-20 9z" fill="#f2f0eb"/><path d="M${b1[0]-90} ${b2[1]-3}h56" stroke="#c9c4ba" stroke-width="2"/><path d="M${b1[0]-150} ${b2[1]-3}h46q9 0 11-9l-5-6h-28l-20 9z" fill="#2a2725"/>
  <ellipse class="spot2" cx="${(b0[0]+b1[0])/2}" cy="${b0[1]+5}" rx="16" ry="4"/>`;
 EM.push(`<ellipse class="emspot" cx="${(b0[0]+b1[0])/2}" cy="${b0[1]+5}" rx="16" ry="4"/><path class="emcone" d="M${(b0[0]+b1[0])/2-14} ${b0[1]+6}L${b0[0]+10} ${b2[1]}H${b1[0]-10}L${(b0[0]+b1[0])/2+14} ${b0[1]+6}z"/>`);
 return `${recess('nicheClip',x,y,w,h,k,{back:'#e2d9cb',t:'#cfc4b3',b:'#cdb08a',l:'#d9cfbf',r:'#d4c9b8'},inside)}
  <rect x="${x-3}" y="${y-3}" width="${w+6}" height="${h+3}" fill="none" stroke="#fbf8f2" stroke-width="5"/><rect x="${x-0.5}" y="${y-0.5}" width="${w+1}" height="${h+0.5}" fill="none" stroke="#c9bba6" stroke-width="1"/>
`}

// Công tắc đèn trên tường.
function switchArt(){return `<rect x="1312" y="408" width="20" height="32" rx="3" fill="#fbf8f2" stroke="#d6cbb9"/><rect class="swk" x="1318" y="414" width="8" height="12" rx="2" fill="#e6ddcf" stroke="#cfc4b3"/><rect x="1314" y="438" width="20" height="5" fill="#3a2a1c" opacity=".08" filter="url(#sh1)"/>`}

// Đèn treo giấy (Akari), thảm tròn, cây lớn ở góc trước.
function lampArt(){const x=150,y=852,w=64,h=150,t=y-h-34;
 EM.push(`<ellipse class="empool" cx="${x+40}" cy="${y-10}" rx="230" ry="70"/><ellipse class="empool" cx="${x+20}" cy="${t+h/2}" rx="170" ry="200"/><rect class="emlamp" x="${x-w/2}" y="${t}" width="${w}" height="${h}" rx="${w/2.4}"/>${Array.from({length:9},(_,i)=>`<path class="emrib" d="M${x-w/2+3} ${t+12+i*15}h${w-6}"/>`).join('')}`);
 return `<ellipse class="lampg" cx="${x}" cy="${t+h/2}" rx="210" ry="230"/><ellipse cx="${x}" cy="${y+4}" rx="46" ry="9" fill="#3a2a1c" opacity=".25" filter="url(#sh1)"/>
  <path d="M${x-22} ${y}l22-34 22 34M${x} ${y-34}v-6" stroke="#2a2725" stroke-width="3" fill="none"/>
  <rect x="${x-w/2}" y="${t}" width="${w}" height="${h}" rx="${w/2.4}" fill="var(--paper)"/>${Array.from({length:9},(_,i)=>`<path d="M${x-w/2+3} ${t+12+i*15}h${w-6}" stroke="#d9cdb6" stroke-width="1" opacity=".75"/>`).join('')}
  <rect x="${x-w/2}" y="${t}" width="${w*.35}" height="${h}" rx="${w/2.4}" fill="#fff" opacity=".25"/><rect x="${x+w*.18}" y="${t}" width="${w*.32}" height="${h}" rx="${w/2.4}" fill="#000" opacity=".05"/>`}
function rugArt(){return `<ellipse cx="800" cy="770" rx="300" ry="62" fill="#3a2a1c" opacity=".14" filter="url(#sh1)"/><ellipse cx="800" cy="765" rx="296" ry="60" fill="#e6dac6"/><ellipse cx="800" cy="765" rx="250" ry="49" fill="none" stroke="#d6c6ab" stroke-width="3"/><ellipse cx="800" cy="765" rx="170" ry="33" fill="none" stroke="#d6c6ab" stroke-width="2"/><ellipse cx="800" cy="765" rx="296" ry="60" filter="url(#grain)" opacity=".9"/>`}
function plantArt(){const x=1480,y=890;
 const leaf=(lx,ly,a,s,c)=>`<g transform="translate(${lx} ${ly}) rotate(${a})"><path d="M0 0c-${14*s} -${20*s} -${10*s} -${52*s} 0 -${70*s}c${10*s} ${18*s} ${14*s} ${50*s} 0 ${70*s}z" fill="${c}"/><path d="M0 0v-${66*s}" stroke="#2d5a35" stroke-width="1.2" opacity=".5"/></g>`;
 return `<ellipse cx="${x}" cy="${y+6}" rx="110" ry="20" fill="#3a2a1c" opacity=".22" filter="url(#sh2)"/>
  <path d="M${x} ${y-140}c-6-60 4-120-2-170" stroke="#5a4330" stroke-width="5" fill="none"/>
  <g class="leafs" style="transform-box:fill-box;transform-origin:50% 100%">${[[x-10,y-170,-30,1.5,'#5e8f5b'],[x+20,y-200,10,1.7,'#4f8a55'],[x-40,y-230,-55,1.3,'#6b9c66'],[x+50,y-240,40,1.4,'#5e8f5b'],[x,y-260,-5,1.6,'#4a7d4f'],[x-60,y-170,-80,1.2,'#6b9c66'],[x+70,y-170,70,1.2,'#4f8a55'],[x+10,y-300,20,1.3,'#5e8f5b']].map(a=>leaf(...a)).join('')}</g>
  <path d="M${x-62} ${y-130}h124l-14 132h-96z" fill="#efe8dc"/><path d="M${x-62} ${y-130}h124l-2 14h-120z" fill="#ddd3c3"/><path d="M${x+36} ${y-128}l-12 128h22l14-128z" fill="#000" opacity=".06"/>`}

const OBJS=[
 {id:'ke-sach',name:'Kệ sách kỷ niệm',open:true,art:bookcaseArt,sub:()=>books.length?`${books.length} quyển`:'Mở kệ sách'},
 {id:'ban',name:'Bàn làm việc',art:deskArt,sub:()=>'Sắp ra mắt'},
 {id:'lich-tap',name:'Lịch luyện tập',open:true,art:calendarArt,sub:()=>{if(!HB.loaded)return 'Mở lịch tập';const s=dayStat(dayKey()),a=allStreak();return `${a.cur?`🔥 ${a.cur} ngày · `:''}hôm nay ${s.n?`${s.done}/${s.n}`:'nghỉ'}`}},
 {id:'tu-do',name:'Tủ đồ sưu tầm',open:true,art:wardrobeArt,sub:()=>garments.length?`${garments.length} món`:'Mở tủ đồ'}];

function drawRoom(){const sc=$('scene');if(!sc)return;
 if(r3Active()){r3Refresh();return}   // đang hiện phòng 3D: chỉ cập nhật sách, áo, tờ lịch
 sc.classList.remove('s3d');EM=[];
 const o=id=>OBJS.find(x=>x.id===id),g=x=>`<g class="obj${x.open?'':' soon'}" data-go="${x.id}" tabindex="0" role="button" aria-label="${x.name}: ${x.sub()}">${x.art()}</g>`;
 sc.innerHTML=`<svg class="rbg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
  <g class="pl-b">${shell()}${sunlight()}${neonArt()}${clockArt()}${switchArt()}</g>
  <g class="pl-m">${g(o('lich-tap'))}${g(o('tu-do'))}${rugArt()}${g(o('ke-sach'))}${g(o('ban'))}${lampArt()}</g>
  <g class="pl-f">${plantArt()}</g>
  <g pointer-events="none"><rect width="1600" height="900" class="dark"/><rect width="1600" height="900" class="dusk"/>
   <g style="mix-blend-mode:screen"><ellipse class="lampg2" cx="200" cy="640" rx="420" ry="380"/><ellipse class="lampg2" cx="800" cy="120" rx="560" ry="260" style="opacity:calc(var(--glow)*.3)"/><ellipse class="crtg" cx="430" cy="455" rx="130" ry="90"/><ellipse class="moong" cx="150" cy="380" rx="160" ry="260"/>
    <ellipse class="ledg2" cx="800" cy="420" rx="200" ry="300"/><ellipse class="spotg" cx="1160" cy="380" rx="170" ry="280"/></g>
   <defs><linearGradient id="gCone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe48a" stop-opacity=".55"/><stop offset="1" stop-color="#ffe48a" stop-opacity="0"/></linearGradient></defs>
   <g class="em">${EM.join('')}</g></g>
 </svg><div class="otag" id="otag"></div><button type="button" class="lightsw" id="lsw" aria-label="Bật / tắt đèn phòng" title="Bật / tắt đèn phòng"></button>`;
 tickClock()}

// ---------- tương tác: nhãn khi rê chuột, thị sai, phóng vào món đồ ----------
let roomBusy=false;
function tagFor(g){const t=$('otag'),o=OBJS.find(x=>x.id===g.dataset.go),r=g.getBoundingClientRect(),s=$('scene').getBoundingClientRect();
 t.innerHTML=`<b>${o.name}</b><small>${o.sub()}</small>`;t.style.left=(r.left+r.width/2-s.left)+'px';t.style.top=Math.max(48,r.top-s.top)+'px';t.classList.add('on')}
document.addEventListener('pointerover',e=>{if(!e.target.closest)return;const g=e.target.closest('#scene .obj');if(g)tagFor(g);else if($('otag'))$('otag').classList.remove('on')});
document.addEventListener('focusin',e=>{const g=e.target.closest&&e.target.closest('#scene .obj');if(g)tagFor(g)});
function zoomTo(el,cb){const sc=$('scene'),r=el.getBoundingClientRect(),s=sc.getBoundingClientRect();
 if(RM()){cb();return}
 const k=Math.min(innerWidth/r.width,innerHeight/r.height)*.92,cx=r.left+r.width/2,cy=r.top+r.height/2;
 sc.style.transformOrigin=`${cx-s.left}px ${cy-s.top}px`;roomBusy=true;$('otag').classList.remove('on');
 document.querySelector('.rhead').animate([{opacity:1},{opacity:0}],{duration:300,fill:'forwards'});
 sc.animate([{transform:'none',opacity:1},{transform:`translate(${innerWidth/2-cx}px,${innerHeight/2-cy}px) scale(${k})`,opacity:1,offset:.8},{transform:`translate(${innerWidth/2-cx}px,${innerHeight/2-cy}px) scale(${k*1.08})`,opacity:0}],{duration:820,easing:'cubic-bezier(.55,0,.3,1)'}).onfinish=()=>{roomBusy=false;sc.style.transformOrigin='';document.querySelector('.rhead').getAnimations().forEach(a=>a.cancel());cb()}}
function zoomFrom(id){const sc=$('scene'),el=sc&&sc.querySelector(`[data-go="${id}"]`);if(!el||RM())return;
 const r=el.getBoundingClientRect(),s=sc.getBoundingClientRect(),k=Math.min(innerWidth/r.width,innerHeight/r.height)*.92,cx=r.left+r.width/2,cy=r.top+r.height/2;
 sc.style.transformOrigin=`${cx-s.left}px ${cy-s.top}px`;
 document.querySelector('.rhead').animate([{opacity:0},{opacity:0,offset:.5},{opacity:1}],{duration:760});
 sc.animate([{transform:`translate(${innerWidth/2-cx}px,${innerHeight/2-cy}px) scale(${k})`,opacity:0},{opacity:1,offset:.3},{transform:'none',opacity:1}],{duration:760,easing:'cubic-bezier(.3,0,.2,1)'}).onfinish=()=>{sc.style.transformOrigin=''}}
function activate(b){if(roomBusy)return;const o=OBJS.find(x=>x.id===b.dataset.go);
 if(!o.open){SFX.play('click');b.classList.remove('nope');void b.getBoundingClientRect();b.classList.add('nope');toast(`${o.name} ${o.sub().toLowerCase()}. Hẹn bạn quay lại sau!`);return}
 SFX.play('pull');zoomTo(b,()=>{location.hash='#/'+o.id})}
document.addEventListener('click',e=>{if(e.target.closest('#lsw')){const off=document.body.classList.toggle('lights-off');store.set('ksk3lights',off?'0':'1');SFX.play('click');return}
 const b=e.target.closest('#scene .obj');if(b)activate(b)});
document.addEventListener('keydown',e=>{const b=e.target.closest&&e.target.closest('#scene .obj');if(b&&(e.key==='Enter'||e.key===' ')){e.preventDefault();activate(b)}});
if(store.get('ksk3lights')==='0')document.body.classList.add('lights-off');

room('phong',{title:ROOM_NAME,enter(from){$('rname').textContent=ROOM_NAME;const in3d=r3Enter(from);if(!in3d)drawRoom();scrollTo({top:0,behavior:'instant'});
 if(from&&!in3d)zoomFrom(from);if(!books.length)loadBooks().then(()=>{if(curRoom==='phong')drawRoom()});loadGarments();loadHabits()},
 leave(){r3Leave()}});
hooks.books.push(()=>{if(curRoom==='phong')drawRoom()});
