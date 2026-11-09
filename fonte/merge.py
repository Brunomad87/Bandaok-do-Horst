import json,os,html,re,sys
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from novas import parse,D
from estilos import estilo
from match import n
P=json.load(open('parts.json'))
M=[];S=[];fora=[]
for i,m in enumerate(P['M']):
    a=html.unescape(P['arts'][i]);m=dict(m);m['a']=a;m['s']=estilo(a);M.append(m);S.append(P['secs'][i])
tem={n(m['t']) for m in M}
novas=[parse(f) for f in sorted(os.listdir(D))]
for r in novas:
    if n(r['t']) in tem:continue
    if r['nb']==0:fora.append(f"{r['t']} ({r['a']})");continue
    M.append({'t':r['t'],'k':r['k'],'a':r['a'],'s':estilo(r['a']),'_pre':r['pre'],'_cols':r['cols']})
# titulos repetidos ganham o artista
from collections import Counter
c=Counter(m['t'] for m in M)
for m in M:
    if c[m['t']]>1:m['t']=m['t']+' ('+m['a']+')'
for i,m in enumerate(M):
    if '_pre' in m:
        S.append(f'<section id="m{i}" data-cols="{m.pop("_cols")}" hidden><h2>{html.escape(m["t"],False)}<em>{html.escape(m["a"],False)}</em></h2><pre>{m.pop("_pre")}</pre></section>')
json.dump({'style':P['style'],'secs':S,'M':M},open('dados.json','w'),ensure_ascii=False)
print(len(M),'musicas; fora:',fora)
from collections import Counter as C;print(C(m['s'] for m in M))
