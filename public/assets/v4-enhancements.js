/* V4 - progressive enhancement, zero blocking network requests, no continuous render loop. */
(()=>{'use strict';
const ready=(fn)=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
ready(()=>{
  // Custom accessible select: native select remains the only data source for FormData.
  const native=document.querySelector('#contact-form select#tipo');
  if(native){
    const root=document.createElement('div');root.className='project-select';
    native.parentNode.insertBefore(root,native);root.append(native);
    const trigger=document.createElement('button');trigger.className='project-select-trigger';trigger.type='button';trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-label','Selecionar tipo de projeto');
    const label=document.createElement('span');label.className='project-select-label';
    const chevron=document.createElementNS('http://www.w3.org/2000/svg','svg');chevron.setAttribute('viewBox','0 0 24 24');chevron.setAttribute('fill','none');chevron.setAttribute('stroke','currentColor');chevron.setAttribute('stroke-width','1.8');chevron.classList.add('project-select-chevron');chevron.innerHTML='<path d="m5 9 7 7 7-7"/>';
    trigger.append(label,chevron);
    const panel=document.createElement('div');panel.className='project-select-panel';panel.setAttribute('role','listbox');panel.id='tipo-opcoes';panel.setAttribute('aria-label','Tipo de projeto');panel.hidden=true;
    trigger.setAttribute('aria-controls',panel.id);
    const options=Array.from(native.options).filter(o=>o.value!=='');let highlight=0;
    const buttons=options.map((o,i)=>{
      const item=document.createElement('button');item.type='button';item.className='project-select-option';item.setAttribute('role','option');item.setAttribute('aria-selected','false');item.setAttribute('data-highlight','false');item.setAttribute('tabindex','-1');item.dataset.value=o.value;item.innerHTML=`<span></span><span class="project-select-check" aria-hidden="true">✓</span>`;item.firstElementChild.textContent=o.textContent.trim();
      item.addEventListener('click',()=>{native.value=o.value;native.dispatchEvent(new Event('change',{bubbles:true}));sync();close(true)});
      item.addEventListener('pointerenter',()=>{highlight=i;setHighlight()});
      panel.append(item);return item;
    });
    root.append(trigger,panel);root.classList.add('project-select--enhanced');
    const setHighlight=()=>buttons.forEach((b,i)=>b.dataset.highlight=String(i===highlight));
    const sync=()=>{
      const selected=native.selectedOptions[0];label.textContent=native.value?selected.textContent.trim():'Selecione uma opção';
      trigger.dataset.empty=String(!native.value);
      buttons.forEach(b=>b.setAttribute('aria-selected',String(b.dataset.value===native.value)));
    };
    const open=()=>{panel.hidden=false;root.classList.add('project-select--open');trigger.setAttribute('aria-expanded','true');highlight=Math.max(0,options.findIndex(o=>o.value===native.value));setHighlight();buttons[highlight]?.focus({preventScroll:true})};
    const close=(focus=false)=>{panel.hidden=true;root.classList.remove('project-select--open');trigger.setAttribute('aria-expanded','false');if(focus)trigger.focus({preventScroll:true})};
    trigger.addEventListener('click',()=>panel.hidden?open():close(true));
    root.addEventListener('keydown',e=>{
      const openPanel=!panel.hidden;
      if(e.key==='Escape' && openPanel){e.preventDefault();close(true);return}
      if(e.key==='Tab'){close();return}
      if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){
        e.preventDefault();if(!openPanel){open();return}
        if(e.key==='Home')highlight=0;else if(e.key==='End')highlight=buttons.length-1;
        else highlight=(highlight+(e.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length;
        setHighlight();buttons[highlight]?.focus({preventScroll:true});
      }
      if((e.key==='Enter'||e.key===' ') && openPanel && document.activeElement!==trigger){e.preventDefault();buttons[highlight]?.click()}
    });
    document.addEventListener('pointerdown',e=>{if(!root.contains(e.target)&&!panel.hidden)close()},{passive:true});
    native.addEventListener('change',sync);
    native.form?.addEventListener('reset',()=>requestAnimationFrame(sync));
    sync();
  }
  // Mouse-only interaction: material sculpture is CSS 3D (GPU-friendly), not WebGL or scroll-linked.
  const stage=document.querySelector('.story-transition--material');
  if(stage && matchMedia('(pointer: fine) and (min-width: 701px) and (prefers-reduced-motion: no-preference)').matches){
    const sculpture=stage.querySelector('.sculpture-3d');let request=0, x=0,y=0;
    const move=e=>{
      const bounds=stage.getBoundingClientRect();x=((e.clientX-bounds.left)/bounds.width-.5)*21;y=((e.clientY-bounds.top)/bounds.height-.5)*-15;
      if(!request)request=requestAnimationFrame(()=>{sculpture?.style.setProperty('--tilt-x',x.toFixed(2)+'deg');sculpture?.style.setProperty('--tilt-y',y.toFixed(2)+'deg');request=0})
    };
    stage.addEventListener('pointermove',move,{passive:true});
    stage.addEventListener('pointerleave',()=>{sculpture?.style.setProperty('--tilt-x','0deg');sculpture?.style.setProperty('--tilt-y','0deg')});
  }
});
})();
