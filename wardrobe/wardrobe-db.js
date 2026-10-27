// Dữ liệu tủ đồ: bảng garments, ảnh trong kho 'photos' (thư mục wardrobe/). Mỗi món có ảnh mặt trước (photo) và có thể thêm ảnh mặt nghiêng (photo_side).
const rowToGarment=r=>({id:r.id,name:r.name||'',brand:r.brand||'',story:r.story||'',path:r.photo||'',img:r.photo?photoUrl(r.photo):'',
 sidePath:r.photo_side||'',side:r.photo_side?photoUrl(r.photo_side):'',c:r.color||'#8a8a8a',pos:r.position??0,private:!!r.private});
const gErr=e=>/photo_side/i.test(e.message||'')?new Error('Chưa có cột ảnh mặt nghiêng. Hãy chạy lại file supabase-tu-do.sql trong Supabase')
 :/garments|relation|does not exist|schema cache/i.test(e.message||'')?new Error('Chưa có bảng garments. Hãy chạy file supabase-tu-do.sql trong Supabase'):e;
async function upGarmentPhoto(blob){const ext=blob.type==='image/webp'?'webp':'png',path=`wardrobe/${crypto.randomUUID()}.${ext}`;
 const up=await sb.storage.from(BUCKET).upload(path,blob,{contentType:blob.type});if(up.error)throw up.error;return path}
async function dbLoadGarments(){const{data,error}=await sb.from('garments').select('*').order('position');if(error)throw gErr(error);return data.map(rowToGarment)}
async function dbAddGarment(g,blob,pos,side){const path=await upGarmentPhoto(blob);let sp=null;
 try{if(side)sp=await upGarmentPhoto(side)}catch(e){await sb.storage.from(BUCKET).remove([path]);throw e}
 const row={name:g.name,brand:g.brand,story:g.story,color:g.c,photo:path,position:pos,private:!!g.private};if(sp)row.photo_side=sp;
 const{data,error}=await sb.from('garments').insert(row).select().single();
 if(error){await sb.storage.from(BUCKET).remove([path,sp].filter(Boolean));throw gErr(error)}return rowToGarment(data)}
async function dbUpdateGarment(g,f){const{data,error}=await sb.from('garments').update(f).eq('id',g.id).select('id');if(error)throw gErr(error);if(!data||!data.length)throw noRows()}
// Thay ảnh mặt trước ('photo') hoặc mặt nghiêng ('photo_side'): tải ảnh mới lên, ghi vào bảng, rồi mới xóa ảnh cũ.
async function dbSetGarmentPhoto(g,col,blob,extra={}){const path=await upGarmentPhoto(blob),old=col==='photo'?g.path:g.sidePath;
 try{await dbUpdateGarment(g,{[col]:path,...extra})}catch(e){await sb.storage.from(BUCKET).remove([path]);throw e}
 if(old)await sb.storage.from(BUCKET).remove([old]);
 if(col==='photo'){g.path=path;g.img=photoUrl(path)}else{g.sidePath=path;g.side=photoUrl(path)}}
async function dbDeleteGarment(g){const{data,error}=await sb.from('garments').delete().eq('id',g.id).select('id');if(error)throw gErr(error);if(!data||!data.length)throw noRows();
 const ps=[g.path,g.sidePath].filter(Boolean);if(ps.length)await sb.storage.from(BUCKET).remove(ps)}
