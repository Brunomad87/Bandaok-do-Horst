var vel=18,tocando=false,ult=0,acc=0,raf=null,fimAuto=false;
function G(id){return document.getElementById(id)}
/* velocidade gravada POR TITULO (nao por indice: a ordem muda e embaralhava tudo) */
function vk(i){return 'mad_v:'+M[i].t}
function ls(k,v){try{return v===undefined?localStorage.getItem(k):localStorage.setItem(k,v)}catch(e){return null}}
var _a=ls('mad_aj'); if(_a)aj=+_a;
var _t=ls('mad_tema'); if(_t!==null)document.documentElement.dataset.t=_t;

function fit(){
 if(cur<0)return 0;
 var sec=G('m'+cur),pre=sec.querySelector('pre'),c=+sec.dataset.cols||50;
 var w=(document.documentElement.clientWidth-20)/c/0.601;
 /* o teto de 32 e so do calculo automatico; o aj do A-/A+ soma DEPOIS,
    senao em tela larga w ja passa de 32 e os botoes nao fazem nada */
 var f=Math.max(8,Math.min(72,Math.max(9,Math.min(32,w))+aj));
 pre.style.fontSize=f+'px';
 return f;
}
function mostraVel(){G('vel').textContent=Math.round(vel)+' px/s'}
function pinta(){
 var a=G('b-play'),b=G('b-play2');
 if(a){a.innerHTML=tocando?'&#10073;&#10073;':'&#9654;';a.classList.toggle('on',tocando)}
 if(b){b.innerHTML=tocando?'&#10073;&#10073; PAUSA':'&#9654; ROLAR';b.classList.toggle('on',tocando)}
}
function play(){
 if(tocando)return;
 tocando=true;ult=0;acc=0;pinta();
 raf=requestAnimationFrame(passo);trava();
}
function pausa(){
 fimAuto=false;tocando=false;pinta();
 if(raf)cancelAnimationFrame(raf);raf=null;
}
function passo(ts){
 if(!tocando)return;
 if(!ult)ult=ts;
 var dt=(ts-ult)/1000;ult=ts;
 if(dt>0.4)dt=0;
 acc+=vel*dt;
 var px=Math.floor(acc);
 if(px>=1){acc-=px;var a=scrollY;scrollTo(0,scrollY+px);
  if(scrollY===a){pausa();fimAuto=true;return}}
 raf=requestAnimationFrame(passo);
}
function setVel(v){
 vel=Math.max(4,Math.min(160,v));mostraVel();
 if(cur>=0)ls(vk(cur),vel);
}
function trava(){if(!navigator.wakeLock||lock)return;
 navigator.wakeLock.request('screen').then(function(l){lock=l;
  l.addEventListener('release',function(){lock=null})}).catch(function(){})}
document.addEventListener('visibilitychange',function(){
 if(document.hidden)pausa(); else if(cur>=0)trava()});

G('b-mais').onclick=function(){aj+=1.5;ls('mad_aj',aj);var f=fit();if(f)flash(Math.round(f)+' px',1)};
G('b-menos').onclick=function(){aj-=1.5;ls('mad_aj',aj);var f=fit();if(f)flash(Math.round(f)+' px',1)};
/* TOPO: volta pro comeco da musica. se estava rolando (ou parou sozinho no fim), segue rolando */
G('b-topo').onclick=function(){var seguir=tocando||fimAuto;pausa();scrollTo(0,0);flash('TOPO',1);if(seguir)play()};
G('b-tema').onclick=function(){var d=document.documentElement;
 d.dataset.t=d.dataset.t==='dark'?'':'dark';ls('mad_tema',d.dataset.t)};
G('b-play').onclick=function(){tocando?pausa():play()};
G('b-pv').onclick=function(){setVel(vel*1.25)};
G('b-mv').onclick=function(){setVel(vel/1.25)};

function flash(t,sm){var f=G('flash');if(!f)return;f.innerHTML=t;
 f.classList.remove('on');f.classList.remove('sm');if(sm)f.classList.add('sm');
 void f.offsetWidth;f.classList.add('on')}

/* ---- toque na cifra ----
   encostar: para na hora. encostar de novo: volta. arrastar: rola na mao e fica parado.
   a <section> tem touch-action:none, entao o navegador nao rola nem dispara
   pointercancel no meio do gesto -- era isso que comia o play no palco.
   em troca, a rolagem manual e feita aqui (vertical na pagina, horizontal no <pre>). */
var px0=0,py0=0,pxl=0,pyl=0,dn=false,mov=false,era=false,hor=false;
function noCorpo(e){
 return cur>=0 && !(e.target.closest&&e.target.closest('#nav,#bar,#pedal,#tp,#sh'));
}
document.addEventListener('pointerdown',function(e){
 if(!noCorpo(e))return;
 px0=pxl=e.clientX;py0=pyl=e.clientY;dn=true;mov=false;hor=false;era=tocando;
 if(tocando){pausa();flash('&#10073;&#10073;')}
},{passive:true});
document.addEventListener('pointermove',function(e){
 if(!dn)return;
 var dx=e.clientX-pxl,dy=e.clientY-pyl;
 if(!mov&&(Math.abs(e.clientX-px0)>14||Math.abs(e.clientY-py0)>14)){
  mov=true;hor=Math.abs(e.clientX-px0)>Math.abs(e.clientY-py0)*1.6;
 }
 if(mov){
  if(hor){var s=G('m'+cur),pre=s&&s.querySelector('pre');if(pre)pre.scrollLeft-=dx}
  else scrollBy(0,-dy);
 }
 pxl=e.clientX;pyl=e.clientY;
},{passive:true});
function solta(){
 if(!dn)return;dn=false;
 if(cur<0||mov)return;
 if(!era){play();flash('&#9654;')}
}
document.addEventListener('pointerup',solta);
document.addEventListener('pointercancel',solta);

/* ---- pedal: passador de pagina em modo teclado (HID) ou MIDI ---- */
var PADRAO={tog:'Space',prox:'ArrowRight',ant:'ArrowLeft'};
var PED={tog:PADRAO.tog,prox:PADRAO.prox,ant:PADRAO.ant},ouv=null;
try{var _pd=ls('mad_pedal');if(_pd){var o=JSON.parse(_pd);if(o&&o.tog!==undefined)PED=o}}catch(e){}
function nomeSinal(s){
 if(!s)return '\u2014';
 if(s.indexOf('m:')===0){var p=s.split(':');
  return 'MIDI '+(p[1]==='cc'?'CC '+p[2]:'nota '+p[2])+' \u00b7 ch '+p[3]}
 return s;
}
function pedPinta(){
 ['tog','prox','ant'].forEach(function(k){
  var v=G('pv-'+k),l=G('pl-'+k);
  if(v)v.textContent=nomeSinal(PED[k]);
  if(l)l.classList.toggle('ouvindo',ouv===k);
 });
}
function pedSinal(s){
 var el=G('psig');if(el)el.textContent='recebido: '+nomeSinal(s);
 if(ouv){PED[ouv]=s;ouv=null;ls('mad_pedal',JSON.stringify(PED));pedPinta();return true}
 return false;
}
function pedAgir(s){
 if(cur<0)return false;
 if(s===PED.tog){tocando?pausa():play();flash(tocando?'&#9654;':'&#10073;&#10073;');return true}
 if(s===PED.prox){acaoProx();return true}
 if(s===PED.ant){acaoAnt();return true}
 return false;
}
addEventListener('keydown',function(e){
 if(e.metaKey||e.ctrlKey||e.altKey)return;
 var tg=e.target&&e.target.tagName;
 if(tg==='INPUT'||tg==='TEXTAREA')return;
 var s=e.code||e.key;
 if(pedSinal(s)){e.preventDefault();return}
 if(pedAgir(s))e.preventDefault();
});
function midiMsg(ev){
 var d=ev.data,st=d[0]&0xf0,ch=(d[0]&0x0f)+1,s=null;
 if(st===0x90&&d[2]>0)s='m:nota:'+d[1]+':'+ch;
 else if(st===0xb0&&d[2]>0)s='m:cc:'+d[1]+':'+ch;
 if(!s)return;
 if(pedSinal(s))return;
 pedAgir(s);
}
function midiOn(){
 var el=G('pmidi');
 if(!navigator.requestMIDIAccess){
  if(el)el.textContent='este navegador nao tem Web MIDI aqui -- use o pedal em modo teclado Bluetooth';return}
 if(el)el.textContent='pedindo acesso MIDI...';
 navigator.requestMIDIAccess({sysex:false}).then(function(a){
  function liga(){var ns=[];a.inputs.forEach(function(i){ns.push(i.name);i.onmidimessage=midiMsg});
   if(el)el.textContent=ns.length?('MIDI ligado: '+ns.join(', ')):'MIDI ligado, nenhuma entrada vista ainda';}
  liga();a.onstatechange=liga;
 }).catch(function(err){if(el)el.textContent='MIDI indisponivel ('+(err&&err.name||'erro')+')'});
}
var bp=G('b-ped');if(bp)bp.onclick=function(){G('pedal').style.display='flex';ouv=null;pedPinta()};
var bf=G('b-pfecha');if(bf)bf.onclick=function(){ouv=null;G('pedal').style.display='none';pedPinta()};
var bz=G('b-pzero');if(bz)bz.onclick=function(){
 PED={tog:PADRAO.tog,prox:PADRAO.prox,ant:PADRAO.ant};
 ls('mad_pedal',JSON.stringify(PED));pedPinta();G('psig').textContent='voltou ao padrao';};
var bm=G('b-pmidi');if(bm)bm.onclick=midiOn;
var pd=G('pedal');if(pd)pd.addEventListener('click',function(e){
 var b=e.target.closest&&e.target.closest('button[data-a]');
 if(b){b.blur();ouv=b.dataset.a;G('psig').textContent='pise no pedal agora...';pedPinta()}
});
pedPinta();

addEventListener('resize',fit);
addEventListener('orientationchange',function(){setTimeout(fit,120)});
/* ---- TOM (transpose) por musica: mad_tr:<titulo> = semitons ----
   so mexe nos <b> (acordes). cada acorde fica na coluna original; se o vizinho cresceu,
   empurra o minimo e mantem 1 espaco onde havia espaco. letra nao muda. */
var TR_ORIG={},NS=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],NF=['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
var FLAT_MAJ=[0,1,0,1,0,1,0,0,1,0,1,0],FLAT_MIN=[1,0,1,1,0,1,0,1,0,0,1,0];
var SEM={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
function semi(l,a){return (SEM[l]+(a==='#'?1:a==='b'?-1:0)+12)%12}
function tomBase(i){var m=/^([A-G])(#|b)?(m(?!aj))?/.exec(M[i].k||'');return m?{n:semi(m[1],m[2]),mi:!!m[3]}:null}
function trDe(i){var v=+(ls('mad_tr:'+M[i].t)||0);return ((v%12)+12)%12}
function trTxt(t){t=t>6?t-12:t;return t===0?'':(t>0?'+'+t:'−'+(-t))}
function tomNome(b,t){var n=(b.n+t)%12,fl=(b.mi?FLAT_MIN:FLAT_MAJ)[n];return (fl?NF:NS)[n]+(b.mi?'m':'')}
function acorde(c,t,fl){
 var A=fl?NF:NS;
 function r(_,l,a){return A[(semi(l,a)+t)%12]}
 return c.replace(/^([A-G])(#|b)?/,r).replace(/\/([A-G])(#|b)?/,function(_,l,a){return '/'+A[(semi(l,a)+t)%12]});
}
function vlen(h){return h.replace(/&[a-z0-9#]+;/gi,'x').length}
function linhaTr(ln,t,fl){
 if(ln.indexOf('<b>')<0)return ln;
 var re=/<b>([\s\S]*?)<\/b>|( +)|([^< ]+)/g,m,out='',oc=0,c=0,gap=false;
 while((m=re.exec(ln))){
  if(m[2]!==undefined){c+=m[2].length;gap=true;continue}
  var orig,novo,bold=m[1]!==undefined;
  if(bold){orig=vlen(m[1]);var nv=/^[A-G]/.test(m[1])?acorde(m[1],t,fl):m[1];novo='<b>'+nv+'</b>';var nl=vlen(nv)}
  else{orig=vlen(m[3]);novo=m[3];var nl=orig}
  var pad=c-oc;if(gap&&pad<1)pad=1;if(pad<0)pad=0;
  out+=' '.repeat(pad)+novo;oc+=pad+nl;c+=orig;gap=false;
 }
 return out;
}
function tomAplica(i){
 var b=tomBase(i),bt=G('b-tom'),pre=G('m'+i).querySelector('pre');
 if(!(i in TR_ORIG))TR_ORIG[i]=pre.innerHTML;
 var t=b?trDe(i):0;
 if(!b){bt.disabled=true;bt.textContent='TOM';bt.classList.remove('on');G('tp').classList.remove('on');pre.innerHTML=TR_ORIG[i];return}
 bt.disabled=false;
 var fl=(b.mi?FLAT_MIN:FLAT_MAJ)[(b.n+t)%12];
 pre.innerHTML=t?TR_ORIG[i].split('\n').map(function(l){return linhaTr(l,t,fl)}).join('\n'):TR_ORIG[i];
 var nome=tomNome(b,t),dt=trTxt(t);
 bt.textContent=t?nome:'TOM';bt.classList.toggle('on',!!t);
 G('tp-v').innerHTML=nome+'<small>'+(t?'original '+tomNome(b,0)+' · '+dt:'original')+'</small>';
 var ni=G('now').querySelector('i');if(ni)ni.textContent=t?(nome+' ('+dt+')'):M[i].k;
 [].forEach.call(document.querySelectorAll('a[data-i="'+i+'"] .k'),function(k){
  if(k.dataset.k0===undefined)k.dataset.k0=k.textContent;
  k.textContent=t?k.dataset.k0.replace(/^[A-G](#|b)?m?/,nome+' ('+dt+')'):k.dataset.k0});
}
function tomMuda(d){if(cur<0||!tomBase(cur))return;var t=d===0?0:(trDe(cur)+d+12)%12;
 ls('mad_tr:'+M[cur].t,t);tomAplica(cur);fit();flash(tomNome(tomBase(cur),t),1)}
G('b-tom').onclick=function(){G('tp').classList.toggle('on')};
G('tp-m').onclick=function(){tomMuda(-1)};
G('tp-p').onclick=function(){tomMuda(1)};
G('tp-0').onclick=function(){tomMuda(0)};
/* indice ja mostra o tom transposto */
(function(){for(var i=0;i<M.length;i++){var b=tomBase(i),t=b?trDe(i):0;if(!t)continue;var nome=tomNome(b,t),dt=trTxt(t);
 [].forEach.call(document.querySelectorAll('a[data-i="'+i+'"] .k'),function(k){k.dataset.k0=k.textContent;
  k.textContent=k.dataset.k0.replace(/^[A-G](#|b)?m?/,nome+' ('+dt+')')})}})();
pinta();
