// Dữ liệu tủ đồ: bảng garments, ảnh trong kho 'photos' (thư mục wardrobe/).
const rowToGarment=r=>({id:r.id,name:r.name||'',brand:r.brand||'',story:r.story||'',path:r.photo||'',img:r.photo?photoUrl(r.photo):'',c:r.color||'#8a8a8a',pos:r.position??0,private:!!r.private});
const gErr=e=>/garments|relation|does not exist|schema cache/i.test(e.message||'')?new Error('Chưa có bảng garments. Hãy chạy file supabase-tu-do.sql trong Supabase'):e;
async function dbLoadGarments(){const{data,error}=await sb.from('garments').select('*').order('position');if(error)throw gErr(error);return data.map(rowToGarment)}
async function dbAddGarment(g,blob,pos){const ext=blob.type==='image/webp'?'webp':'png',path=`wardrobe/${crypto.randomUUID()}.${ext}`;
 const up=await sb.storage.from(BUCKET).upload(path,blob,{contentType:blob.type});if(up.error)throw up.error;
 const{data,error}=await sb.from('garments').insert({name:g.name,brand:g.brand,story:g.story,color:g.c,photo:path,position:pos,private:!!g.private}).select().single();
 if(error){await sb.storage.from(BUCKET).remove([path]);throw gErr(error)}return rowToGarment(data)}
async function dbUpdateGarment(g,f){const{data,error}=await sb.from('garments').update(f).eq('id',g.id).select('id');if(error)throw gErr(error);if(!data||!data.length)throw noRows()}
async function dbDeleteGarment(g){const{data,error}=await sb.from('garments').delete().eq('id',g.id).select('id');if(error)throw gErr(error);if(!data||!data.length)throw noRows();
 if(g.path)await sb.storage.from(BUCKET).remove([g.path])}
