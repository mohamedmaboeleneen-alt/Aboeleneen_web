(function(){
var K="ae_cart",O="ae_orders",PHONE="201223575271";
function load(k){try{return JSON.parse(localStorage.getItem(k))||[]}catch(e){return[]}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function badge(){var n=load(K).length;document.querySelectorAll(".cartcount").forEach(function(el){el.textContent=n;el.style.display=n?"inline-block":"none"})}
document.addEventListener("click",function(e){
  var b=e.target.closest("[data-add]");if(!b)return;
  var c=load(K),n=b.getAttribute("data-add"),f=c.filter(function(i){return i.name===n})[0];
  if(f){f.qty+=1}else{c.push({name:n,qty:1})}
  save(K,c);badge();var t=b.textContent;b.textContent="تمت الإضافة ✓";setTimeout(function(){b.textContent=t},1200);
});
badge();
var box=document.getElementById("cart");if(!box)return;
var ord=document.getElementById("orders");
function render(){
  var c=load(K);
  if(!c.length){box.innerHTML='<div class="note">السلة فارغة. تصفح <a href="prints.html"><b>المطبوعات</b></a> أو <a href="supplies.html"><b>المستلزمات</b></a> وأضف ما تحتاجه.</div>'}
  else{
    box.innerHTML=c.map(function(i,x){return '<div class="crow"><strong>'+esc(i.name)+'</strong><label>الكمية<input type="number" min="1" value="'+i.qty+'" data-q="'+x+'"></label><button type="button" class="btn btn-line" data-rm="'+x+'">حذف</button></div>'}).join("")+
    '<form id="of" class="ofrm"><label>الاسم<input name="name" required autocomplete="name"></label><label>رقم التليفون<input name="phone" required inputmode="tel" autocomplete="tel"></label><label class="full">ملاحظات<textarea name="note"></textarea></label><button class="btn btn-red full" type="submit">أرسل الطلب عبر واتساب</button></form>';
  }
  var os=load(O);
  ord.innerHTML=os.length?os.map(function(o){return '<article class="oc"><div class="oh"><strong>طلب رقم '+esc(o.id)+'</strong><span class="st">'+esc(o.status)+'</span></div><small>'+esc(o.date)+'</small><ul>'+o.items.map(function(i){return '<li>'+esc(i.name)+' × '+i.qty+'</li>'}).join("")+'</ul></article>'}).join(""):'<div class="note">لا توجد طلبات سابقة على هذا الجهاز.</div>';
}
box.addEventListener("input",function(e){var q=e.target.getAttribute("data-q");if(q===null)return;var c=load(K);c[q].qty=Math.max(1,parseInt(e.target.value,10)||1);save(K,c);badge()});
box.addEventListener("click",function(e){var r=e.target.getAttribute("data-rm");if(r===null)return;var c=load(K);c.splice(r,1);save(K,c);badge();render()});
box.addEventListener("submit",function(e){
  e.preventDefault();var f=e.target,c=load(K);if(!c.length)return;
  var id="AE-"+String(Date.now()).slice(-6),o={id:id,date:new Date().toLocaleDateString("ar-EG"),status:"تم إرسال الطلب",items:c};
  var os=load(O);os.unshift(o);save(O,os);save(K,[]);
  var m="السلام عليكم، طلب رقم "+id+"\nالاسم: "+f.name.value+"\nالتليفون: "+f.phone.value+"\n"+c.map(function(i){return "- "+i.name+" × "+i.qty}).join("\n")+"\nملاحظات: "+(f.note.value||"-");
  window.open("https://wa.me/"+PHONE+"?text="+encodeURIComponent(m),"_blank");
  badge();render();
});
render();
})();
