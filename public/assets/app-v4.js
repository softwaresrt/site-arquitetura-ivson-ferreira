(()=>{'use strict';
const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const header=$('.site-header');const trigger=$('.menu-trigger');const panel=$('.mobile-panel');if(panel)panel.inert=true;const progress=$('.reading-progress');
const journey=$('.journey'), phaseLabel=$('[data-phase-label]'), phaseNumber=$('[data-phase-number]'), journeyBar=$('.journey-progress span');
const phases=['Concepção','Estrutura','Materialidade','Espaço','Arquitetura'];let previousPhase=-1;
function onScroll(){
  const y=window.scrollY;
  const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
  // Read scroll geometry before any DOM writes; skip costly journey calculations away from view.
  let pct=null;
  if(journey){
    const rect=journey.getBoundingClientRect();
    if(rect.bottom>-innerHeight && rect.top<innerHeight*2){
      const total=Math.max(1,journey.offsetHeight-innerHeight);
      if(innerWidth<=700){
        const range=rect.height+innerHeight;
        pct=Math.max(0,Math.min(1,(innerHeight-rect.top)/range));
      } else {
        // Inicia suavemente pouca coisa antes de encaixar/travar no topo do bloco 3
        const lead=Math.min(innerHeight*0.35,280);
        const totalWithLead=total+lead;
        pct=Math.max(0,Math.min(1,(lead-rect.top)/totalWithLead));
      }
    }
  }
  header?.classList.toggle('scrolled',y>35);
  if(progress)progress.style.transform='scaleX('+(Math.min(1,y/max)).toFixed(5)+')';
  if(pct!==null){
    window.__ivsonProgress=pct;
    window.dispatchEvent(new CustomEvent('ivson3dprogress',{detail:pct}));
    const id=Math.min(4,Math.floor(pct*5));
    if(id!==previousPhase){if(phaseLabel)phaseLabel.textContent=phases[id];if(phaseNumber)phaseNumber.textContent='0'+(id+1);previousPhase=id}
    if(journeyBar)journeyBar.style.transform='scaleX('+pct.toFixed(4)+')';
  }
}
let raf=false;addEventListener('scroll',()=>{if(raf)return;raf=true;requestAnimationFrame(()=>{onScroll();raf=false})},{passive:true});addEventListener('resize',onScroll,{passive:true});onScroll();
function toggleMenu(force){const open=typeof force==='boolean'?force:!panel.classList.contains('open');panel.classList.toggle('open',open);header.classList.toggle('panel-open',open);trigger.classList.toggle('active',open);trigger.setAttribute('aria-expanded',String(open));panel.setAttribute('aria-hidden',String(!open));panel.inert=!open;document.body.style.overflow=open?'hidden':''}
trigger?.addEventListener('click',()=>toggleMenu());$$('.mobile-panel a').forEach(a=>a.addEventListener('click',()=>toggleMenu(false)));addEventListener('keydown',e=>{if(e.key==='Escape')toggleMenu(false)});
// Entrance animations are now triggered near the viewport by GSAP ScrollTrigger.
// Images are readable by default until the animation library has initialized.
// Motion now managed by /src/main.jsx (GSAP + Lenis, bundled by Vite).
// Lazy-load the WebGL scene early as the section approaches the viewport.
let threeLoaded=false;const section=$('.journey');if(section){const mo=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)&&!threeLoaded){threeLoaded=true;import('/assets/architecture-3d-v4.js').catch(err=>{console.warn('3D indisponível, mantendo representação estática.',err);section.classList.add('no-webgl')});mo.disconnect()}},{rootMargin:'800px'});mo.observe(section)}
// Portfolio filters: categories are descriptive visual groupings, not invented project credentials.
const filters=$$('[data-filter]');filters.forEach(btn=>btn.addEventListener('click',()=>{filters.forEach(x=>{x.classList.remove('active');x.setAttribute('aria-pressed','false')});btn.classList.add('active');btn.setAttribute('aria-pressed','true');let key=btn.dataset.filter;$$('[data-category]').forEach(card=>{const visible=key==='todos'||card.dataset.category===key;card.hidden=!visible;card.style.display=visible?'':'none'})}));
// Contact uses real Vercel serverless endpoint; never reports success if not configured.
const form=$('#contact-form');if(form){const feedback=$('#form-feedback');form.addEventListener('submit',async e=>{e.preventDefault();if(!form.checkValidity()){form.reportValidity();feedback.textContent='Confira os campos obrigatórios antes de enviar.';feedback.className='form-feedback error';return}feedback.textContent='Enviando sua mensagem…';feedback.className='form-feedback';const btn=form.querySelector('[type=submit]');btn.disabled=true;const data=Object.fromEntries(new FormData(form).entries());try{const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});let result=await response.json();if(!response.ok)throw new Error(result.error||'Não foi possível enviar.');feedback.className='form-feedback success';feedback.textContent='Mensagem enviada. Obrigado por entrar em contato!';form.reset()}catch(err){feedback.className='form-feedback error';feedback.textContent=err.message+' Você também pode usar o link de contato oficial.'}finally{btn.disabled=false}})}
// Make project cards keyboard/focus accessible: cursor decoration is optional.
})();
