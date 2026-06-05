document.getElementById('yr').textContent=new Date().getFullYear();
var burger=document.getElementById('burger'),drawer=document.getElementById('drawer');
burger.addEventListener('click',function(){var o=drawer.classList.toggle('open');burger.classList.toggle('open',o);});
drawer.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){drawer.classList.remove('open');burger.classList.remove('open');});});
var ro=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');ro.unobserve(e.target);}});},{threshold:.12});
document.querySelectorAll('.reveal').forEach(function(el){ro.observe(el);});
var secs=document.querySelectorAll('section[id]'),links=document.querySelectorAll('.nav a');
window.addEventListener('scroll',function(){var cur='top';secs.forEach(function(s){if(scrollY>=s.offsetTop-innerHeight*0.35)cur=s.id;});links.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+cur);});},{passive:true});

// ── Certificate lightbox
function openCert(src, caption){
  var lb=document.getElementById('lightbox');
  document.getElementById('lightbox-img').src=src;
  document.getElementById('lightbox-cap').textContent=caption;
  lb.classList.add('open');
  document.body.style.overflow='hidden';
}
function closeCert(e){
  // only close when clicking the backdrop or the close button, not the image
  if(e && e.target.id==='lightbox-img') return;
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow='';
}
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeCert();});
