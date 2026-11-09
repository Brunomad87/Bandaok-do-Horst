import re,json,os,unicodedata
def n(t):
    t=unicodedata.normalize('NFD',t.lower());t=''.join(c for c in t if unicodedata.category(c)!='Mn')
    t=re.sub(r'\(.*?\)','',t);t=t.replace('’',"'").replace('_','/')
    t=re.sub(r"[^a-z0-9]+",' ',t).strip()
    t=re.sub(r'^(oh|a|o|the) ','',t)
    return t
P=json.load(open('parts.json'))
app={n(m['t']):m['t'] for m in P['M']}
pdfs={}
for f in os.listdir('/home/claude/cx_in/cx'):
    b=f[:-len(' - Cifra Club.txt')];t,a=b.rsplit(' - ',1);pdfs[n(t)]=(t,a,f)
def _main():
    om=[];cat=None
    for l in open('/mnt/user-data/uploads/a5d6dfce-SET_LISTS_OPEN_MIC'):
        m=re.match(r'### \*\*\S+\s+(.*?)\*\*',l)
        if m:cat=m.group(1);continue
        m=re.match(r'\\#(\d+) (.*?) – (.*)',l.strip())
        if m:om.append((cat,m.group(2),m.group(3).replace('\\','')))
    alias={'sorri sou rei':'sorri sou rei','descobridor dos sete mares':'descobridor dos sete mares','xodo':'eu so quero um xodo','camila':'camila camila','astronauta de marmore':'astronauta de marmore','sombra da maldade':'sombra da maldade','estrada':'estrada','me abraca e me beija':'me abraca','onde quer que eu va':'aonde quer que eu va','quando o sol se por':'quando o sol se for','reggae das tramandai':'reggae das tramanda','cancao pra lua':'tal cancao pra lua','girls just wanna have fun':'girls just want to have fun','w brasil':'w brasil','pretty woman':'pretty woman','baby one more time':'baby one more time'}
    falta=[];seen=set();res=[]
    for c,a,t in om:
        k=n(t);k=alias.get(k,k)
        if (k,a) in seen:continue
        seen.add((k,a))
        src='app' if k in app else ('pdf' if k in pdfs else None)
        res.append((c,a,t,src))
        if not src:falta.append(f'{a} – {t}')
    print(len(res),'unicas;',sum(1 for r in res if r[3]=='app'),'no app;',sum(1 for r in res if r[3]=='pdf'),'na pasta;',len(falta),'faltam')
    print('\n'.join(falta))
    usados={alias.get(n(t),n(t)) for c,a,t in om}
    extra=[v for k,v in pdfs.items() if k not in usados and k not in app]
    print('\nEXTRAS na pasta fora da lista:',len(extra));print('; '.join(f'{t} ({a})' for t,a,f in sorted(extra)))
    dup=[v[0] for k,v in pdfs.items() if k in app];print('\nPDF que ja estao no app:',len(dup))
    

if __name__=='__main__':_main()
