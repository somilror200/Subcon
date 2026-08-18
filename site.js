document.addEventListener('DOMContentLoaded',()=>{
  const body=document.body;
  const header=document.querySelector('.site-header');
  const menu=document.querySelector('.menu-btn');
  const nav=document.querySelector('.site-nav');
  const brand=document.querySelector('.brand');
  const mobileNav=window.matchMedia('(max-width:1050px)');
  let menuReturnFocus=null;

  const onScroll=()=>{
    if(!header||body.classList.contains('nav-open'))return;
    header.classList.toggle('scrolled',window.scrollY>18);
  };

  const clearMobileNavStyles=()=>{
    if(!nav)return;
    ['position','top','right','bottom','left','width','height','min-height','max-height','overflow-y','overscroll-behavior','justify-content','padding-top','padding-right','padding-bottom','padding-left','z-index','-webkit-overflow-scrolling'].forEach(prop=>nav.style.removeProperty(prop));
  };

  const prepareMobileNav=()=>{
    if(!nav||!mobileNav.matches)return;
    if(header)header.classList.remove('scrolled');
    nav.style.position='fixed';
    nav.style.top='0';
    nav.style.right='0';
    nav.style.bottom='auto';
    nav.style.left='0';
    nav.style.width='100vw';
    nav.style.height='100dvh';
    nav.style.minHeight='100vh';
    nav.style.maxHeight='none';
    nav.style.overflowY='auto';
    nav.style.overscrollBehavior='contain';
    nav.style.justifyContent='flex-start';
    nav.style.paddingTop='calc(96px + env(safe-area-inset-top, 0px))';
    nav.style.paddingRight='max(var(--pad), env(safe-area-inset-right, 0px))';
    nav.style.paddingBottom='calc(24px + env(safe-area-inset-bottom, 0px))';
    nav.style.paddingLeft='max(var(--pad), env(safe-area-inset-left, 0px))';
    nav.style.zIndex='1';
    nav.style.webkitOverflowScrolling='touch';
  };

  const setClosedNavA11y=()=>{
    if(!nav)return;
    if(mobileNav.matches){
      nav.setAttribute('aria-hidden','true');
      nav.inert=true;
    }else{
      nav.removeAttribute('aria-hidden');
      nav.inert=false;
    }
  };

  const closeMenu=(returnFocus=false)=>{
    if(!nav||!menu)return;
    const wasOpen=body.classList.contains('nav-open');
    body.classList.remove('nav-open');
    menu.setAttribute('aria-expanded','false');
    menu.setAttribute('aria-label','Open navigation');
    setClosedNavA11y();
    clearMobileNavStyles();
    onScroll();
    if(returnFocus&&wasOpen&&menuReturnFocus instanceof HTMLElement)menuReturnFocus.focus();
  };

  const openMenu=()=>{
    if(!nav||!menu||!mobileNav.matches)return;
    closeLightbox(false);
    menuReturnFocus=document.activeElement;
    prepareMobileNav();
    nav.inert=false;
    nav.setAttribute('aria-hidden','false');
    body.classList.add('nav-open');
    menu.setAttribute('aria-expanded','true');
    menu.setAttribute('aria-label','Close navigation');
    requestAnimationFrame(()=>nav.querySelector('a')?.focus());
  };

  onScroll();
  window.addEventListener('scroll',onScroll,{passive:true});
  menu?.setAttribute('type','button');
  menu?.setAttribute('aria-label','Open navigation');
  setClosedNavA11y();

  menu?.addEventListener('click',()=>{
    body.classList.contains('nav-open')?closeMenu(true):openMenu();
  });

  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeMenu(false)));
  brand?.addEventListener('click',()=>closeMenu(false));

  const handleViewportChange=()=>{
    if(!mobileNav.matches){
      closeMenu(false);
      nav?.removeAttribute('aria-hidden');
      if(nav)nav.inert=false;
    }else if(body.classList.contains('nav-open')){
      prepareMobileNav();
    }else{
      setClosedNavA11y();
    }
  };
  window.addEventListener('resize',handleViewportChange,{passive:true});
  mobileNav.addEventListener?.('change',handleViewportChange);

  const revealEls=document.querySelectorAll('[data-reveal]');
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if('IntersectionObserver' in window&&!reducedMotion){
    const obs=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('revealed');obs.unobserve(entry.target)}
    }),{threshold:.08,rootMargin:'0px 0px -24px'});
    revealEls.forEach(el=>obs.observe(el));
  }else revealEls.forEach(el=>el.classList.add('revealed'));

  const lightbox=document.querySelector('.lightbox');
  const lightboxImg=lightbox?.querySelector('img');
  const closeBtn=lightbox?.querySelector('.lightbox__close');
  const galleryItems=Array.from(document.querySelectorAll('.gallery-item'));
  let lightboxIndex=-1;
  let lightboxReturnFocus=null;
  let previousBodyOverflow='';

  const showLightboxImage=index=>{
    if(!lightboxImg||!galleryItems.length)return;
    lightboxIndex=(index+galleryItems.length)%galleryItems.length;
    const img=galleryItems[lightboxIndex].querySelector('img');
    if(!img)return;
    lightboxImg.src=img.currentSrc||img.src;
    lightboxImg.alt=img.alt||'Subcon project image';
  };

  function closeLightbox(returnFocus=true){
    if(!lightbox||!lightbox.classList.contains('open'))return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
    if(lightboxImg)lightboxImg.removeAttribute('src');
    body.style.overflow=previousBodyOverflow;
    if(returnFocus&&lightboxReturnFocus instanceof HTMLElement)lightboxReturnFocus.focus();
  }

  const openLightbox=index=>{
    if(!lightbox||!lightboxImg||!galleryItems.length)return;
    closeMenu(false);
    lightboxReturnFocus=document.activeElement;
    previousBodyOverflow=body.style.overflow;
    showLightboxImage(index);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
    body.style.overflow='hidden';
    closeBtn?.focus();
  };

  galleryItems.forEach((item,index)=>{
    const img=item.querySelector('img');
    item.setAttribute('role','button');
    item.setAttribute('tabindex','0');
    item.setAttribute('aria-label',`View ${img?.alt||`project image ${index+1}`}`);
    item.addEventListener('click',()=>openLightbox(index));
    item.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){e.preventDefault();openLightbox(index)}
    });
  });

  closeBtn?.setAttribute('type','button');
  closeBtn?.addEventListener('click',()=>closeLightbox(true));
  lightbox?.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox(true)});

  document.addEventListener('keydown',e=>{
    if(lightbox?.classList.contains('open')){
      if(e.key==='Escape'){e.preventDefault();closeLightbox(true)}
      else if(e.key==='ArrowLeft'){e.preventDefault();showLightboxImage(lightboxIndex-1)}
      else if(e.key==='ArrowRight'){e.preventDefault();showLightboxImage(lightboxIndex+1)}
      else if(e.key==='Tab'&&closeBtn){e.preventDefault();closeBtn.focus()}
      return;
    }
    if(e.key==='Escape'&&body.classList.contains('nav-open')){
      e.preventDefault();closeMenu(true);
    }
  });

  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
});
