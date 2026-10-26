// Lớp dữ liệu: toàn bộ giao tiếp với Supabase nằm ở file này.
// Quyền thêm/sửa/xóa do luật RLS trên Supabase quyết định (xem supabase-bao-mat.sql), không phải do giao diện.
const sb=supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
const BUCKET='photos';
const photoUrl=p=>sb.storage.from(BUCKET).getPublicUrl(p).data.publicUrl;

const rowToPage=r=>({id:r.id,pos:r.position,l:r.layout,bg:r.bg,paths:r.photos||[],im:(r.photos||[]).map(photoUrl),t:r.caption||'',s:r.sticker||'',x:r.extra||null});
function rowToBook(r,pages=[]){const ts=Date.parse(r.created_at);
 return{id:r.id,title:r.title,sub:r.sub||'',c:r.color,a:r.art,t:r.thickness,ts,seed:Math.floor(ts/1000)%1000,pages,private:!!r.private}}

async function dbLoadBooks(){
 const[b,p]=await Promise.all([sb.from('books').select('*').order('created_at'),sb.from('pages').select('*').order('position')]);
 if(b.error)throw b.error;if(p.error)throw p.error;
 return b.data.map(r=>rowToBook(r,p.data.filter(x=>x.book_id===r.id).map(rowToPage)))}

async function dbAddBook({title,sub,c,a,t,priv}){
 const row={title,sub,color:c,art:a,thickness:t};if(priv)row.private=true;
 const{data,error}=await sb.from('books').insert(row).select().single();
 if(error)throw error;return rowToBook(data)}

// Xóa hoặc sửa bị luật RLS chặn thì Supabase không báo lỗi mà chỉ không đổi dòng nào, nên phải kiểm tra lại.
const noRows=()=>new Error('Chỉ chủ kệ (đã đăng nhập) mới được thay đổi');
async function dbDeleteBook(book){
 const{data,error}=await sb.from('books').delete().eq('id',book.id).select('id');if(error)throw error;if(!data||!data.length)throw noRows();
 const paths=book.pages.flatMap(p=>p.paths||[]);
 if(paths.length)await sb.storage.from(BUCKET).remove(paths)}

async function dbAddPage(book,{l,bg,t,s,x},blobs){
 const paths=[];
 for(const bl of blobs){const path=`${book.id}/${crypto.randomUUID()}.jpg`;
  const{error}=await sb.storage.from(BUCKET).upload(path,bl,{contentType:'image/jpeg'});if(error)throw error;paths.push(path)}
 const{data,error}=await sb.from('pages').insert({book_id:book.id,position:Math.max(-1,...book.pages.map(p=>p.pos))+1,layout:l,bg,photos:paths,caption:t,sticker:s,...(x?{extra:x}:{})}).select().single();
 if(error){if(paths.length)await sb.storage.from(BUCKET).remove(paths);throw /extra/i.test(error.message||'')?new Error('Chưa có cột extra trong bảng pages. Hãy chạy đoạn SQL vé lưu niệm trong Supabase'):error}
 return rowToPage(data)}

async function dbDeletePage(page){
 const{data,error}=await sb.from('pages').delete().eq('id',page.id).select('id');if(error)throw error;if(!data||!data.length)throw noRows();
 if(page.paths&&page.paths.length)await sb.storage.from(BUCKET).remove(page.paths)}

async function dbSetPrivate(book,v){
 const{data,error}=await sb.from('books').update({private:v}).eq('id',book.id).select('id');
 if(error)throw /private/i.test(error.message||'')?new Error('Chưa có cột private. Hãy chạy đoạn SQL bảo mật trong Supabase'):error;if(!data||!data.length)throw noRows()}

// ---------- Đăng nhập: chỉ một tài khoản (chủ kệ), tạo sẵn trong Supabase, đã tắt tự đăng ký ----------
async function dbUser(){const{data}=await sb.auth.getSession();return(data&&data.session&&data.session.user)||null}
async function dbSignIn(email,password){const{data,error}=await sb.auth.signInWithPassword({email,password});
 if(error)throw new Error(/invalid|credentials/i.test(error.message||'')?'Sai email hoặc mật khẩu':error.message);return data.user}
async function dbSignOut(){const{error}=await sb.auth.signOut();if(error)throw error}
const dbOnAuth=cb=>sb.auth.onAuthStateChange((ev,s)=>cb((s&&s.user)||null));