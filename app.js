"use strict";
const paths={
 home:'<path d="m3 10 9-7 9 7v10H15v-7H9v7H3z"/>',
 book:'<path d="M12 6C9 3 5 3 2 4v16c4-1 7-1 10 1 3-2 6-2 10-1V4c-3-1-7-1-10 2zm0 0v15"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18M8 15h2M14 15h2"/>',
 chart:'<path d="M4 3v18h17M8 16v-5M13 16V7M18 16V4"/>',
 headphones:'<path d="M4 14v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="12" width="4" height="8" rx="2"/><rect x="17" y="12" width="4" height="8" rx="2"/>',
 pen:'<path d="m16 3 5 5-12 12-6 1 1-6zM13 6l5 5"/>',
 mic:'<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 pin:'<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0z"/><circle cx="12" cy="10" r="2"/>',
 close:'<path d="m6 6 12 12M18 6 6 18"/>',check:'<path d="m5 12 4 4 10-10"/>',
 play:'<path d="m9 5 11 7-11 7z"/>',stop:'<rect x="6" y="6" width="12" height="12" rx="1"/>',
 people:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M17 5a3 3 0 0 1 0 6M21 21v-3a5 5 0 0 0-4-5"/>',
 arrow:'<path d="M4 12h16m-5-5 5 5-5 5"/>',alert:'<path d="m12 3 10 18H2zM12 9v5m0 3v1"/>',
 quiz:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="m7 9 1 1 2-3m-3 9 1 1 2-3m3-5h4m-4 7h4"/>',
 menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',download:'<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>'
};
const icon=name=>'<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+(paths[name]||paths.book)+'</svg>';
const esc=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const $=selector=>document.querySelector(selector);
const skills={
 reading:{name:"Lectura",full:"Comprensión de lectura",icon:"book",mins:6},
 listening:{name:"Escucha",full:"Comprensión auditiva",icon:"headphones",mins:5},
 quiz:{name:"Quiz",full:"Conectores y comunicación",icon:"quiz",mins:3},
 writing:{name:"Escritura",full:"Expresión escrita",icon:"pen",mins:10},
 speaking:{name:"Práctica oral",full:"Expresión oral",icon:"mic",mins:3}
};
const COURSES=window.COURSES,LEVEL_OUTLINES=window.LEVEL_OUTLINES,LEARNERS=window.DEMO_LEARNERS;
const allUnits=Object.values(COURSES).flat();
const findUnit=id=>allUnits.find(u=>u.id===id);
const skillIds=u=>["reading","listening",...(u.quiz?["quiz"]:[]),"writing","speaking"];
const keyOf=(unit,skill)=>(typeof unit==="string"?unit:unit.id)+"_"+skill;
const STORAGE_KEY="miltu-udla-academic-v2";
function isoDays(days){const d=new Date();d.setDate(d.getDate()+days);return d.toISOString();}
function seedState(){
 const results={};
 COURSES.B1.slice(0,2).forEach((u,i)=>skillIds(u).forEach(s=>{
  results[keyOf(u,s)]={at:isoDays(-3+i),demo:true};
  if(s==="reading"||s==="listening"){
   const task=u[s],score=s==="reading"?3-i:2-i;
   results[keyOf(u,s)]={...results[keyOf(u,s)],score,total:3,answers:task.questions.map((q,j)=>j<score?q.answer:(q.answer+1)%q.options.length)};
  }
  if(s==="writing")results[keyOf(u,s)].text=u.writing.model;
 }));
 return {version:2,level:"B1",pathway:"intensive",results,drafts:{},assignments:[
  {id:"seed-alex",learner:"alex",unit:"b1-3",skill:"listening",due:isoDays(2).slice(0,10),note:"Escucha dos veces: primero identifica el cambio y después busca los detalles.",at:isoDays(-1)},
  {id:"seed-liam",learner:"liam",unit:"b1-1",skill:"listening",due:isoDays(2).slice(0,10),note:"Distingue el plan inicial del cambio anunciado.",at:isoDays(-1)},
  {id:"seed-amelia",learner:"amelia",unit:"b1-3",skill:"writing",due:isoDays(3).slice(0,10),note:"Organiza tu respuesta y añade una razón a cada propuesta.",at:isoDays(-1)}
 ],submissions:[
  {id:"seed-reviewed-alex",learner:"alex",unit:"b1-1",level:"B1",text:COURSES.B1[0].writing.model,status:"reviewed",feedback:"Tu mensaje presenta una necesidad concreta y organiza las preguntas con claridad. En la próxima práctica, conecta cada petición con su motivo.",rubric:{content:"covered",organisation:"covered",clarity:"covered"},at:isoDays(-3),demo:true},
  {id:"seed-review-alex",learner:"alex",unit:"b1-2",level:"B1",text:COURSES.B1[1].writing.model,status:"pending",feedback:"",rubric:{},at:isoDays(-1),demo:true},
  {id:"seed-review-emma",learner:"emma",unit:"a2-2",level:"A2",text:"Hola, Marta. Quiero ir al taller de cocina porque me gusta probar platos nuevos. Podemos encontrarnos el jueves a las seis en la entrada. Lleva un cuaderno para anotar las recetas. Después podemos tomar un café y hablar de nuestra semana. Me parece una buena oportunidad para conocer a otros estudiantes. ¿Quieres venir conmigo? Espero tu respuesta. Un abrazo, Emma.",status:"pending",feedback:"",rubric:{},at:isoDays(-1),demo:true},
  {id:"seed-review-liam",learner:"liam",unit:"b1-1",level:"B1",text:"Estimado equipo: Soy Liam y voy a estudiar en Quito. Quiero información sobre el alojamiento. Me gusta la residencia porque está cerca. Necesito saber el precio y si hay internet. Voy a llegar en agosto. También me interesa conocer cómo puedo pagar el depósito. Gracias por su ayuda.",status:"pending",feedback:"",rubric:{},at:isoDays(-2),demo:true}
 ],mockResults:[]};
}
let storageAvailable=true;
function loadState(){
 const base=seedState();
 try{
  const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");
  if(!saved||saved.version!==2)return base;
  if(["A2","B1"].includes(saved.level))base.level=saved.level;
  if(["intensive","dele"].includes(saved.pathway))base.pathway=saved.pathway;
  if(saved.results&&typeof saved.results==="object"){
   base.results={};
   for(const u of allUnits)for(const s of skillIds(u)){
    const k=keyOf(u,s),r=saved.results[k];
    if(!r||!Number.isFinite(Date.parse(r.at)))continue;
    const clean={at:r.at,demo:r.demo===true};
    if(u[s].questions){
     const n=u[s].questions.length;
     if(!Number.isInteger(r.score)||r.score<0||r.score>n)continue;
     clean.score=r.score;clean.total=n;
     if(Array.isArray(r.answers)&&r.answers.length===n&&r.answers.every((v,i)=>Number.isInteger(v)&&v>=0&&v<u[s].questions[i].options.length))clean.answers=r.answers;
    }
    if(s==="writing")clean.text=String(r.text||"").slice(0,8000);
    if(s==="speaking")clean.mode=r.mode==="recorded"?"recorded":"aloud";
    base.results[k]=clean;
   }
  }
  if(saved.drafts&&typeof saved.drafts==="object")for(const u of allUnits)if(typeof saved.drafts[u.id]==="string")base.drafts[u.id]=saved.drafts[u.id].slice(0,8000);
  if(Array.isArray(saved.assignments))base.assignments=saved.assignments.filter(a=>a&&LEARNERS.some(l=>l.id===a.learner)&&findUnit(a.unit)&&skillIds(findUnit(a.unit)).includes(a.skill)&&Number.isFinite(Date.parse(a.at))).slice(-150).map(a=>({id:String(a.id),learner:a.learner,unit:a.unit,skill:a.skill,due:/^\d{4}-\d{2}-\d{2}$/.test(a.due)&&Number.isFinite(Date.parse(a.due+"T12:00:00"))?a.due:isoDays(2).slice(0,10),note:String(a.note||"").slice(0,1000),at:a.at}));
  if(Array.isArray(saved.submissions))base.submissions=saved.submissions.filter(s=>s&&/^[a-zA-Z0-9_-]{1,100}$/.test(s.id)&&LEARNERS.some(l=>l.id===s.learner)&&findUnit(s.unit)&&Number.isFinite(Date.parse(s.at))).slice(-100).map(s=>({id:String(s.id),learner:s.learner,unit:s.unit,level:findUnit(s.unit).id.startsWith("a2")?"A2":"B1",text:String(s.text||"").slice(0,8000),status:["pending","reviewed","revise"].includes(s.status)?s.status:"pending",feedback:String(s.feedback||"").slice(0,3000),rubric:s.rubric&&typeof s.rubric==="object"?s.rubric:{},at:s.at,demo:s.demo===true}));
  if(Array.isArray(saved.mockResults))base.mockResults=saved.mockResults.filter(r=>r&&["A2","B1"].includes(r.level)&&Number.isInteger(r.score)&&r.score>=0&&r.score<=6&&Number.isFinite(Date.parse(r.at))).slice(-30).map(r=>({level:r.level,score:r.score,total:6,at:r.at}));
 }catch{storageAvailable=false;}
 return base;
}
let state=loadState(),role="student",view="home",activePractice=null,activeMock=null,selectedReview=null;
let teacherFilters={search:"",level:"all",attention:"all"},reviewFilter="pending";
let recorder=null,mediaStream=null,recordingUrl=null,practiceTimer=null,mockTimer=null,toastTimer=null;
function persist(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch{storageAvailable=false;}}
function toast(message){$("#toast").textContent=message;$("#toast").classList.add("visible");clearTimeout(toastTimer);toastTimer=setTimeout(()=>$("#toast").classList.remove("visible"),3800);}
const result=(u,s)=>state.results[keyOf(u,s)];
const completed=u=>skillIds(u).filter(s=>result(u,s)).length;
function courseStats(level=state.level){
 const total=COURSES[level].reduce((n,u)=>n+skillIds(u).length,0);
 const done=COURSES[level].reduce((n,u)=>n+completed(u),0);
 return {total,done,pct:Math.round(done/total*100)};
}
function nextSkill(unit){return skillIds(unit).find(s=>!result(unit,s))||skillIds(unit)[0];}
function currentUnit(){return COURSES[state.level].find(u=>completed(u)<skillIds(u).length)||COURSES[state.level].at(-1);}
const skillBadge=s=>'<span class="skill-icon '+s+'">'+icon(skills[s].icon)+'</span>';
const practiceButton=(u,s,label="Practicar",cls="button secondary small")=>'<button class="'+cls+'" data-action="practice" data-unit="'+u.id+'" data-skill="'+s+'">'+esc(label)+'</button>';
const pill=(label,tone="")=>'<span class="pill '+tone+'">'+esc(label)+'</span>';
function progressBar(value,tone="",label="Progreso"){return '<div class="bar '+tone+'" role="progressbar" aria-label="'+esc(label)+'" aria-valuenow="'+value+'" aria-valuemin="0" aria-valuemax="100"><span style="width:'+value+'%"></span></div>';}
function formatDate(value){if(!value)return "Sin fecha";const date=new Date(value.length===10?value+"T12:00:00":value);if(!Number.isFinite(date.getTime()))return "Sin fecha";return new Intl.DateTimeFormat("es-EC",{day:"numeric",month:"short"}).format(date);}
const formatTime=s=>Math.floor(s/60)+":"+String(Math.max(0,s)%60).padStart(2,"0");
const wordCount=text=>text.trim()?text.trim().split(/\s+/u).length:0;
function skillScore(s,level="B1"){
 const rs=COURSES[level].map(u=>result(u,s)).filter(r=>typeof r?.score==="number");
 return rs.length?Math.round(rs.reduce((n,r)=>n+r.score,0)/rs.reduce((n,r)=>n+r.total,0)*100):null;
}
function assignmentDone(a){const r=result(a.unit,a.skill);return a.learner==="alex"&&!!r&&Date.parse(r.at)>=Date.parse(a.at);}
function latestSubmission(learner,unit){return state.submissions.filter(s=>s.learner===learner&&s.unit===unit).sort((a,b)=>Date.parse(b.at)-Date.parse(a.at))[0];}
function learnerData(){
 return LEARNERS.map(l=>{
  if(l.id!=="alex")return {...l};
  const pending=state.submissions.some(s=>s.learner==="alex"&&s.status==="pending");
  const revision=state.submissions.some(s=>s.learner==="alex"&&s.status==="revise");
  return {...l,progress:courseStats("B1").pct,scores:{reading:skillScore("reading"),listening:skillScore("listening"),quiz:skillScore("quiz")},writing:revision?"Necesita apoyo":pending?"Pendiente":"Revisada"};
 });
}
function learnerNeedsSupport(l){return (l.scores.listening!==null&&l.scores.listening<60)||l.writing==="Necesita apoyo";}
function progressCard(){
 const stats=courseStats();
 return '<section class="white-card"><div class="card-title"><h2>Mi progreso</h2>'+pill(state.level,"wine")+'</div><div class="progress-summary"><div class="ring" style="--pct:'+stats.pct+'%"><span class="ring-text">'+stats.pct+'%</span></div><div class="progress-copy"><strong>'+stats.done+' de '+stats.total+' prácticas</strong><span>Ruta de muestra</span></div></div>'+["reading","listening","writing","speaking"].map(s=>{
  const n=COURSES[state.level].filter(u=>result(u,s)).length;
  return '<div class="skill-progress"><span>'+skills[s].name+'</span><span>'+n+' / 3</span></div>'+progressBar(Math.round(n/3*100),s==="listening"?"teal":s==="reading"?"blue":s==="writing"?"gold":"",skills[s].name);
 }).join("")+'<p class="small-note">Incluye resultados previos ilustrativos. Tus nuevas prácticas actualizan esta muestra.</p><button class="text-button" data-view="progress">Ver competencias y resultados</button></section>';
}
function studentAssignments(){
 const assignments=state.assignments.filter(a=>a.learner==="alex").sort((a,b)=>Date.parse(b.at)-Date.parse(a.at));
 return '<section class="white-card"><div class="card-title"><h2>Asignado por tu docente</h2>'+pill(assignments.filter(a=>!assignmentDone(a)).length+" pendientes","gold")+'</div>'+assignments.map(a=>{
  const u=findUnit(a.unit),done=assignmentDone(a);
  return '<div class="assignment-item">'+pill((u.id.startsWith("a2")?"A2":"B1")+" · "+skills[a.skill].name,done?"teal":"wine")+'<h3 style="margin-top:9px">'+esc(u[a.skill].title)+'</h3><p>'+esc(a.note)+'</p><p>Fecha objetivo: '+formatDate(a.due)+' · '+(done?"Realizada":"Pendiente")+'</p>'+practiceButton(u,a.skill,done?"Repasar":"Abrir práctica")+'</div>';
 }).join("")+'</section>';
}
function pathwayCards(){
 return '<div class="route-grid"><section class="route-card '+(state.pathway==="intensive"?"selected":"")+'">'+pill("RUTA INTERNACIONAL","teal")+'<h3>Español intensivo para estudiantes internacionales</h3><p>Una propuesta de práctica para preparar tu llegada, participar en la universidad y desenvolverte en Quito.</p><button class="button secondary small" data-action="pathway" data-path="intensive">Explorar el recorrido B1 '+icon("arrow")+'</button></section><section class="route-card '+(state.pathway==="dele"?"selected":"")+'">'+pill("PREPARACIÓN DELE","wine")+'<h3>Practica para A2 y B1</h3><p>Tareas por destreza, una muestra con tiempo y resultados explicados para orientar tu próxima práctica.</p><button class="button secondary small" data-action="pathway" data-path="dele">Ver práctica y resultados '+icon("arrow")+'</button></section></div>';
}
function home(){
 const u=currentUnit(),stats=courseStats(),done=completed(u),total=skillIds(u).length;
 return '<div class="home-grid"><div class="learning-column"><section class="feature-card"><div class="feature-top"><span class="eyebrow">'+(state.pathway==="intensive"?"INTENSIVO INTERNACIONAL":"PREPARACIÓN DELE")+' · '+state.level+'</span>'+pill("Continúa tu aprendizaje")+'</div><h2>'+esc(u.title)+'</h2><p>'+esc(u.description)+'</p><div class="feature-bottom">'+practiceButton(u,nextSkill(u),done===total?"Repasar unidad":"Continuar unidad","button light")+'<span class="feature-meta">'+icon("clock")+(u.quiz?"27":"24")+' min · '+total+' pasos conectados</span></div><div class="feature-progress"><span>Unidad '+(COURSES[state.level].indexOf(u)+1)+' · '+done+' de '+total+' pasos</span>'+progressBar(Math.round(done/total*100),"","Progreso de esta unidad")+'<span>Ruta: '+stats.pct+'% · datos ilustrativos</span></div></section><section><div class="section-heading"><h2>Practica una destreza</h2><span>Situaciones reales, paso a paso</span></div><div class="skill-grid">'+["reading","listening","writing","speaking"].map(s=>'<button class="skill-card" data-action="practice" data-unit="'+u.id+'" data-skill="'+s+'">'+skillBadge(s)+'<h3>'+skills[s].name+'</h3><p>'+skills[s].mins+' min · práctica guiada</p></button>').join("")+'</div></section><section><div class="section-heading"><h2>Mis cursos</h2><button class="text-button" data-view="course">Ver todas las rutas</button></div>'+pathwayCards()+'</section><section><div class="section-heading"><h2>Tu ruta en '+state.level+'</h2><span>Contenido de muestra</span></div>'+unitRows()+'</section></div><aside class="insight-column" aria-label="Progreso y prácticas asignadas">'+progressCard()+studentAssignments()+'<section class="white-card context-card"><span class="eyebrow">ESPAÑOL EN ECUADOR</span><h3>Aprender también es participar.</h3><p>Haz una pregunta en el mercado, organiza una salida al centro o conversa sobre un plato de locro. Lleva el español del aula a tu día a día.</p><button class="text-button" data-action="practice" data-unit="b1-3" data-skill="speaking">Practicar un plan en Quito</button></section></aside></div>';
}
function unitRows(){
 return '<div class="unit-list">'+COURSES[state.level].map((u,i)=>{
  const done=completed(u),total=skillIds(u).length;
  return '<article class="unit-row '+(done===total?"complete":"")+'"><span class="unit-number">'+(done===total?icon("check"):String(i+1).padStart(2,"0"))+'</span><div class="unit-copy"><h3>'+esc(u.title)+'</h3><p>'+esc(u.topics)+'</p>'+progressBar(Math.round(done/total*100),"","Unidad "+(i+1))+'<small>'+done+' / '+total+' prácticas realizadas</small></div>'+practiceButton(u,nextSkill(u),done===total?"Repasar":"Abrir unidad")+'</article>';
 }).join("")+'</div>';
}
function course(){
 return '<div class="intro-note"><strong>Español intensivo para estudiantes internacionales.</strong> La propuesta B1 conecta la preparación del intercambio con la vida universitaria. UDLA contempla un intensivo previo para estudiantes que necesitan reforzar su español. <a href="https://www.udla.edu.ec/en/centro-internacional/estudia-un-semestre-en-udla/" target="_blank" rel="noopener">Ver información de UDLA</a>.</div>'+pathwayCards()+'<div class="course-units">'+COURSES[state.level].map((u,i)=>'<section class="white-card course-card"><div class="course-card-heading"><span class="unit-number">'+String(i+1).padStart(2,"0")+'</span><div><h2>'+esc(u.title)+'</h2><p>'+esc(u.goal)+'</p></div></div><div class="path-activities">'+skillIds(u).map(s=>'<button class="activity-card" data-action="practice" data-unit="'+u.id+'" data-skill="'+s+'">'+skillBadge(s)+'<strong>'+esc(u[s].title)+'</strong><span>'+skills[s].name+' · '+(result(u,s)?"Realizada":skills[s].mins+" min")+'</span></button>').join("")+'</div></section>').join("")+'</div><section class="white-card" style="margin-top:24px"><h2>Un recorrido que puede crecer con UDLA</h2><p class="compact-copy" style="margin-top:8px">A2 y B1 incluyen prácticas funcionales. B2, C1 y C2 muestran propuestas de estructura para acordar con el equipo académico.</p><div class="level-paths">'+["A2","B1"].map(l=>'<button class="level-chip" data-action="level" data-level="'+l+'"><strong>'+l+'</strong><span>Prácticas disponibles</span></button>').join("")+Object.entries(LEVEL_OUTLINES).map(([l,o])=>'<button class="level-chip" data-action="outline" data-level="'+l+'"><strong>'+l+'</strong><span>'+o.name+' · propuesta</span></button>').join("")+'</div></section>';
}
function plan(){
 return '<div class="intro-note">Una propuesta de <strong>tres semanas de práctica entre clases</strong>. Cada unidad reúne las destrezas y permite volver a las actividades que necesitan refuerzo.</div><div class="plan-grid">'+COURSES[state.level].map((u,i)=>'<section class="white-card">'+pill("SEMANA "+(i+1),"wine")+'<h2>'+esc(u.title)+'</h2><p>'+esc(u.goal)+'</p><div style="margin-top:20px">'+skillIds(u).map((s,j)=>'<div class="plan-item"><span class="day-box">'+["LUN","MAR","MIÉ","JUE","VIE"][j]+'</span><div><strong>'+skills[s].name+'</strong><p>'+skills[s].mins+' min · '+(result(u,s)?"Realizada":"Pendiente")+'</p></div>'+practiceButton(u,s,result(u,s)?"Repasar":"Abrir")+'</div>').join("")+'</div></section>').join("")+'</div>';
}
function progress(){
 const stats=courseStats(),rows=COURSES[state.level].flatMap(u=>skillIds(u).filter(s=>result(u,s)).map(s=>({u,s,r:result(u,s)}))).sort((a,b)=>Date.parse(b.r.at)-Date.parse(a.r.at));
 const qs=rows.filter(x=>typeof x.r.score==="number"),score=qs.reduce((n,x)=>n+x.r.score,0),total=qs.reduce((n,x)=>n+x.r.total,0);
 return '<div class="metrics">'+metric("Práctica completada",stats.pct+"%","Ruta de muestra en "+state.level,"chart")+metric("Actividades realizadas",stats.done+' <span>/ '+stats.total+'</span>',"Incluye resultados previos ilustrativos","book")+metric("Aciertos en tareas",total?score+' <span>/ '+total+'</span>':"—","Lectura, escucha y quiz","quiz")+metric("Escrituras enviadas",state.submissions.filter(s=>s.learner==="alex"&&s.level===state.level).length,"Bandeja docente de la demostración","pen")+'</div><div class="progress-grid">'+progressCard()+'<section class="white-card"><div class="card-title"><h2>Actividad y comentarios</h2>'+pill("Perfil ilustrativo de Alex")+'</div>'+(rows.length?'<div class="table-wrap"><table class="results-table history-table"><thead><tr><th>Práctica</th><th>Resultado</th><th></th></tr></thead><tbody>'+rows.map(x=>{
  const sub=x.s==="writing"?latestSubmission("alex",x.u.id):null;
  return '<tr><td><strong>'+skills[x.s].name+'</strong><small>'+esc(x.u.title)+'</small><small>'+formatDate(x.r.at)+(x.r.demo?" · resultado ilustrativo":" · tu práctica")+'</small>'+(sub?.feedback?'<div class="teacher-feedback"><strong>Comentario docente</strong><p>'+esc(sub.feedback)+'</p></div>':"")+'</td><td>'+(typeof x.r.score==="number"?x.r.score+" / "+x.r.total:x.s==="writing"?pill(sub?.status==="reviewed"?"Revisada":sub?.status==="revise"?"Revisar de nuevo":"Enviada al docente",sub?.status==="reviewed"?"teal":"gold"):"Autoevaluación")+'</td><td>'+practiceButton(x.u,x.s,"Repasar")+'</td></tr>';
 }).join("")+'</tbody></table></div>':'<div class="empty-state"><h3>Empieza con tu primera práctica</h3><p>Tus respuestas y comentarios aparecerán aquí.</p><div class="button-row" style="justify-content:center">'+practiceButton(currentUnit(),"reading","Empezar lectura","button")+'</div></div>')+'</section></div><p class="small-note">'+(storageAvailable?"Los cambios se guardan en este navegador.":"Este navegador no permite guardar los cambios después de cerrar la página.")+' Los porcentajes representan práctica realizada y no acreditan un nivel de español.</p>';
}
function metric(label,value,note,ic="chart",tone=""){return '<section class="white-card metric '+tone+'"><span class="metric-label">'+icon(ic)+esc(label)+'</span><div class="metric-value">'+value+'</div><p>'+esc(note)+'</p></section>';}
function dele(){
 const last=state.mockResults.filter(r=>r.level===state.level).at(-1);
 return '<div class="intro-note"><strong>Muestra breve de práctica DELE '+state.level+'.</strong> Explora lectura y escucha con un límite de ocho minutos. El formato completo y los materiales se desarrollarían con UDLA; esta muestra no es un examen oficial ni una predicción de aprobado.</div><div class="mock-grid"><section class="white-card mock-card">'+pill("PRÁCTICA CON TIEMPO","wine")+'<h2>Un primer ensayo, con respuestas explicadas.</h2><p class="muted compact-copy">Resuelve seis preguntas y revisa las pistas para identificar qué necesitas practicar.</p><div class="mock-parts"><div class="mock-part">'+skillBadge("reading")+'<div><h3>Comprensión de lectura</h3><p>Un texto y tres preguntas</p></div></div><div class="mock-part">'+skillBadge("listening")+'<div><h3>Comprensión auditiva</h3><p>Un mensaje de audio y tres preguntas</p></div></div></div><div class="button-row" style="margin-top:4px"><button class="button" data-action="start-mock">'+icon("clock")+'Iniciar muestra · 8 min</button></div></section><section class="white-card"><div class="card-title"><h2>Preparación por destreza</h2>'+pill(state.level,"wine")+'</div><p class="compact-copy muted">Complementa la muestra con una tarea escrita y una respuesta oral guiada.</p><div class="assignment-item"><h3>'+esc(COURSES[state.level][0].writing.title)+'</h3><p>Objetivo de extensión y revisión docente</p>'+practiceButton(COURSES[state.level][0],"writing","Practicar escritura")+'</div><div class="assignment-item"><h3>'+esc(COURSES[state.level][0].speaking.title)+'</h3><p>Grabación temporal y autoevaluación</p>'+practiceButton(COURSES[state.level][0],"speaking","Practicar expresión oral")+'</div><hr class="divider"><h3 style="font-size:13px">Tu último resultado</h3><p class="compact-copy muted" style="margin-top:6px">'+(last?last.score+" / 6 aciertos · "+formatDate(last.at):"Aún no has completado una muestra en "+state.level+".")+'</p></section></div>';
}
function scoreChip(value){return value===null||value===undefined?'<span class="score-chip neutral">—</span>':'<span class="score-chip '+(value<60?"low":"")+'">'+value+'%</span>';}
function personCell(l){return '<div class="person-cell"><span class="person-avatar '+l.color+'">'+l.initials+'</span><div><strong>'+esc(l.name)+'</strong><small>'+esc(l.programme)+' · '+l.level+'</small></div></div>';}
function cohort(){return learnerData().filter(l=>teacherFilters.level==="all"||l.level===teacherFilters.level);}
function cohortSelector(){return '<label style="display:flex;align-items:center;gap:8px">Grupo <select class="field" id="cohort-level" aria-label="Filtrar grupo docente"><option value="all"'+(teacherFilters.level==="all"?" selected":"")+'>Todos los grupos</option><option value="B1"'+(teacherFilters.level==="B1"?" selected":"")+'>B1 · Intensivo internacional</option><option value="A2"'+(teacherFilters.level==="A2"?" selected":"")+'>A2 · Preparación DELE</option></select></label>';}
function teacherDashboard(){
 const learners=cohort(),support=learners.filter(learnerNeedsSupport),pending=state.submissions.filter(s=>s.status==="pending"&&learners.some(l=>l.id===s.learner)),avg=learners.length?Math.round(learners.reduce((n,l)=>n+l.progress,0)/learners.length):0;
 const avgSkill=s=>{const values=learners.map(l=>l.scores[s]).filter(v=>typeof v==="number");return values.length?Math.round(values.reduce((n,v)=>n+v,0)/values.length):0;};
 return '<div class="teacher-caption">'+pill("Datos ilustrativos","wine")+cohortSelector()+'<span>Semana de muestra · equipo académico</span><button class="button secondary small" data-action="assign">'+icon("calendar")+'Asignar práctica</button></div><div class="metrics">'+metric("Estudiantes",learners.length,"Perfiles ficticios del grupo","people")+metric("Práctica completada",avg+"%","Promedio de actividades realizadas","chart")+metric("Necesitan apoyo",support.length,"Escucha < 60% o escritura señalada","alert","attention")+metric("Por corregir",pending.length,"Textos disponibles en esta muestra","pen")+'</div><div class="teacher-grid"><div class="teacher-left"><section class="white-card"><div class="card-title"><h2>¿A quién conviene acompañar?</h2><button class="text-button" data-action="support-list">Ver estudiantes</button></div>'+(support.length?support.map(l=>'<div class="gap-row"><span class="person-avatar '+l.color+'">'+l.initials+'</span><div class="gap-copy"><h3>'+esc(l.name)+'</h3><p>'+(l.scores.listening<60?"Escucha: "+l.scores.listening+"% · distinguir cambios y detalles":"Escritura: organizar y desarrollar las ideas")+'</p></div><button class="button secondary small" data-action="assign" data-learner="'+l.id+'" data-skill="'+(l.scores.listening<60?"listening":"writing")+'">Asignar refuerzo</button></div>').join(""):'<div class="empty-state"><h3>Sin alertas en este grupo</h3><p>Las alertas se actualizan con la práctica de Alex y los perfiles ilustrativos.</p></div>')+'<p class="small-note">La alerta propone un seguimiento; no diagnostica el nivel del estudiante.</p></section><section class="white-card"><div class="card-title"><h2>Panorama de la clase</h2><button class="text-button" data-view="students">Ver detalle individual</button></div>'+learnerTable(learners.slice(0,4),true)+'</section></div><div class="teacher-right"><section class="white-card"><div class="card-title"><h2>Resultados por destreza</h2>'+pill("Aciertos")+'</div>'+["reading","listening","quiz"].map(s=>'<div class="cohort-skill"><div><span>'+skills[s].name+'</span><strong>'+avgSkill(s)+'%</strong></div>'+progressBar(avgSkill(s),s==="listening"?"teal":s==="reading"?"blue":"",skills[s].name+" del grupo")+'</div>').join("")+'<div class="legend"><span class="legend-dot"></span>Prioridad sugerida: escucha y escritura</div><p class="small-note">Escritura y oral se revisan por separado. Solo las preguntas cerradas reciben una nota automática.</p></section><section class="white-card"><div class="card-title"><h2>Bandeja de correcciones</h2>'+pill(pending.length+" pendientes","gold")+'</div>'+(pending.length?pending.slice(0,3).map(s=>{
  const l=LEARNERS.find(x=>x.id===s.learner),u=findUnit(s.unit);
  return '<div class="assignment-item"><h3>'+esc(l.name)+'</h3><p>'+esc(u.writing.title)+' · '+wordCount(s.text)+' palabras</p><button class="text-button" data-action="open-review" data-review="'+s.id+'">Revisar texto '+icon("arrow")+'</button></div>';
 }).join(""):'<p class="compact-copy muted">No hay textos pendientes en este grupo.</p>')+'</section></div></div>';
}
function learnerTable(learners,compact=false){
 return '<div class="table-wrap"><table class="results-table"><thead><tr><th>Estudiante</th><th>Práctica</th><th>Lectura</th><th>Escucha</th>'+(compact?"":"<th>Escritura</th>")+'<th></th></tr></thead><tbody>'+learners.map(l=>'<tr><td>'+personCell(l)+'</td><td><div class="table-progress">'+progressBar(l.progress,"","Práctica de "+l.name)+'<span>'+l.progress+'%</span></div></td><td>'+scoreChip(l.scores.reading)+'</td><td>'+scoreChip(l.scores.listening)+'</td>'+(compact?"":"<td>"+pill(l.writing,l.writing==="Revisada"?"teal":"gold")+"</td>")+'<td><button class="text-button" data-action="learner" data-learner="'+l.id+'">Ver perfil</button></td></tr>').join("")+'</tbody></table></div>';
}
function filteredLearners(){
 const needle=teacherFilters.search.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
 return cohort().filter(l=>l.name.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().includes(needle)).filter(l=>teacherFilters.attention==="all"||(teacherFilters.attention==="support"?learnerNeedsSupport(l):l.writing==="Pendiente"));
}
function teacherStudents(){
 const learners=filteredLearners();
 return '<div class="teacher-caption">'+pill("Perfiles y datos ilustrativos","wine")+'<span>Los resultados de Alex se actualizan con las acciones de la vista estudiante.</span><button class="button secondary small" data-action="assign">Asignar práctica</button></div><section class="white-card"><div class="filters"><label class="search-field"><input id="learner-search" type="search" maxlength="100" placeholder="Buscar estudiante…" aria-label="Buscar estudiante" value="'+esc(teacherFilters.search)+'"></label><select class="field" id="student-level-filter" aria-label="Filtrar por nivel"><option value="all"'+(teacherFilters.level==="all"?" selected":"")+'>Todos los niveles</option><option value="B1"'+(teacherFilters.level==="B1"?" selected":"")+'>B1</option><option value="A2"'+(teacherFilters.level==="A2"?" selected":"")+'>A2</option></select><select class="field" id="attention-filter" aria-label="Filtrar por atención"><option value="all"'+(teacherFilters.attention==="all"?" selected":"")+'>Todos los estados</option><option value="support"'+(teacherFilters.attention==="support"?" selected":"")+'>Necesitan apoyo</option><option value="pending"'+(teacherFilters.attention==="pending"?" selected":"")+'>Escritura pendiente</option></select></div><div id="learner-table-results">'+(learners.length?learnerTable(learners):'<div class="empty-state"><h3>No hay coincidencias</h3><p>Prueba otro nombre o cambia los filtros.</p></div>')+'<p class="table-footer">'+learners.length+' perfiles · porcentajes de práctica y aciertos ilustrativos</p></div></section>';
}
function teacherAssignments(){
 const assignments=[...state.assignments].sort((a,b)=>Date.parse(b.at)-Date.parse(a.at));
 return '<div class="teacher-caption">'+pill("Asignaciones de esta demostración","wine")+'<span>Asigna un refuerzo a Alex y ábrelo desde la vista estudiante.</span><button class="button secondary small" data-action="assign">'+icon("calendar")+'Nueva asignación</button></div><section class="white-card"><div class="card-title"><h2>Prácticas y seguimiento</h2>'+pill(assignments.filter(a=>!assignmentDone(a)).length+" pendientes","gold")+'</div>'+(assignments.length?'<div class="table-wrap"><table class="results-table assignment-table"><thead><tr><th>Estudiante</th><th>Actividad</th><th>Fecha objetivo</th><th>Estado</th><th></th></tr></thead><tbody>'+assignments.map(a=>{
  const l=LEARNERS.find(x=>x.id===a.learner),u=findUnit(a.unit),done=assignmentDone(a);
  return '<tr><td>'+personCell(l)+'</td><td><strong>'+esc(u[a.skill].title)+'</strong><small>'+skills[a.skill].name+' · '+(u.id.startsWith("a2")?"A2":"B1")+'</small><small style="max-width:250px">'+esc(a.note)+'</small></td><td>'+formatDate(a.due)+'</td><td>'+pill(done?"Realizada":"Pendiente",done?"teal":"gold")+'</td><td><button class="text-button" data-action="learner" data-learner="'+a.learner+'">Ver perfil</button></td></tr>';
 }).join("")+'</tbody></table></div>':'<div class="empty-state"><h3>Aún no hay asignaciones</h3><p>Selecciona una actividad y un estudiante para crear tu primera asignación.</p></div>')+'<p class="small-note">Las asignaciones se guardan localmente; no se envían notificaciones. En esta muestra, solo el perfil de Alex tiene una experiencia de estudiante conectada.</p></section>';
}
function reviewLabel(s){return s.status==="pending"?"Por revisar":s.status==="reviewed"?"Revisada":"Revisión solicitada";}
function teacherReviews(){
 const submissions=state.submissions.filter(s=>reviewFilter==="all"||s.status==="pending").sort((a,b)=>Date.parse(b.at)-Date.parse(a.at));
 if(!submissions.some(s=>s.id===selectedReview))selectedReview=submissions[0]?.id||null;
 const selected=state.submissions.find(s=>s.id===selectedReview);
 return '<div class="teacher-caption">'+pill("Corrección y orientación","wine")+'<span>Guarda un comentario para verlo en el progreso de Alex.</span><select class="field" id="review-filter" aria-label="Filtrar correcciones"><option value="pending"'+(reviewFilter==="pending"?" selected":"")+'>Pendientes</option><option value="all"'+(reviewFilter==="all"?" selected":"")+'>Todas las entregas</option></select></div>'+(submissions.length?'<div class="review-layout"><div class="review-list">'+submissions.map(s=>{
  const l=LEARNERS.find(x=>x.id===s.learner),u=findUnit(s.unit);
  return '<button class="review-item '+(s.id===selectedReview?"active":"")+'" data-action="select-review" data-review="'+s.id+'">'+personCell(l)+'<h3>'+esc(u.writing.title)+'</h3><p>'+wordCount(s.text)+' palabras · '+formatDate(s.at)+(s.demo?" · ejemplo":"")+'</p>'+pill(reviewLabel(s),s.status==="reviewed"?"teal":"gold")+'</button>';
 }).join("")+'</div><section class="white-card review-work">'+reviewWork(selected)+'</section></div>':'<section class="white-card empty-state"><div class="summary-icon">'+icon("check")+'</div><h3 style="margin-top:17px">La bandeja está al día</h3><p>Las nuevas entregas de escritura de Alex aparecerán aquí. Puedes consultar todas las entregas para revisar los comentarios guardados.</p><button class="text-button" data-action="all-reviews" style="margin-top:15px">Ver todas las entregas</button></section>');
}
function reviewWork(s){
 const u=findUnit(s.unit),l=LEARNERS.find(x=>x.id===s.learner);
 const options=(id,value)=>'<label>'+id+'<select class="field" id="rubric-'+({"Contenido":"content","Organización":"organisation","Claridad":"clarity"}[id])+'"><option value="covered"'+(value==="covered"?" selected":"")+'>Bien desarrollado</option><option value="develop"'+(value!=="covered"?" selected":"")+'>Necesita desarrollo</option></select></label>';
 return '<h2>'+esc(u.writing.title)+'</h2><p class="compact-copy muted">'+esc(l.name)+' · '+s.level+' · '+wordCount(s.text)+' palabras '+(s.demo?"· entrega ilustrativa":"· entrega de esta sesión")+'</p><div class="task-prompt"><p>'+esc(u.writing.prompt)+'</p><ul>'+u.writing.points.map(p=>'<li>'+esc(p)+'</li>').join("")+'</ul></div><h3 style="font-size:13px">Texto del estudiante</h3><div class="review-student-text">'+esc(s.text)+'</div><form id="teacher-review-form" data-review="'+s.id+'"><div class="rubric">'+options("Contenido",s.rubric.content)+options("Organización",s.rubric.organisation)+options("Claridad",s.rubric.clarity)+'</div><label class="field-label" for="teacher-feedback">Comentario para el estudiante</label><textarea class="teacher-textarea" id="teacher-feedback" maxlength="3000" required minlength="10" placeholder="Indica lo que funciona y un siguiente paso concreto…">'+esc(s.feedback)+'</textarea><button class="text-button" data-action="sample-feedback" style="margin-top:8px">Cargar comentario de ejemplo</button><label class="field-label" for="review-status">Resultado de la revisión</label><select class="field" id="review-status"><option value="reviewed"'+(s.status!=="revise"?" selected":"")+'>Revisada · continuar practicando</option><option value="revise"'+(s.status==="revise"?" selected":"")+'>Solicitar una nueva versión</option></select><div class="button-row"><button type="submit" class="button">'+icon("check")+'Guardar comentario</button>'+(s.learner==="alex"?'<button type="button" class="button secondary" data-action="student-progress">Ver progreso de Alex</button>':"")+'</div><p class="small-note">La rúbrica es orientativa. Los comentarios se guardan en esta muestra y no se envían fuera del navegador.</p></form>';
}
function openLearner(id){
 const l=learnerData().find(x=>x.id===id);if(!l)return;
 const assignments=state.assignments.filter(a=>a.learner===id),submissions=state.submissions.filter(s=>s.learner===id);
 openDetail('<div class="profile-heading"><span class="person-avatar '+l.color+'">'+l.initials+'</span><div><h2 id="detail-title">'+esc(l.name)+'</h2><p>'+esc(l.programme)+' · '+l.level+' · perfil ilustrativo</p></div></div><div class="profile-grid"><section class="white-card"><h3>Práctica completada</h3><div class="metric-value">'+l.progress+'%</div>'+progressBar(l.progress,"","Práctica de "+l.name)+'<p class="small-note">Actividades realizadas en su ruta.</p></section><section class="white-card"><h3>Resultados por destreza</h3><div class="skill-progress"><span>Lectura</span>'+scoreChip(l.scores.reading)+'</div><div class="skill-progress"><span>Escucha</span>'+scoreChip(l.scores.listening)+'</div><div class="skill-progress"><span>Escritura</span>'+pill(l.writing,l.writing==="Revisada"?"teal":"gold")+'</div></section></div><h3 style="margin-top:25px">Prácticas asignadas</h3>'+(assignments.length?assignments.map(a=>'<div class="assignment-item"><h3>'+esc(findUnit(a.unit)[a.skill].title)+'</h3><p>'+esc(a.note)+'</p>'+pill(assignmentDone(a)?"Realizada":"Pendiente",assignmentDone(a)?"teal":"gold")+'</div>').join(""):'<p class="compact-copy muted" style="margin-top:8px">No hay prácticas asignadas.</p>')+'<div class="button-row"><button class="button" data-action="assign" data-learner="'+id+'">Asignar refuerzo</button>'+(submissions.length?'<button class="button secondary" data-action="open-review" data-review="'+submissions.at(-1).id+'">Ver escritura</button>':"")+'</div><p class="small-note">'+(id==="alex"?"Este perfil se conecta con las prácticas que haces en la vista estudiante.":"Los resultados de este perfil son ejemplos estáticos. Puedes crear y revisar asignaciones locales.")+'</p>',"SEGUIMIENTO DEL ESTUDIANTE");
}
function openAssign(learnerId="alex",skill="listening",unitId=null){
 const l=LEARNERS.find(x=>x.id===learnerId)||LEARNERS[0];
 openDetail('<h2 id="detail-title">Asignar una práctica de refuerzo</h2><p class="compact-copy muted" style="margin-top:10px">Elige una actividad y añade una indicación concreta. La asignación de Alex aparecerá también en su vista estudiante.</p><form id="assignment-form" class="assignment-form"><label for="assignment-learner">Estudiante<select class="field" id="assignment-learner">'+LEARNERS.map(x=>'<option value="'+x.id+'"'+(l.id===x.id?" selected":"")+'>'+esc(x.name)+' · '+x.level+'</option>').join("")+'</select></label><label for="assignment-task">Actividad<select class="field" id="assignment-task">'+assignmentOptions(l.level,skill,unitId)+'</select></label><label for="assignment-due">Fecha objetivo<input class="field-input" type="date" id="assignment-due" required value="'+isoDays(2).slice(0,10)+'"></label><label for="assignment-note">Orientación del docente<textarea class="teacher-textarea" id="assignment-note" maxlength="1000" placeholder="Por ejemplo: escucha una vez sin transcripción y anota qué cambia.">'+(skill==="listening"?"Escucha una vez para identificar la idea principal y otra para comprobar los detalles.":"Revisa los puntos de la tarea y dedica unos minutos a organizar tu respuesta.")+'</textarea></label><div class="button-row" style="margin-top:3px"><button class="button" type="submit">Guardar asignación</button><button class="button secondary" type="button" data-action="close-detail">Cancelar</button></div></form><p class="small-note">Datos de muestra. La asignación se guarda únicamente en este navegador.</p>',"PRÁCTICA ENTRE CLASES");
}
function assignmentOptions(level,preferredSkill="listening",preferredUnit=null){
 const target=preferredUnit||COURSES[level].at(-1).id;
 return COURSES[level].flatMap(u=>skillIds(u).map(s=>'<option value="'+u.id+'|'+s+'"'+(u.id===target&&s===preferredSkill?" selected":"")+'>'+skills[s].name+' · '+esc(u[s].title)+'</option>')).join("");
}
function createAssignment({learner,unit,skill,due,note}){
 if(!LEARNERS.some(l=>l.id===learner)||!findUnit(unit)||!skillIds(findUnit(unit)).includes(skill)||!/^\d{4}-\d{2}-\d{2}$/.test(due)||!Number.isFinite(Date.parse(due+"T12:00:00")))throw new Error("Asignación no válida");
 const assignment={id:"assignment-"+Date.now()+"-"+state.assignments.length,learner,unit,skill,due,note:String(note||"").slice(0,1000),at:new Date().toISOString()};
 state.assignments.push(assignment);persist();return assignment;
}
function saveTeacherReview(id,{feedback,status,rubric}){
 const s=state.submissions.find(x=>x.id===id);
 if(!s||feedback.trim().length<10||!["reviewed","revise"].includes(status))throw new Error("Añade un comentario de al menos diez caracteres.");
 s.feedback=feedback.trim().slice(0,3000);s.status=status;s.rubric=Object.fromEntries(["content","organisation","clarity"].map(k=>[k,rubric?.[k]==="covered"?"covered":"develop"]));s.reviewedAt=new Date().toISOString();persist();return s;
}
function openDetail(html,label="PROPUESTA ACADÉMICA"){
 const d=$("#detail-dialog");if(d.open)d.close();
 $("#detail-content").innerHTML=html;$("#detail-label").textContent=label;d.showModal();
}
function openOutline(level){
 const outline=LEVEL_OUTLINES[level];if(!outline)return;
 openDetail('<span class="pill wine">Nivel '+level+' · propuesta de estructura</span><h2 id="detail-title" style="margin-top:17px">'+outline.name+'</h2><p class="compact-copy muted" style="margin-top:12px">'+outline.description+'</p><div class="course-units">'+outline.units.map((title,i)=>'<section class="white-card"><div class="course-card-heading"><span class="unit-number">'+String(i+1).padStart(2,"0")+'</span><div><h3>'+title+'</h3><p>'+outline.outcomes[i]+'</p></div></div></section>').join("")+'</div><p class="small-note">Este recorrido es conceptual. No contiene un curso completo ni reproduce un programa aprobado por UDLA.</p><div class="button-row"><button class="button" data-action="example-b1">Ver la unidad funcional B1</button><button class="button secondary" data-action="close-detail">Volver a mis cursos</button></div>',"UN RECORRIDO ADAPTABLE");
}
function lessonSteps(u,skill){
 return '<div class="lesson-steps" role="group" aria-label="Pasos de la unidad">'+skillIds(u).map((s,i)=>'<button class="lesson-step '+(s===skill?"active":result(u,s)?"done":"")+'" data-action="practice" data-unit="'+u.id+'" data-skill="'+s+'"'+(s===skill?' aria-current="step"':"")+'>'+(result(u,s)?icon("check"):"<span>"+(i+1)+"</span>")+skills[s].name+'</button>').join("")+'</div>';
}
function questionsHtml(task,prefix="q",answers=[]){
 return '<div class="questions">'+task.questions.map((q,i)=>'<fieldset class="question"><legend>'+(i+1)+'. '+esc(q.q)+'</legend>'+q.options.map((a,j)=>'<label class="answer"><input type="radio" name="'+prefix+i+'" value="'+j+'" required'+(answers[i]===j?" checked":"")+'><span>'+esc(a)+'</span></label>').join("")+'</fieldset>').join("")+'</div>';
}
function audioHtml(task){
 return '<div class="audio-panel"><div class="audio-heading">'+skillBadge("listening")+'<div><h3>Un mensaje de voz en español</h3><p>Escucha una vez para entender la idea y otra para buscar detalles.</p></div></div><div class="audio-buttons"><button class="button" data-action="listen">'+icon("play")+'Escuchar mensaje</button><button class="button secondary" data-action="listen-slow">Más despacio</button><button class="icon-button" data-action="stop-listening" aria-label="Detener mensaje">'+icon("stop")+'</button></div><p id="audio-status" class="audio-status" role="status">Audio con voz sintética en español del navegador. Puedes repetirlo.</p><details><summary>Consultar la transcripción</summary><p class="transcript">'+esc(task.text)+'</p></details></div>';
}
function quizHtml(u,s){
 const task=u[s],saved=result(u,s);
 const intro=s==="reading"?"Lee el mensaje y encuentra las pistas para responder.":s==="listening"?"Escucha el mensaje. Distingue lo que cambia de lo que sigue igual.":"Elige el conector o la expresión que mejor encaja.";
 return '<p class="instruction">'+intro+'</p>'+(s==="reading"?'<article class="passage"><h3>'+esc(task.heading)+'</h3>'+esc(task.text)+'</article>':s==="listening"?audioHtml(task):"")+'<form id="quiz-form">'+questionsHtml(task,"q",saved?.answers||[])+'<button type="submit" class="button">Comprobar respuestas</button></form><div id="activity-feedback" aria-live="polite"></div>';
}
function writingHtml(u){
 const t=u.writing,sub=latestSubmission("alex",u.id),text=state.drafts[u.id]??sub?.text??"";
 return '<div class="task-prompt"><p>'+esc(t.prompt)+'</p><ul>'+t.points.map(p=>'<li>'+esc(p)+'</li>').join("")+'</ul></div><label class="field-label" for="writing-response">Tu mensaje</label><textarea id="writing-response" maxlength="8000" placeholder="Hola, Elena…">'+esc(text)+'</textarea><div id="word-count" class="word-count">'+wordCount(text)+' palabras · objetivo: '+t.min+'–'+t.max+'</div><button class="text-button" data-action="sample-writing" style="margin-top:7px">Cargar texto de ejemplo</button><div class="checklist">'+t.points.map((p,i)=>'<label><input type="checkbox" name="writing-check" value="'+i+'"><span>He incluido: '+esc(p.charAt(0).toLowerCase()+p.slice(1))+'</span></label>').join("")+'</div><div class="button-row"><button class="button secondary" data-action="review-writing">'+icon("quiz")+'Obtener guía de revisión</button><button class="button" data-action="submit-writing">'+icon("pen")+'Enviar a revisión docente</button></div><div id="activity-feedback" aria-live="polite"></div>'+(sub?.feedback?'<div class="teacher-feedback"><strong>Comentario guardado del docente · '+reviewLabel(sub)+'</strong><p>'+esc(sub.feedback)+'</p></div>':"")+'<details><summary>Comparar con una respuesta de ejemplo</summary><div class="passage">'+esc(t.model)+'</div><p class="small-note">Respuesta original de muestra. La guía automática comprueba extensión, conectores y autorrevisión; el docente revisa el contenido y la expresión.</p></details>';
}
function speakingHtml(u){
 const t=u.speaking;
 return '<div class="task-prompt"><p>'+esc(t.prompt)+'</p><ul>'+t.points.map(p=>'<li>'+esc(p)+'</li>').join("")+'</ul></div><div class="audio-panel"><div class="speaker-controls"><button class="button" id="record-button" data-action="record">'+icon("mic")+'Grabar respuesta</button><button class="button secondary" data-action="speak-timer">Practicar sin grabar</button><button class="icon-button" data-action="stop-speaking" aria-label="Detener práctica oral">'+icon("stop")+'</button><span class="timer" id="speaking-timer" aria-label="Tiempo restante">'+formatTime(t.seconds)+'</span></div><p class="audio-status" id="record-status" role="status">Permite el micrófono para grabar, o practica en voz alta con el temporizador.</p><audio class="recorded-audio" id="recording-playback" controls hidden></audio><p class="small-note">La grabación es temporal: se elimina al cerrar o cambiar de actividad. No se envía al servidor.</p></div><details><summary>Frases para empezar</summary><ul class="compact-copy">'+t.support.map(p=>'<li>'+esc(p)+'</li>').join("")+'</ul></details><div class="checklist"><label><input type="checkbox" name="speaking-check"><span>He tratado los puntos de la tarea.</span></label><label><input type="checkbox" name="speaking-check"><span>He explicado mis ideas con un orden claro.</span></label><label><input type="checkbox" name="speaking-check"><span>He identificado algo que quiero mejorar.</span></label></div><button class="button" data-action="review-speaking">Registrar mi práctica oral</button><div id="activity-feedback" aria-live="polite"></div>';
}
function openPractice(unitId,skill){
 const u=findUnit(unitId);if(!u||!skillIds(u).includes(skill))throw new Error("Actividad no disponible");
 cleanupPractice();stopMock();
 const level=u.id.startsWith("a2")?"A2":"B1";state.level=level;persist();render();
 activePractice={unit:u,skill,token:{},practised:false,secondsSpoken:0,startedAt:null};
 $("#practice-label").textContent=level+" · Unidad "+(COURSES[level].indexOf(u)+1)+" · "+skills[skill].full;
 $("#practice-content").innerHTML=lessonSteps(u,skill)+'<div class="dialog-title-row">'+skillBadge(skill)+'<div><h2 id="practice-title">'+esc(u[skill].title)+'</h2><p class="activity-meta">'+esc(u.title)+' · '+skills[skill].mins+' min</p></div></div>'+(["reading","listening","quiz"].includes(skill)?quizHtml(u,skill):skill==="writing"?writingHtml(u):speakingHtml(u));
 if(!$("#practice-dialog").open)$("#practice-dialog").showModal();
 if(skill==="writing")updateWordCount();
}
function markResult(unit,skill,extra={}){
 state.results[keyOf(unit,skill)]={...extra,at:new Date().toISOString(),demo:false};persist();
 return state.results[keyOf(unit,skill)];
}
function scoreAnswers(task,answers){return {score:task.questions.filter((q,i)=>q.answer===answers[i]).length,total:task.questions.length};}
function saveQuizAnswers(unitId,skill,answers){
 const unit=findUnit(unitId),task=unit?.[skill];
 if(!task?.questions||answers.length!==task.questions.length||!answers.every((a,i)=>Number.isInteger(a)&&a>=0&&a<task.questions[i].options.length))throw new Error("Responde a todas las preguntas.");
 const marks=scoreAnswers(task,answers);markResult(unit,skill,{...marks,answers:[...answers]});return marks;
}
function explanations(task,answers){
 return task.questions.map((q,i)=>'<div class="explanation '+(q.answer===answers[i]?"":"wrong")+'"><strong>'+(q.answer===answers[i]?"✓ Correcta":"Revisa la pregunta "+(i+1))+' · '+esc(q.options[q.answer])+'</strong><p>'+esc(q.why)+'</p></div>').join("");
}
function nextPracticeButton(u,s){
 const list=skillIds(u),next=list[list.indexOf(s)+1];
 return next?practiceButton(u,next,"Continuar: "+skills[next].name.toLowerCase(),"button"):'<button class="button" data-action="unit-summary">Ver resumen de la unidad</button>';
}
function updateSteps(){if(activePractice){const el=$("#practice-content .lesson-steps");if(el)el.outerHTML=lessonSteps(activePractice.unit,activePractice.skill);}}
function reviewQuiz(form){
 const {unit,skill}=activePractice,task=unit[skill],data=new FormData(form);
 const answers=task.questions.map((q,i)=>data.has("q"+i)?Number(data.get("q"+i)):-1);
 try{
  const {score,total}=saveQuizAnswers(unit.id,skill,answers);render();updateSteps();
  $("#activity-feedback").innerHTML='<section class="feedback '+(score<total?"partial":"")+'"><h3>'+score+' de '+total+' respuestas correctas</h3><p>'+(score===total?"Has comprendido las pistas. Continúa con el siguiente paso.":"Revisa las explicaciones y vuelve al texto o al audio para reforzar las preguntas que faltan.")+'</p>'+explanations(task,answers)+'<div class="button-row">'+nextPracticeButton(unit,skill)+'</div></section>';
  toast("Resultado guardado. El progreso de Alex y el panel docente se han actualizado.");
 }catch(error){toast(error.message);}
}
function updateWordCount(){
 const textarea=$("#writing-response");if(!textarea||activePractice?.skill!=="writing")return;
 const t=activePractice.unit.writing,words=wordCount(textarea.value),label=$("#word-count");
 label.textContent=words+" palabras · objetivo: "+t.min+"–"+t.max;label.classList.toggle("warn",words>0&&(words<t.min||words>t.max));
 state.drafts[activePractice.unit.id]=textarea.value;persist();
}
function writingGuide(text,task,checked=0){
 const words=wordCount(text),connectors=["porque","además","pero","aunque","después","ya que","por eso","sin embargo","primero","por último"].filter(c=>text.toLowerCase().includes(c));
 return {words,within:words>=task.min&&words<=task.max,connectors,checked};
}
function reviewWriting(){
 const t=activePractice.unit.writing,text=$("#writing-response").value,checked=document.querySelectorAll('input[name="writing-check"]:checked').length;
 if(wordCount(text)<10){toast("Escribe al menos diez palabras para obtener una guía.");$("#writing-response").focus();return;}
 const guide=writingGuide(text,t,checked);
 $("#activity-feedback").innerHTML='<section class="feedback '+(guide.within&&checked===3?"":"partial")+'"><h3>Una guía para mejorar tu mensaje</h3><div class="feedback-checks"><div>'+icon(guide.within?"check":"alert")+'<span><strong>'+guide.words+' palabras.</strong> '+(guide.within?"Estás dentro del objetivo de extensión.":guide.words<t.min?"Añade detalles para alcanzar "+t.min+"–"+t.max+" palabras.":"Reduce repeticiones para acercarte a "+t.min+"–"+t.max+" palabras.")+'</span></div><div>'+icon(guide.connectors.length>=2?"check":"alert")+'<span>'+(guide.connectors.length?"Conectores encontrados: "+esc(guide.connectors.join(", "))+".":"Añade conectores, por ejemplo «porque», «además» o «aunque».")+' '+(guide.connectors.length<2?"Prueba a relacionar las ideas con dos conectores.":"")+'</span></div><div>'+icon(checked===3?"check":"alert")+'<span>Has confirmado '+checked+' de 3 puntos de la tarea. '+(checked<3?"Revisa tu mensaje con la lista de arriba.":"El docente podrá valorar cómo los has desarrollado.")+'</span></div></div><p class="small-note">Esta guía aplica reglas sencillas de estructura. No realiza una corrección lingüística ni asigna una nota.</p></section>';
}
function submitWritingText(unitId,text){
 const u=findUnit(unitId);text=String(text).trim();
 if(!u||wordCount(text)<20)throw new Error("Escribe al menos veinte palabras antes de enviar tu mensaje.");
 if(text.length>8000)throw new Error("El mensaje es demasiado largo.");
 const previous=latestSubmission("alex",u.id);
 if(previous?.status==="pending"&&previous.text===text)return previous;
 const submission={id:"writing-"+Date.now()+"-"+state.submissions.length,learner:"alex",unit:u.id,level:u.id.startsWith("a2")?"A2":"B1",text,status:"pending",feedback:"",rubric:{},at:new Date().toISOString(),demo:false};
 state.submissions.push(submission);state.drafts[u.id]=text;markResult(u,"writing",{text});return submission;
}
function submitWriting(){
 try{
  const u=activePractice.unit;submitWritingText(u.id,$("#writing-response").value);render();updateSteps();
  $("#activity-feedback").innerHTML='<section class="feedback"><h3>Tu mensaje está en la bandeja docente</h3><p>El equipo académico puede revisar la entrega y guardar un comentario. En este prototipo, puedes comprobarlo cambiando a la vista docente.</p><div class="button-row">'+nextPracticeButton(u,"writing")+'<button class="button secondary" data-action="review-current-writing">Ver entrega en vista docente</button></div><p class="small-note">Entrega guardada solo en este navegador.</p></section>';
  toast("Texto disponible en la bandeja de correcciones.");
 }catch(error){toast(error.message);}
}
function stopListening(message=true){
 if("speechSynthesis" in window)window.speechSynthesis.cancel();
 const status=$("#audio-status");if(status&&message)status.textContent="Audio detenido. Puedes volver a escucharlo.";
}
function listen(rate=1){
 const u=activeMock?.unit||activePractice?.unit,status=$("#audio-status");
 if(!u||!status)return;
 if(!("speechSynthesis" in window)||!window.SpeechSynthesisUtterance){status.textContent="Este navegador no dispone de audio de voz. Consulta la transcripción o utiliza un navegador con voz en español.";status.classList.add("error");return;}
 window.speechSynthesis.cancel();
 const utterance=new window.SpeechSynthesisUtterance(u.listening.text),voices=window.speechSynthesis.getVoices();
 const spanish=voices.find(v=>v.lang.toLowerCase()==="es-ec")||voices.find(v=>v.lang.toLowerCase().startsWith("es"));
 if(voices.length&&!spanish){status.textContent="No hay una voz en español disponible. Consulta la transcripción o prueba un navegador con voz en español.";status.classList.add("error");return;}
 utterance.lang=spanish?.lang||"es-EC";if(spanish)utterance.voice=spanish;utterance.rate=rate;
 const token=activePractice?.token||activeMock?.token;
 const valid=()=>token===(activePractice?.token||activeMock?.token);
 utterance.onstart=()=>{if(valid()&&$("#audio-status")){$("#audio-status").textContent="Reproduciendo el mensaje en español…";$("#audio-status").classList.remove("error");}};
 utterance.onend=()=>{if(valid()&&$("#audio-status"))$("#audio-status").textContent="Mensaje terminado. Puedes repetirlo o comprobar tus respuestas.";};
 utterance.onerror=event=>{if(valid()&&$("#audio-status")&&!["canceled","interrupted"].includes(event.error)){$("#audio-status").textContent="No se ha podido reproducir la voz. Consulta la transcripción o prueba otro navegador.";}};
 window.speechSynthesis.speak(utterance);
}
function runSpeakingTimer(){
 if(!activePractice||activePractice.skill!=="speaking")return;
 const p=activePractice;clearInterval(practiceTimer);let remaining=p.unit.speaking.seconds;
 p.startedAt=Date.now();p.practised=true;
 $("#speaking-timer").textContent=formatTime(remaining);
 practiceTimer=setInterval(()=>{
  if(activePractice!==p){stopSpeaking();return;}
  remaining--;p.secondsSpoken=p.unit.speaking.seconds-remaining;
  const timer=$("#speaking-timer");if(timer)timer.textContent=formatTime(remaining);
  if(remaining<=0){stopSpeaking();const status=$("#record-status");if(status)status.textContent="Tiempo terminado. Escucha tu grabación y completa la autoevaluación.";}
 },1000);
}
async function startRecording(){
 if(recorder){stopSpeaking();return;}
 if(practiceTimer){toast("Detén la práctica actual antes de grabar.");return;}
 const p=activePractice,button=$("#record-button");if(!p)return;
 if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){$("#record-status").textContent="Este navegador no permite grabar. Usa «Practicar sin grabar».";return;}
 button.disabled=true;let stream=null;
 try{
  stream=await navigator.mediaDevices.getUserMedia({audio:true});
  if(activePractice!==p||!$("#practice-dialog").open){stream.getTracks().forEach(t=>t.stop());return;}
  const mime=["audio/webm;codecs=opus","audio/mp4","audio/webm"].find(t=>window.MediaRecorder.isTypeSupported?.(t));
  const current=new window.MediaRecorder(stream,mime?{mimeType:mime}:undefined),chunks=[];
  recorder=current;mediaStream=stream;
  current.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
  current.onstop=()=>{
   stream.getTracks().forEach(t=>t.stop());
   if(activePractice!==p||!$("#practice-dialog").open)return;
   if(recordingUrl)URL.revokeObjectURL(recordingUrl);
   if(chunks.length){
    recordingUrl=URL.createObjectURL(new Blob(chunks,{type:current.mimeType||"audio/webm"}));
    const audio=$("#recording-playback");audio.src=recordingUrl;audio.hidden=false;
    $("#record-status").textContent="Tu grabación está lista. Escúchala antes de completar la autoevaluación.";
   }else $("#record-status").textContent="No se ha recibido audio. Prueba de nuevo o practica sin grabar.";
   if($("#record-button"))$("#record-button").innerHTML=icon("mic")+"Grabar de nuevo";
  };
  current.start();runSpeakingTimer();
  $("#record-status").innerHTML='<span class="rec-dot"></span>Grabando… Habla con calma y pulsa detener cuando termines.';
  button.innerHTML=icon("stop")+"Detener grabación";
 }catch(error){
  if(stream)stream.getTracks().forEach(t=>t.stop());
  if(activePractice===p&&$("#record-status"))$("#record-status").textContent=error.name==="NotAllowedError"?"El permiso del micrófono no se ha concedido. Puedes practicar en voz alta con el temporizador.":"No se ha podido iniciar la grabación. Prueba de nuevo o usa el temporizador.";
  recorder=null;mediaStream=null;
 }finally{if(activePractice===p&&$("#record-button"))$("#record-button").disabled=false;}
}
function stopSpeaking(){
 clearInterval(practiceTimer);practiceTimer=null;
 if(activePractice?.startedAt){activePractice.secondsSpoken=Math.max(activePractice.secondsSpoken,Math.floor((Date.now()-activePractice.startedAt)/1000));activePractice.startedAt=null;}
 if(recorder){const r=recorder;recorder=null;if(r.state!=="inactive")r.stop();}
 if(mediaStream){mediaStream.getTracks().forEach(t=>t.stop());mediaStream=null;}
}
function cleanupPractice(){
 stopListening(false);const previous=activePractice;activePractice=null;
 if(previous?.startedAt)previous.startedAt=null;
 stopSpeaking();if(recordingUrl){URL.revokeObjectURL(recordingUrl);recordingUrl=null;}
}
function reviewSpeaking(){
 const p=activePractice;
 if(!p?.practised||p.secondsSpoken<1){toast("Graba una respuesta o usa primero el temporizador para practicar.");return;}
 if(document.querySelectorAll('input[name="speaking-check"]:checked').length!==3){toast("Completa los tres puntos de autoevaluación después de hablar.");return;}
 if(recorder||practiceTimer){stopSpeaking();toast("Práctica detenida. Escucha tu respuesta y pulsa registrar cuando estés listo.");return;}
 markResult(p.unit,"speaking",{mode:recordingUrl?"recorded":"aloud"});render();updateSteps();
 $("#activity-feedback").innerHTML='<section class="feedback"><h3>Práctica oral registrada</h3><p>Has revisado el contenido, la organización y un aspecto para mejorar. Tu siguiente paso puede ser repetir la propuesta con más claridad.</p><p class="small-note">La autoevaluación no asigna una nota de pronunciación ni un nivel oficial.</p><div class="button-row">'+nextPracticeButton(p.unit,"speaking")+'</div></section>';
}
function unitSummary(){
 const u=activePractice.unit,done=completed(u),total=skillIds(u).length;
 stopSpeaking();stopListening(false);
 $("#practice-label").textContent="RESUMEN · "+u.title;
 $("#practice-content").innerHTML='<section class="summary-card"><div class="summary-icon">'+icon("check")+'</div><h2 id="practice-title">'+(done===total?"¡Unidad completada!":"Buen trabajo. Sigue avanzando.")+'</h2><p>'+esc(u.goal)+'</p><div class="summary-metrics"><div><strong>'+done+' / '+total+'</strong><span>Pasos registrados</span></div><div><strong>'+courseStats().pct+'%</strong><span>Práctica de la ruta</span></div></div><div class="white-card" style="text-align:left">'+skillIds(u).map(s=>'<div class="skill-progress"><span>'+skills[s].name+'</span>'+pill(result(u,s)?typeof result(u,s).score==="number"?result(u,s).score+" / "+result(u,s).total:s==="writing"?"Enviada al docente":"Autoevaluada":"Pendiente",result(u,s)?"teal":"gold")+'</div>').join("")+'</div><div class="button-row">'+(done<total?practiceButton(u,nextSkill(u),"Continuar la unidad","button"):'<button class="button" data-action="finish-unit">Volver a mi aprendizaje</button>')+'<button class="button secondary" data-action="teacher-dashboard">Ver seguimiento docente</button></div><p class="small-note">Los cambios se reflejan en el perfil ilustrativo de Alex. Los resultados previos del curso son datos de muestra.</p></section>';
}
function startMock(){
 cleanupPractice();stopMock();
 const u=COURSES[state.level][0];activeMock={unit:u,level:state.level,token:{},started:Date.now(),seconds:480};
 $("#practice-label").innerHTML='MUESTRA DELE '+state.level+' · <span class="mock-clock" id="mock-clock">8:00</span>';
 $("#practice-content").innerHTML='<h2 id="practice-title">Lectura y escucha · práctica breve</h2><p class="small-note">Seis preguntas, ocho minutos. Al terminar se muestran respuestas explicadas. Puedes detener el audio en cualquier momento.</p><form id="mock-form"><section class="mock-stimulus"><h3>1. Comprensión de lectura</h3><article class="passage"><h3>'+esc(u.reading.heading)+'</h3>'+esc(u.reading.text)+'</article>'+questionsHtml(u.reading,"mr")+'</section><section class="mock-stimulus"><h3>2. Comprensión auditiva</h3>'+audioHtml(u.listening)+questionsHtml(u.listening,"ml")+'</section><button class="button" type="submit">Terminar y revisar</button></form>';
 if(!$("#practice-dialog").open)$("#practice-dialog").showModal();
 mockTimer=setInterval(()=>{
  if(!activeMock)return;
  const remaining=Math.max(0,480-Math.floor((Date.now()-activeMock.started)/1000));activeMock.seconds=remaining;
  if($("#mock-clock")){$("#mock-clock").textContent=formatTime(remaining);$("#mock-clock").classList.toggle("urgent",remaining<60);}
  if(!remaining)finishMock(true);
 },1000);
}
function stopMock(){clearInterval(mockTimer);mockTimer=null;activeMock=null;}
function finishMock(timedOut=false){
 if(!activeMock)return;
 const m=activeMock,data=new FormData($("#mock-form")),reading=m.unit.reading.questions.map((q,i)=>data.has("mr"+i)?Number(data.get("mr"+i)):-1),listening=m.unit.listening.questions.map((q,i)=>data.has("ml"+i)?Number(data.get("ml"+i)):-1);
 if(!timedOut&&[...reading,...listening].includes(-1)){toast("Responde a las seis preguntas antes de terminar.");return;}
 const r=scoreAnswers(m.unit.reading,reading),l=scoreAnswers(m.unit.listening,listening),score=r.score+l.score;
 state.mockResults.push({level:m.level,score,total:6,at:new Date().toISOString()});persist();stopMock();stopListening(false);render();
 $("#practice-label").textContent="RESULTADOS · MUESTRA DELE "+m.level;
 $("#practice-content").innerHTML='<section class="summary-card"><div class="summary-icon">'+icon("check")+'</div><h2 id="practice-title">'+score+' de 6 respuestas correctas</h2><p>'+(timedOut?"El tiempo ha terminado. Las preguntas sin respuesta cuentan como incorrectas en esta muestra.":"Revisa las pistas y elige tu próximo objetivo de práctica.")+'</p><div class="summary-metrics"><div><strong>'+r.score+' / 3</strong><span>Lectura</span></div><div><strong>'+l.score+' / 3</strong><span>Escucha</span></div></div><p class="small-note">El resultado corresponde a esta muestra breve. No equivale a una nota DELE ni determina si aprobarías un examen oficial.</p></section><section class="feedback"><h3>Lectura: respuestas explicadas</h3>'+explanations(m.unit.reading,reading)+'</section><section class="feedback"><h3>Escucha: respuestas explicadas</h3>'+explanations(m.unit.listening,listening)+'</section><div class="button-row">'+practiceButton(m.unit,r.score<=l.score?"reading":"listening","Reforzar mi siguiente objetivo","button")+'<button class="button secondary" data-action="finish-mock">Volver a preparación DELE</button></div>';
}
const navigation={
 student:[["home","Mi aprendizaje","home"],["course","Mis cursos","book"],["dele","Simulacros DELE","quiz"],["plan","Plan de estudio","calendar"],["progress","Mi progreso","chart"]],
 teacher:[["dashboard","Resumen académico","chart"],["students","Estudiantes","people"],["assignments","Prácticas asignadas","calendar"],["reviews","Correcciones","pen"]]
};
const titles={
 home:["Tu español, paso a paso.","Un espacio para practicar, reforzar tus conocimientos y avanzar con confianza."],
 course:["Mis cursos","Español para estudiar, convivir y descubrir Quito."],
 dele:["Simulacros DELE","Practica con tiempo y convierte tus resultados en un siguiente paso."],
 plan:["Mi plan de estudio","Una práctica breve y estructurada para avanzar entre clases."],
 progress:["Mi progreso","Tus competencias, actividades y comentarios en un solo lugar."],
 dashboard:["Enseñar con una visión más clara.","Detecta necesidades, asigna refuerzo y acompaña el progreso de cada estudiante."],
 students:["Estudiantes","Observa avances y encuentra dónde conviene ofrecer apoyo."],
 assignments:["Prácticas asignadas","Del objetivo del docente a la práctica del estudiante."],
 reviews:["Correcciones","Comentarios concretos para mejorar la siguiente versión."]
};
function render(){
 if(!titles[view])view=role==="teacher"?"dashboard":"home";
 $("#page-title").textContent=titles[view][0];$("#page-subtitle").textContent=titles[view][1];
 $("#page-eyebrow").textContent=role==="teacher"?"VISTA DOCENTE · ESCUELA DE ESPAÑOL UDLA":"ESCUELA DE ESPAÑOL UDLA";
 $("#breadcrumb").textContent=navigation[role].find(x=>x[0]===view)?.[1]||"Aula de práctica";
 $("#nav-label").textContent=role==="teacher"?"SEGUIMIENTO ACADÉMICO":"TU APRENDIZAJE";
 $("#sidebar-context").textContent=role==="teacher"?"Grupos y datos ilustrativos":"Vida universitaria en Quito";
 $("#navigation").innerHTML=navigation[role].map(([id,label,ic])=>'<button class="nav-button '+(id===view?"active":"")+'" data-view="'+id+'"'+(id===view?' aria-current="page"':"")+'>'+icon(ic)+'<span>'+label+'</span></button>').join("");
 $("#student-role").setAttribute("aria-pressed",String(role==="student"));$("#teacher-role").setAttribute("aria-pressed",String(role==="teacher"));
 $("#profile-avatar").textContent=role==="teacher"?"DO":"AL";$("#profile-avatar").setAttribute("aria-label",role==="teacher"?"Docente, perfil ilustrativo":"Alex, perfil ilustrativo");
 $("#level-control").hidden=role==="teacher";$("#level-select").value=state.level;
 $("#content").innerHTML=({home,course,dele,plan,progress,dashboard:teacherDashboard,students:teacherStudents,assignments:teacherAssignments,reviews:teacherReviews}[view])();
}
function closeMenu(){
 const wasOpen=$("#sidebar").classList.contains("open"),mobile=window.matchMedia?.("(max-width:820px)").matches===true;
 $("#sidebar").classList.remove("open");$("#mobile-shade").hidden=true;$("#menu-button").setAttribute("aria-expanded","false");
 $("#sidebar").inert=mobile;
 if(mobile)$("#sidebar").setAttribute("aria-hidden","true");else $("#sidebar").removeAttribute("aria-hidden");
 if(wasOpen)$("#menu-button").focus();
}
function navigate(next,nextRole=role,updateHash=true){
 if(!["student","teacher"].includes(nextRole))return;
 role=nextRole;view=navigation[role].some(x=>x[0]===next)?next:role==="teacher"?"dashboard":"home";
 closeMenu();render();
 if(updateHash)history.replaceState(null,"","#"+(role==="teacher"?"docente/":"")+({home:"inicio",course:"cursos",dele:"dele",plan:"plan",progress:"progreso",dashboard:"resumen",students:"estudiantes",assignments:"asignaciones",reviews:"correcciones"}[view]));
 window.scrollTo({top:0,behavior:"instant"});$("#main").focus({preventScroll:true});
}
function readHash(){
 const hash=location.hash.slice(1),map={inicio:"home",cursos:"course",dele:"dele",plan:"plan",progreso:"progress",resumen:"dashboard",estudiantes:"students",asignaciones:"assignments",correcciones:"reviews"};
 if(hash.startsWith("docente")){role="teacher";view=map[hash.split("/")[1]]||"dashboard";}
 else {role="student";view=map[hash]||"home";if(!navigation.student.some(x=>x[0]===view))view="home";}
 render();
}
function setLevel(level){
 if(!["A2","B1"].includes(level))throw new Error("Nivel no disponible");
 state.level=level;persist();render();return courseStats();
}
function closePractice(){if($("#practice-dialog").open)$("#practice-dialog").close();cleanupPractice();stopMock();}
function closeDetail(){if($("#detail-dialog").open)$("#detail-dialog").close();}
function showReview(id){
 closeDetail();closePractice();selectedReview=id;reviewFilter="all";navigate("reviews","teacher");
}
function sampleTeacherFeedback(submission){
 const u=findUnit(submission.unit);
 return "Tu mensaje permite comprender la idea principal. Para preparar la siguiente versión, comprueba que desarrollas los tres puntos de la tarea y añade un ejemplo concreto. Usa un conector para relacionar tu propuesta con su razón. Relee la puntuación y la concordancia antes de enviarlo de nuevo. Objetivo de extensión: "+u.writing.min+"–"+u.writing.max+" palabras.";
}
document.addEventListener("click",event=>{
 const button=event.target.closest("[data-action],[data-view],[data-role]");
 if(!button)return;
 if(button.dataset.role){closeDetail();closePractice();navigate(button.dataset.role==="teacher"?"dashboard":"home",button.dataset.role);return;}
 if(button.dataset.view){event.preventDefault();navigate(button.dataset.view,button.classList.contains("brand")?"student":role);return;}
 const action=button.dataset.action;
 if(action==="practice"){closeDetail();openPractice(button.dataset.unit,button.dataset.skill);}
 else if(action==="close-practice")closePractice();
 else if(action==="close-detail")closeDetail();
 else if(action==="about")$("#about-dialog").showModal();
 else if(action==="close-about")$("#about-dialog").close();
 else if(action==="listen")listen(1);
 else if(action==="listen-slow")listen(.78);
 else if(action==="stop-listening")stopListening();
 else if(action==="review-writing")reviewWriting();
 else if(action==="submit-writing")submitWriting();
 else if(action==="sample-writing"){
  $("#writing-response").value=activePractice.unit.writing.model;updateWordCount();
  document.querySelectorAll('input[name="writing-check"]').forEach(input=>input.checked=true);
  $("#activity-feedback").innerHTML="";toast("Texto ilustrativo cargado para explorar la revisión.");
 }
 else if(action==="record")void startRecording();
 else if(action==="speak-timer"){
  if(recorder||practiceTimer){toast("Detén la práctica actual antes de iniciar otra.");return;}
  if(recordingUrl){URL.revokeObjectURL(recordingUrl);recordingUrl=null;$("#recording-playback").hidden=true;$("#recording-playback").removeAttribute("src");}
  runSpeakingTimer();$("#record-status").textContent="Práctica en voz alta. Usa el temporizador y pulsa detener cuando termines.";
 }
 else if(action==="stop-speaking"){stopSpeaking();if(!recordingUrl&&$("#record-status"))$("#record-status").textContent="Práctica detenida. Revisa los puntos de autoevaluación.";}
 else if(action==="review-speaking")reviewSpeaking();
 else if(action==="unit-summary")unitSummary();
 else if(action==="finish-unit"){closePractice();navigate("home","student");}
 else if(action==="teacher-dashboard"){closePractice();navigate("dashboard","teacher");}
 else if(action==="review-current-writing"){const sub=latestSubmission("alex",activePractice.unit.id);if(sub)showReview(sub.id);}
 else if(action==="start-mock")startMock();
 else if(action==="finish-mock"){closePractice();navigate("dele","student");}
 else if(action==="pathway"){
  state.pathway=button.dataset.path;if(state.pathway==="intensive")state.level="B1";
  persist();navigate(state.pathway==="intensive"?"course":"dele","student");
 }
 else if(action==="level"){setLevel(button.dataset.level);navigate("course","student");}
 else if(action==="outline")openOutline(button.dataset.level);
 else if(action==="example-b1"){closeDetail();navigate("home","student");openPractice("b1-3","reading");}
 else if(action==="learner")openLearner(button.dataset.learner);
 else if(action==="assign")openAssign(button.dataset.learner||"alex",button.dataset.skill||"listening");
 else if(action==="open-review")showReview(button.dataset.review);
 else if(action==="select-review"){selectedReview=button.dataset.review;render();}
 else if(action==="support-list"){teacherFilters.attention="support";navigate("students","teacher");}
 else if(action==="all-reviews"){reviewFilter="all";render();}
 else if(action==="sample-feedback"){
  const submission=state.submissions.find(s=>s.id===selectedReview);
  $("#teacher-feedback").value=sampleTeacherFeedback(submission);
  toast("Comentario de ejemplo cargado. Puedes ajustarlo antes de guardarlo.");
 }
 else if(action==="student-progress"){
  const submission=state.submissions.find(s=>s.id===selectedReview);
  if(submission?.learner==="alex"){state.level=submission.level;persist();}
  closeDetail();closePractice();navigate("progress","student");
 }
 else if(action==="reset")$("#reset-dialog").showModal();
 else if(action==="cancel-reset")$("#reset-dialog").close();
 else if(action==="confirm-reset"){
  closePractice();closeDetail();$("#reset-dialog").close();if($("#about-dialog").open)$("#about-dialog").close();
  state=seedState();selectedReview=null;teacherFilters={search:"",level:"all",attention:"all"};persist();render();toast("Datos ilustrativos iniciales restaurados.");
 }
});
document.addEventListener("submit",event=>{
 const form=event.target;
 if(form.id==="quiz-form"){event.preventDefault();reviewQuiz(form);}
 else if(form.id==="mock-form"){event.preventDefault();finishMock();}
 else if(form.id==="assignment-form"){
  event.preventDefault();const [unit,skill]=$("#assignment-task").value.split("|");
  try{
   createAssignment({learner:$("#assignment-learner").value,unit,skill,due:$("#assignment-due").value,note:$("#assignment-note").value});
   closeDetail();render();toast("Práctica asignada. Puedes consultar su estado en Prácticas asignadas.");
  }catch(error){toast(error.message);}
 }
 else if(form.id==="teacher-review-form"){
  event.preventDefault();
  try{
   saveTeacherReview(form.dataset.review,{feedback:$("#teacher-feedback").value,status:$("#review-status").value,rubric:{content:$("#rubric-content").value,organisation:$("#rubric-organisation").value,clarity:$("#rubric-clarity").value}});
   const submission=state.submissions.find(s=>s.id===form.dataset.review);
   render();toast(submission.learner==="alex"?"Comentario guardado. La entrega de Alex aparece actualizada en su progreso.":"Comentario guardado en el perfil ilustrativo.");
  }catch(error){toast(error.message);}
 }
});
document.addEventListener("input",event=>{
 if(event.target.id==="writing-response"){updateWordCount();$("#activity-feedback").innerHTML="";}
 else if(event.target.id==="learner-search"){
  teacherFilters.search=event.target.value;const learners=filteredLearners();
  $("#learner-table-results").innerHTML=(learners.length?learnerTable(learners):'<div class="empty-state"><h3>No hay coincidencias</h3><p>Prueba otro nombre o cambia los filtros.</p></div>')+'<p class="table-footer">'+learners.length+' perfiles · datos ilustrativos</p>';
 }
});
document.addEventListener("change",event=>{
 const id=event.target.id;
 if(id==="level-select")setLevel(event.target.value);
 else if(id==="cohort-level"||id==="student-level-filter"){teacherFilters.level=event.target.value;render();}
 else if(id==="attention-filter"){teacherFilters.attention=event.target.value;render();}
 else if(id==="review-filter"){reviewFilter=event.target.value;render();}
 else if(id==="assignment-learner"){
  const l=LEARNERS.find(x=>x.id===event.target.value);$("#assignment-task").innerHTML=assignmentOptions(l.level);
 }
});
$("#menu-button").addEventListener("click",()=>{
 const opened=$("#sidebar").classList.toggle("open");$("#mobile-shade").hidden=!opened;$("#menu-button").setAttribute("aria-expanded",String(opened));
 $("#sidebar").inert=!opened;if(opened)$("#sidebar").removeAttribute("aria-hidden");else $("#sidebar").setAttribute("aria-hidden","true");
 if(opened)$("#navigation button")?.focus();
});
$("#mobile-shade").addEventListener("click",closeMenu);
document.addEventListener("keydown",event=>{if(event.key==="Escape")closeMenu();});
$("#practice-dialog").addEventListener("close",()=>{if(!$("#practice-dialog").open){cleanupPractice();stopMock();$("#main").focus({preventScroll:true});}});
window.addEventListener("pagehide",()=>{cleanupPractice();stopMock();});
window.addEventListener("hashchange",()=>{closePractice();closeDetail();readHash();});
window.matchMedia?.("(max-width:820px)").addEventListener?.("change",closeMenu);
document.querySelectorAll("[data-icon]").forEach(el=>el.innerHTML=icon(el.dataset.icon));
function registerAgentTools(){
 if(!navigator.modelContext?.registerTool)return;
 const tools=[
  {name:"read_progress",description:"Read the illustrative student progress and teacher dashboard summary.",inputSchema:{type:"object",properties:{}},execute:async()=>({content:[{type:"text",text:JSON.stringify({level:state.level,progress:courseStats(),learners:learnerData(),assignments:state.assignments.length,pendingReviews:state.submissions.filter(s=>s.status==="pending").length})}]})},
  {name:"navigate_learning_demo",description:"Navigate this conceptual demo to a student or teacher view.",inputSchema:{type:"object",properties:{role:{type:"string",enum:["student","teacher"]},view:{type:"string",enum:["home","course","dele","plan","progress","dashboard","students","assignments","reviews"]}},required:["role","view"]},execute:async args=>{closePractice();closeDetail();navigate(args.view,args.role);return{content:[{type:"text",text:JSON.stringify({role,view})}]};}}
 ];
 tools.forEach(tool=>{try{navigator.modelContext.registerTool(tool);}catch{/* Host may already have a tool with this name. */}});
}
readHash();closeMenu();registerAgentTools();
