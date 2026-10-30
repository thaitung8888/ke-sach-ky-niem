// Khởi động: chạy sau cùng, khi mọi khu vực đã đăng ký.
document.querySelectorAll('[data-ic]').forEach(b=>b.insertAdjacentHTML('afterbegin',ic(b.dataset.ic)));
applyTime();
drawAdmin();
(async()=>{try{me=await dbUser();drawAdmin()}catch(e){}booted=true;go()})();
