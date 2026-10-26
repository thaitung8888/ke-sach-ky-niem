// Dữ liệu của kệ sách: bảng books, pages và ảnh trong kho 'photos'.
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

