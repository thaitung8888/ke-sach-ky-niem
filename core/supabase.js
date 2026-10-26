// Kết nối Supabase dùng chung cho cả căn phòng: client, đường dẫn ảnh, đăng nhập chủ kệ.
// Quyền thêm/sửa/xóa do luật RLS trên Supabase quyết định (xem supabase-bao-mat.sql), không phải do giao diện.
const sb=supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
const BUCKET='photos';
const photoUrl=p=>sb.storage.from(BUCKET).getPublicUrl(p).data.publicUrl;

// Xóa hoặc sửa bị luật RLS chặn thì Supabase không báo lỗi mà chỉ không đổi dòng nào, nên phải kiểm tra lại.
const noRows=()=>new Error('Chỉ chủ kệ (đã đăng nhập) mới được thay đổi');
// ---------- Đăng nhập: chỉ một tài khoản (chủ kệ), tạo sẵn trong Supabase, đã tắt tự đăng ký ----------
async function dbUser(){const{data}=await sb.auth.getSession();return(data&&data.session&&data.session.user)||null}
async function dbSignIn(email,password){const{data,error}=await sb.auth.signInWithPassword({email,password});
 if(error)throw new Error(/invalid|credentials/i.test(error.message||'')?'Sai email hoặc mật khẩu':error.message);return data.user}
async function dbSignOut(){const{error}=await sb.auth.signOut();if(error)throw error}
const dbOnAuth=cb=>sb.auth.onAuthStateChange((ev,s)=>cb((s&&s.user)||null));
