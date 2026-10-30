// Logo tròn 15 Xóm Lẻ (vòng chữ chạy quanh, mái cổng xóm, số 15, chữ XÓM LẺ), chép cách vẽ từ dự án xom-le-15 (textures/brand.js · roundelTex).
// Một hàm vẽ canvas dùng chung cho: logo ở đầu trang, biển neon trong căn phòng 2D, thảm tròn và biển neon trong căn phòng 3D.
const BR={purple:'#3b2ca6',yellow:'#ffc700',ivory:'#f7f1e6',ink:'#1c1640',lilac:'#9a8cff'};
// Vẽ logo vào hình tròn tâm (cx,cy) bán kính R. c: {bg: màu nền tròn hoặc 'none', line: vòng + chữ chạy + mái cổng, mark: số 15 và chữ XÓM LẺ}
function drawRoundel(g,cx,cy,R,c={}){const s=R/512,line=c.line||'#fff',mark=c.mark||line,F=n=>`${n} ${'Montserrat, "Be Vietnam Pro", sans-serif'}`;
 g.save();g.translate(cx,cy);g.scale(s,s);
 if(c.bg&&c.bg!=='none'){g.fillStyle=c.bg;g.beginPath();g.arc(0,0,508,0,7);g.fill()}
 g.strokeStyle=g.fillStyle=line;g.lineWidth=14;g.beginPath();g.arc(0,0,496,0,7);g.stroke();
 g.lineWidth=5;g.beginPath();g.arc(0,0,426,0,7);g.stroke();
 // chữ chạy vòng quanh, liền một vòng
 g.font=F('800 44px');g.textAlign='center';g.textBaseline='middle';
 const chars=[...'ĐI CHẬM · NHÌN QUANH · 15 XÓM LẺ · HÀ NỘI · '],R0=461,ws=chars.map(ch=>g.measureText(ch).width+7),tot=ws.reduce((a,b)=>a+b,0),
  reps=Math.max(1,Math.floor(2*Math.PI*R0/tot)),k=2*Math.PI*R0/(tot*reps);let ang=-Math.PI/2;
 for(let r=0;r<reps;r++)chars.forEach((ch,i)=>{const a=ws[i]*k/R0;g.save();g.translate(Math.cos(ang+a/2)*R0,Math.sin(ang+a/2)*R0);g.rotate(ang+a/2+Math.PI/2);g.fillText(ch,0,0);g.restore();ang+=a});
 // mái cổng xóm
 const ry=-262;g.beginPath();g.moveTo(-180,ry+52);g.quadraticCurveTo(-90,ry+30,-60,ry-18);g.lineTo(60,ry-18);g.quadraticCurveTo(90,ry+30,180,ry+52);
 g.lineTo(150,ry+66);g.lineTo(-150,ry+66);g.closePath();g.fill();g.fillRect(-150,ry+78,300,16);g.fillRect(-132,ry+94,22,34);g.fillRect(110,ry+94,22,34);
 // số 15, gạch ngang + chấm, chữ XÓM LẺ
 g.fillStyle=mark;g.textBaseline='alphabetic';g.font=F('900 330px');g.fillText('15',0,100);
 g.fillStyle=line;g.fillRect(-190,134,150,6);g.fillRect(40,134,150,6);g.beginPath();g.arc(0,137,9,0,7);g.fill();
 g.fillStyle=mark;g.font=F('900 112px');g.fillText('XÓM LẺ',0,278);
 g.restore()}
// Ảnh logo (data URL) theo bộ màu, lưu lại để không vẽ lại nhiều lần.
const logoCache={};
function logoUrl(c={},px=512){const key=JSON.stringify(c)+px;if(logoCache[key])return logoCache[key];
 const cv=document.createElement('canvas');cv.width=cv.height=px;drawRoundel(cv.getContext('2d'),px/2,px/2,px/2-2,c);
 return logoCache[key]=cv.toDataURL('image/png')}
// Logo dạng <image> để đặt vào SVG (căn phòng 2D).
function logoSvg({bg='none',line='#fff',mark,x=0,y=0,size=100,cls=''}={}){
 return `<image${cls?` class="${cls}"`:''} x="${x}" y="${y}" width="${size}" height="${size}" href="${logoUrl({bg,line,mark:mark||line})}"/>`}
// Logo nhỏ ở đầu trang (các thẻ có data-logo). Chờ phông Montserrat tải xong mới vẽ để chữ đúng kiểu.
function drawLogos(){document.querySelectorAll('[data-logo]').forEach(el=>{el.innerHTML=`<img src="${logoUrl({bg:BR.purple,line:BR.yellow,mark:BR.ivory},192)}" alt="15 Xóm Lẻ">`})}
(document.fonts&&document.fonts.load?Promise.all([document.fonts.load('900 40px Montserrat'),document.fonts.load('800 20px Montserrat')]).catch(()=>{}):Promise.resolve())
 .then(()=>{for(const k in logoCache)delete logoCache[k];drawLogos()});
