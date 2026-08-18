document.addEventListener('DOMContentLoaded',()=>{
  const body=document.body;
  const header=document.querySelector('.site-header');
  const menu=document.querySelector('.menu-btn');
  const nav=document.querySelector('.site-nav');
  const onScroll=()=>header?.classList.toggle('scrolled',window.scrollY>18);
  onScroll();window.addEventListener('scroll',onScroll,{passive:true});

  menu?.addEventListener('click',()=>{
    const open=body.classList.toggle('nav-open');
    menu.setAttribute('aria-expanded',String(open));
  });
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    body.classList.remove('nav-open');
    menu?.setAttribute('aria-expanded','false');
  }));
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      body.classList.remove('nav-open');
      menu?.setAttribute('aria-expanded','false');
      closeLightbox();
    }
  });

  const revealEls=document.querySelectorAll('[data-reveal]');
  if('IntersectionObserver' in window){
    const obs=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('revealed');obs.unobserve(entry.target)}
    }),{threshold:.12});
    revealEls.forEach(el=>obs.observe(el));
  }else revealEls.forEach(el=>el.classList.add('revealed'));

  const lightbox=document.querySelector('.lightbox');
  const lightboxImg=lightbox?.querySelector('img');
  const closeBtn=lightbox?.querySelector('.lightbox__close');
  function closeLightbox(){
    if(!lightbox)return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
    if(lightboxImg)lightboxImg.removeAttribute('src');
  }
  document.querySelectorAll('.gallery-item img').forEach(img=>{
    img.parentElement?.addEventListener('click',()=>{
      if(!lightbox||!lightboxImg)return;
      lightboxImg.src=img.currentSrc||img.src;
      lightboxImg.alt=img.alt||'Subcon project image';
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden','false');
      closeBtn?.focus();
    });
  });
  closeBtn?.addEventListener('click',closeLightbox);
  lightbox?.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});

  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
});
