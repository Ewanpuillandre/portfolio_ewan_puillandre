const projects = window.PORTFOLIO_PROJECTS;
const categories = {film:'Audiovisuel',design:'Graphisme',communication:'Communication',ux:'UX/UI',web:'Développement web'};
const dialog = document.querySelector('#project-dialog');
const content = document.querySelector('#dialog-content');
const cards = [...document.querySelectorAll('.project')];
const buttons = [...document.querySelectorAll('[data-filter]')];
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
let opener = null;
function filterProjects(filter, focus=false) {
  let count=0;
  cards.forEach(card => {card.hidden = !(filter==='all' || (filter==='featured' ? card.dataset.featured==='true' : card.dataset.category===filter));if(!card.hidden)count++;});
  buttons.forEach(button => {const active=button.dataset.filter===filter;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
  document.querySelector('.project-grid').classList.toggle('filtered',filter!=='featured' && filter!=='all');
  document.querySelector('#filter-status').textContent = `${String(count).padStart(2,'0')} projets · ${filter==='featured'?'Pour commencer':filter==='all'?'Tous les domaines':categories[filter]}`;
  document.querySelector('#show-all').hidden=filter==='all';
  if(focus)buttons.find(b=>b.dataset.filter===filter)?.focus({preventScroll:true});
}
buttons.forEach(button => button.addEventListener('click',()=>filterProjects(button.dataset.filter)));
document.querySelector('#show-all').addEventListener('click',()=>{filterProjects('all',true);document.querySelector('#projets').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});
filterProjects('featured');
function showProject(id) {
  const p=projects.find(project=>project.id===id);if(!p)return;
  content.querySelectorAll('video,audio').forEach(v=>v.pause());content.replaceChildren();
  const e=escapeHTML;
  const media=p.video?`<figure class="case-film"><video controls playsinline preload="metadata" poster="${e(p.images[0])}" aria-label="${e(p.title)}"><source src="${e(p.video)}" type="video/mp4">Votre navigateur ne permet pas de lire cette vidéo.</video><figcaption>${e(p.subtitle)} · Lecture à la demande</figcaption></figure>`:'';
  const galleryItems=(!p.video?p.images:[]).map((src,i)=>`<figure class="case-visual"><a href="${e(src)}" target="_blank" rel="noopener" aria-label="Agrandir le visuel ${i+1} de ${e(p.title)}"><img src="${e(src)}" alt="${e(p.title)} — ${i===0?'livrable présenté':'extrait '+(i+1)}" loading="lazy"></a><figcaption>${i===0?'Le projet en images':'Extrait du travail de conception'} <span>Ouvrir en grand ↗</span></figcaption></figure>`);
  const links=(p.demo?`<a class="button primary" href="${e(p.demo)}" target="_blank" rel="noopener">Explorer la démonstration <span>↗</span></a>`:'')+(p.figma?`<a class="button primary" href="${e(p.figma)}" target="_blank" rel="noopener">Voir la maquette Figma <span>↗</span></a>`:'');
  content.innerHTML=`<p class="eyebrow">${e(categories[p.category])} / Projet ${String(projects.indexOf(p)+1).padStart(2,'0')}</p><h2 id="dialog-title">${e(p.title)}</h2><p class="case-intro">${e(p.intro)}</p><div class="tags case-tags">${p.tags.map(tag=>`<span>${e(tag)}</span>`).join('')}</div>${media}${!p.video?`<div class="case-gallery case-lead">${galleryItems[0]||''}</div>`:''}<div class="case-section"><h3>Ma contribution</h3><p>${e(p.role)}</p></div><div class="case-section"><h3>La démarche</h3><p>${e(p.steps)}</p></div><div class="case-section"><h3>Le livrable</h3><p>${e(p.delivery)}</p></div>${links?`<div class="case-actions">${links}</div>`:''}<div class="case-gallery">${galleryItems.slice(1).join('')}</div><p class="detail-note">${e(p.credit)}</p><div class="case-next"><span>Continuer la découverte</span><a href="#projet/${projects[(projects.indexOf(p)+1)%projects.length].id}" data-project="${projects[(projects.indexOf(p)+1)%projects.length].id}">${e(projects[(projects.indexOf(p)+1)%projects.length].title)} ↗</a></div>`;
  if(!dialog.open){dialog.showModal();document.body.classList.add('modal-open');}
  dialog.scrollTop=0;document.querySelector('.close-dialog').focus({preventScroll:true});
}
function closeProject(){dialog.querySelectorAll('video,audio').forEach(v=>v.pause());dialog.close();document.body.classList.remove('modal-open');if(location.hash.startsWith('#projet/'))history.replaceState(null,'',location.pathname+location.search+'#projets');opener?.focus({preventScroll:true});}
document.addEventListener('click',event=>{const link=event.target.closest('[data-project]');if(link){event.preventDefault();if(!dialog.open)opener=link;const hash='#projet/'+link.dataset.project;if(location.hash!==hash)location.hash=hash;else showProject(link.dataset.project);}});
document.querySelector('.close-dialog').addEventListener('click',closeProject);
dialog.addEventListener('cancel',event=>{event.preventDefault();closeProject();});
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeProject();}});
function route(){if(location.hash.startsWith('#projet/'))showProject(decodeURIComponent(location.hash.slice(8)));else if(dialog.open)closeProject();}
addEventListener('hashchange',route);route();
document.querySelector('.copy-email').addEventListener('click',async()=>{try{await navigator.clipboard.writeText('ewan.puillandre@gmail.com');document.querySelector('#copy-status').textContent='Adresse copiée !';}catch{document.querySelector('#copy-status').textContent='ewan.puillandre@gmail.com';}});
