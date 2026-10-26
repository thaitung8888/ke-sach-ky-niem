// Bộ điều hướng: mỗi khu vực là một <section data-room="ten"> trong index.html, mở bằng đường dẫn #/ten.
// Khi có căn phòng, đổi HOME thành 'phong'. Khu vực mới chỉ cần gọi room('ten',{title,enter,leave}).
const HOME='ke-sach',ROOMS={};let curRoom=null;
function room(name,def){ROOMS[name]=def}
function go(){const want=(location.hash.match(/^#\/([\w-]+)/)||[])[1],name=ROOMS[want]?want:HOME;if(name===curRoom)return;
 if(curRoom&&ROOMS[curRoom].leave)ROOMS[curRoom].leave();curRoom=name;
 document.querySelectorAll('[data-room]').forEach(s=>s.hidden=s.dataset.room!==name);
 document.title=ROOMS[name].title||document.title;if(ROOMS[name].enter)ROOMS[name].enter()}
addEventListener('hashchange',go);
