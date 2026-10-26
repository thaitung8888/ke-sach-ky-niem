// Bộ điều hướng: mỗi khu vực là một <section data-room="ten"> trong index.html, mở bằng đường dẫn #/ten.
// Trang chủ là căn phòng. Khu vực mới chỉ cần gọi room('ten',{title,enter(from),leave(to)}).
const HOME='phong',ROOMS={};let curRoom=null;
function room(name,def){ROOMS[name]=def}
function go(){const want=(location.hash.match(/^#\/([\w-]+)/)||[])[1],name=ROOMS[want]?want:HOME;if(name===curRoom)return;
 const from=curRoom;if(from&&ROOMS[from].leave)ROOMS[from].leave(name);curRoom=name;
 document.querySelectorAll('[data-room]').forEach(s=>s.hidden=s.dataset.room!==name);
 document.title=ROOMS[name].title||document.title;if(ROOMS[name].enter)ROOMS[name].enter(from)}
addEventListener('hashchange',go);
