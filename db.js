// Lớp dữ liệu: toàn bộ giao tiếp với Supabase nằm ở file này.
// Sau này bật đăng nhập hoặc đổi sang ảnh riêng tư, chỉ cần sửa ở đây.
const sb=supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
const BUCKET='photos';
const photoUrl=p=>sb.storage.from(BUCKET).getPublicUrl(p).data.publicUrl;

const rowToPage=r=>({id:r.id,l:r.layout,bg:r.bg,paths:r.photos||[],im:(r.photos||[]).map(photoUrl),t:r.caption||'',s:r.sticker||''});
function rowToBook(r,pages=[]){const ts=Date.parse(r.created_at);
 return{id:r.id,title:r.title,sub:r.sub||'',c:r.color,a:r.art,t:r.thickness,ts,seed:Math.floor(ts/1000)%1000,pages}}

async function dbLoadBooks(){
 const[b,p]=await Promise.all([sb.from('books').select('*').order('created_at'),sb.from('pages').select('*').order('position')]);
 if(b.error)throw b.error;if(p.error)throw p.error;
 return b.data.map(r=>rowToBook(r,p.data.filter(x=>x.book_id===r.id).map(rowToPage)))}

async function dbAddBook({title,sub,c,a,t}){
 const{data,error}=await sb.from('books').insert({title,sub,color:c,art:a,thickness:t}).select().single();
 if(error)throw error;return rowToBook(data)}

async function dbDeleteBook(book){
 const{error}=await sb.from('books').delete().eq('id',book.id);if(error)throw error;
 const paths=book.pages.flatMap(p=>p.paths||[]);
 if(paths.length)await sb.storage.from(BUCKET).remove(paths)}

async function dbAddPage(book,{l,bg,t,s},blobs){
 const paths=[];
 for(const bl of blobs){const path=`${book.id}/${crypto.randomUUID()}.jpg`;
  const{error}=await sb.storage.from(BUCKET).upload(path,bl,{contentType:'image/jpeg'});if(error)throw error;paths.push(path)}
 const{data,error}=await sb.from('pages').insert({book_id:book.id,position:book.pages.length,layout:l,bg,photos:paths,caption:t,sticker:s}).select().single();
 if(error)throw error;return rowToPage(data)}