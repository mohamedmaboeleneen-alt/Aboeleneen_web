(function(){
var K="ae_cart",O="ae_orders",PHONE="201223575271",MINQ=1000;
function load(k){try{return JSON.parse(localStorage.getItem(k))||[]}catch(e){return[]}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function cart(){return load(K).map(function(i){i.qty=Math.max(MINQ,parseInt(i.qty,10)||MINQ);return i})}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function badge(){var n=cart().length;document.querySelectorAll(".cartcount").forEach(function(el){el.textContent=n;el.style.display=n?"inline-block":"none"})}
document.addEventListener("click",function(e){
  var b=e.target.closest("[data-add]");if(!b)return;
  var c=cart(),n=b.getAttribute("data-add"),f=c.filter(function(i){return i.name===n})[0],msg="تمت الإضافة ✓";
  if(f){msg="موجود في السلة ✓"}else{c.push({name:n,qty:MINQ})}
  save(K,c);badge();var t=b.textContent;b.textContent=msg;setTimeout(function(){b.textContent=t},1200);
});
badge();
var mb=document.getElementById("menubtn"),nv=document.getElementById("mainnav");
if(mb&&nv){
  mb.addEventListener("click",function(){var o=nv.classList.toggle("open");mb.setAttribute("aria-expanded",o);mb.textContent=o?"✕":"☰"});
  nv.addEventListener("click",function(e){if(e.target.closest("a")){nv.classList.remove("open");mb.setAttribute("aria-expanded",false);mb.textContent="☰"}});
}
var box=document.getElementById("cart");if(!box)return;
var ord=document.getElementById("orders");
function render(){
  var c=cart();
  if(!c.length){box.innerHTML='<div class="note">السلة فارغة. تصفح <a href="prints.html"><b>المطبوعات</b></a> أو <a href="supplies.html"><b>المستلزمات</b></a> وأضف ما تحتاجه.</div>'}
  else{
    box.innerHTML=c.map(function(i,x){return '<div class="crow"><strong>'+esc(i.name)+'</strong><label>الكمية<input type="number" min="1000" step="100" value="'+i.qty+'" data-q="'+x+'"></label><button type="button" class="btn btn-line" data-rm="'+x+'">حذف</button></div>'}).join("")+
    '<form id="of" class="ofrm"><label>الاسم<input name="name" required autocomplete="name"></label><label>رقم التليفون<input name="phone" required inputmode="tel" autocomplete="tel"></label><label class="full">ملاحظات<textarea name="note"></textarea></label><button class="btn btn-red full" type="submit">أرسل الطلب عبر واتساب</button></form>';
  }
  var os=load(O);
  ord.innerHTML=os.length?os.map(function(o){return '<article class="oc"><div class="oh"><strong>طلب رقم '+esc(o.id)+'</strong><span class="st">'+esc(o.status)+'</span></div><small>'+esc(o.date)+'</small><ul>'+o.items.map(function(i){return '<li>'+esc(i.name)+' × '+i.qty+'</li>'}).join("")+'</ul></article>'}).join(""):'<div class="note">لا توجد طلبات سابقة على هذا الجهاز.</div>';
}
box.addEventListener("input",function(e){var q=e.target.getAttribute("data-q");if(q===null)return;var c=cart();c[q].qty=Math.max(MINQ,parseInt(e.target.value,10)||MINQ);save(K,c);badge()});
box.addEventListener("click",function(e){var r=e.target.getAttribute("data-rm");if(r===null)return;var c=cart();c.splice(r,1);save(K,c);badge();render()});
box.addEventListener("submit",function(e){
  e.preventDefault();var f=e.target,c=cart();if(!c.length)return;
  var id="AE-"+String(Date.now()).slice(-6),o={id:id,date:new Date().toLocaleDateString("ar-EG"),status:"تم إرسال الطلب",items:c};
  var os=load(O);os.unshift(o);save(O,os);save(K,[]);
  var m="السلام عليكم، طلب رقم "+id+"\nالاسم: "+f.name.value+"\nالتليفون: "+f.phone.value+"\n"+c.map(function(i){return "- "+i.name+" × "+i.qty}).join("\n")+"\nملاحظات: "+(f.note.value||"-");
  window.open("https://wa.me/"+PHONE+"?text="+encodeURIComponent(m),"_blank");
  badge();render();
});
render();
})();
