import json, os, sys
D = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(D)
TOPICO = 'bandaok-horst-95a7bd6d10'
URL_PUB = 'https://brunomad87.github.io/Bandaok-do-Horst/'
BANDA = 'banda-k7q2'
P = json.load(open(os.path.join(D, 'dados.json'), encoding='utf8'))
sys.path.insert(0, D)
from estilos import ORDEM
comum = open(os.path.join(D, 'comum.js'), encoding='utf8').read().replace('__TOPICO__', TOPICO)
engine = open(os.path.join(D, 'engine.js'), encoding='utf8').read()
import html
cat = [{'t': m['t'], 'a': m['a'], 's': m['s']} for m in P['M']]
cat.sort(key=lambda c: c['t'].lower())
js = lambda o: json.dumps(o, ensure_ascii=False).replace('</', '<\\/')

pub = open(os.path.join(D, 'pub.tpl.html'), encoding='utf8').read()
pub = pub.replace('__CATALOGO__', js(cat)).replace('__ESTILOS__', js(ORDEM)).replace('__COMUM__', comum)
banda = open(os.path.join(D, 'banda.tpl.html'), encoding='utf8').read()
for k, v in [('__ESTILO__', P['style']), ('__SECOES__', '\n'.join(P['secs'])), ('__M__', js(P['M'])), ('__ESTILOS__', js(ORDEM)),
             ('__ENGINE__', engine), ('__COMUM__', comum), ('__URL_PUB__', URL_PUB)]:
    banda = banda.replace(k, v)
os.makedirs(os.path.join(OUT, BANDA), exist_ok=True)
open(os.path.join(OUT, 'index.html'), 'w', encoding='utf8').write(pub)
open(os.path.join(OUT, BANDA, 'index.html'), 'w', encoding='utf8').write(banda)
open(os.path.join(OUT, '.nojekyll'), 'w').write('')
print('ok', len(pub), len(banda), len(cat))
