import re,os,json,html,unicodedata
D='/home/claude/cx_in/cx'
CH=re.compile(r"^\(?[A-G][#b]?(?:m|M|maj|min|dim|aug|sus|add|º|°|\+|-)?[0-9()#b+\-º°/M9a-z,.]*(?:/[A-G][#b]?[0-9]*)?\)?\*?$")
def ischord(tok):
    if not CH.match(tok):return False
    core=re.sub(r'^\(|\)$|\*$','',tok)
    rest=re.sub(r'^[A-G][#b]?','',core)
    if re.search(r'[a-z]{2,}',rest) and not re.search(r'(maj|min|dim|aug|sus|add)',rest):return False
    return True
NOISE=re.compile(r'^([A-Za-zÀ-ú]+:|\[.*?\]|\(?\d+x\)?|x\d+|\||\|\||-|–|\.\.\.|N\.?C\.?|\(|\)|riff|:)$',re.I)
def boldline(l):
    if re.match(r'^\s*[EADGBe]\|',l) or '|-' in l or '-|' in l:return html.escape(l,False),False
    toks=l.split()
    if not toks:return '',False
    cs=[t for t in toks if ischord(t)]
    if not cs or any(not(ischord(t) or NOISE.match(t)) for t in toks):return html.escape(l,False),False
    out=re.sub(r'\S+',lambda m:('<b>'+html.escape(m.group(0),False)+'</b>') if ischord(m.group(0)) else html.escape(m.group(0),False),l)
    return out,True
def limpa_titulo(t):
    t=re.sub(r'_(?=[A-Za-z])','/',t).replace('_','?')
    t=re.sub(r'\s*\(part\..*?\)','',t).strip()
    return t
def parse(f):
    b=f[:-len(' - Cifra Club.txt')];t,a=b.rsplit(' - ',1);t=limpa_titulo(t)
    L=open(os.path.join(D,f),encoding='utf8').read().replace('\f','').split('\n')
    k='';capo='';start=2
    for i,l in enumerate(L[:20]):
        s=l.strip()
        m=re.match(r'Tom:\s*(.*)',s)
        if m:k=m.group(1).strip();start=i+1
        if s.startswith('Afinação') or s.startswith('Composição'):start=i+1
        m=re.match(r'Capotraste:\s*(.*)',s)
        if m:capo=m.group(1).strip();start=i+1
    body=[l.rstrip() for l in L[start:]]
    # corta diagramas de acorde no fim
    def isdig(l):return bool(l.strip()) and re.fullmatch(r'[\d\s]+',l.strip()) is not None
    def isch(l):
        tk=l.split();return bool(tk) and all(ischord(x) for x in tk)
    cut=len(body)
    for i in range(len(body)):
        if isch(body[i]):
            j=i+1
            while j<len(body) and not body[j].strip():j+=1
            if j<len(body) and isdig(body[j]) and all((not x.strip()) or isdig(x) or isch(x) for x in body[i:]):cut=i;break
    body=body[:cut]
    # tira linha que e so numero de pagina perdido
    txt='\n'.join(body).strip('\n')
    txt=re.sub(r'\n{3,}','\n\n',txt)
    lines=txt.split('\n')
    # desindenta comum
    ind=min((len(x)-len(x.lstrip()) for x in lines if x.strip()),default=0)
    lines=[x[ind:] for x in lines]
    out=[];nb=0
    if capo:out.append('Capo: '+html.escape(capo,False));out.append('')
    for l in lines:
        h,isc=boldline(l);out.append(h);nb+=isc
    cols=max([len(x) for x in lines]+[20])
    return {'t':t,'a':a,'k':k,'pre':'\n'.join(out),'cols':min(cols,90),'nb':nb}
if __name__=='__main__':
    for f in ['Wonderwall - Oasis - Cifra Club.txt','Hey Jude - The Beatles - Cifra Club.txt','Onde Você Mora_ - Cidade Negra - Cifra Club.txt']:
        r=parse(f);print(r['t'],'|',r['a'],'|',r['k'],r['cols'],r['nb']);print(r['pre'][:700]);print('...',r['pre'][-300:]);print('=====')
