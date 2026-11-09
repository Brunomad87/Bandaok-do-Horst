/* ---- fila compartilhada (ntfy.sh): cada acao e um evento; o estado e o replay ---- */
var SRV=(function(){try{return new URLSearchParams(location.search).get('srv')}catch(e){return null}})()||'https://ntfy.sh';
var TOPICO='__TOPICO__';
function esc(t){return String(t==null?'':t).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function lsx(k,v){try{return v===undefined?localStorage.getItem(k):localStorage.setItem(k,v)}catch(e){return null}}
function novoId(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function evDe(o){
 if(!o||o.event!=='message')return null;
 try{var e=JSON.parse(o.message);if(!e||!e.k)return null;e._t=o.time;e._id=o.id;return e}catch(x){return null}
}
function ler(){
 return fetch(SRV+'/'+TOPICO+'/json?poll=1&since=all',{cache:'no-store'}).then(function(r){
  if(!r.ok)throw new Error('http '+r.status);return r.text()}).then(function(tx){
  return tx.split('\n').filter(Boolean).map(function(l){try{return evDe(JSON.parse(l))}catch(x){return null}}).filter(Boolean)});
}
function manda(e){
 /* corpo texto puro = requisicao simples, sem preflight de CORS */
 return fetch(SRV+'/'+TOPICO,{method:'POST',body:JSON.stringify(e)}).then(function(r){
  if(!r.ok)throw new Error('http '+r.status);return r.json()});
}
function estado(evs){
 var Q={},ord=[],oc=[];
 evs.forEach(function(e){
  if(e.k==='reset'){Q={};ord=[]}
  else if(e.k==='ped'){if(e.id&&!Q[e.id]){Q[e.id]={id:e.id,m:String(e.m||'').slice(0,80),n:String(e.n||'').slice(0,30),d:e.d,t:e._t,s:'fila'};ord.push(e.id)}}
  else if(e.k==='st'){if(Q[e.id]){Q[e.id].s=e.s;Q[e.id].ts=e._t}}
  else if(e.k==='oculta'){oc=Array.isArray(e.l)?e.l:[]}
 });
 var L=ord.map(function(i){return Q[i]});
 return {Q:Q,
  agora:L.filter(function(q){return q.s==='agora'}),
  fila:L.filter(function(q){return q.s==='fila'}),
  feitas:L.filter(function(q){return q.s==='feita'||q.s==='pulada'}).sort(function(a,b){return (b.ts||0)-(a.ts||0)}),
  oc:oc};
}
