// Dữ liệu LỊCH LUYỆN TẬP: bảng habits (đọc qua habits_view), checkins, rest_days.
// Ngày luôn tính theo giờ Việt Nam để check lúc 6h sáng không bị ghi sang hôm trước.
const TZ='Asia/Ho_Chi_Minh';
const dayKey=(d=new Date())=>new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit'}).format(d);
const kd=k=>{const[y,m,d]=k.split('-').map(Number);return new Date(Date.UTC(y,m-1,d))};
const addDays=(k,n)=>{const d=kd(k);d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)};
const isoDow=k=>((kd(k).getUTCDay()+6)%7)+1;   // 1 = Thứ Hai … 7 = Chủ nhật

const rowToHabit=r=>({id:r.id,name:r.name,icon:r.icon||'✅',kind:r.kind,target:+r.target||1,unit:r.unit||'',days:r.days&&r.days.length&&r.days.length<7?r.days.map(Number):null,
 private:!!r.private,pos:r.position||0,start:r.start_date,archived:r.archived_at||null});
const missingTables=e=>/habits|checkins|rest_days|relation|schema cache/i.test(e.message||'')?new Error('Chưa có bảng lịch tập. Hãy chạy file supabase-lich-tap.sql trong Supabase'):e;

async function dbLoadHabits(since){
 const[h,c,r]=await Promise.all([sb.from('habits_view').select('*').order('position'),sb.from('checkins').select('habit_id,day,value').gte('day',since),sb.from('rest_days').select('day,note').gte('day',since)]);
 for(const x of[h,c,r])if(x.error)throw missingTables(x.error);
 const checks=new Map();c.data.forEach(x=>checks.set(x.habit_id+'|'+x.day,+x.value));
 return{habits:h.data.map(rowToHabit),checks,rest:new Set(r.data.map(x=>x.day))}}

async function dbSetCheck(hid,day,value){
 const q=value>0?sb.from('checkins').upsert({habit_id:hid,day,value},{onConflict:'habit_id,day'}).select('id'):sb.from('checkins').delete().eq('habit_id',hid).eq('day',day).select('id');
 const{data,error}=await q;if(error)throw error;if(value>0&&(!data||!data.length))throw noRows()}
async function dbSetRest(day,on){
 const q=on?sb.from('rest_days').upsert({day},{onConflict:'day'}).select('day'):sb.from('rest_days').delete().eq('day',day).select('day');
 const{data,error}=await q;if(error)throw error;if(!data||!data.length)throw noRows()}
async function dbSaveHabit(h){
 const row={name:h.name,icon:h.icon,kind:h.kind,target:h.target,unit:h.unit,days:h.days,private:h.private};
 const q=h.id?sb.from('habits').update(row).eq('id',h.id).select('id'):sb.from('habits').insert({...row,position:h.pos}).select('id');
 const{data,error}=await q;if(error)throw missingTables(error);if(!data||!data.length)throw noRows();return data[0].id}
async function dbArchiveHabit(h,day){
 const{data,error}=await sb.from('habits').update({archived_at:day}).eq('id',h.id).select('id');if(error)throw error;if(!data||!data.length)throw noRows()}
