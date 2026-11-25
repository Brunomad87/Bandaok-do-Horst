# BANDAOKE do Horst

Karaokê com banda ao vivo.

- Público (QR das mesas): https://brunomad87.github.io/Bandaok-do-Horst/
- Banda (tablet): /banda-k7q2/ — não divulgar

A fila passa pelo ntfy.sh (tópico no `fonte/build.py`). O servidor guarda as mensagens por ~12 h; usar "NOVA NOITE" no início de cada show.
Para mexer: editar os templates em `fonte/` e rodar `python3 fonte/build.py .` na raiz.

## Regras fixas
- **O QR das mesas não muda**: endereço público (raiz) e tópico do ntfy (`fonte/build.py`) ficam como estão.
- **Só o tablet do Mad puxa** (chamar, pular, cantou, nova noite, ocultar). Liga com `?mad=1` no link da banda (fica salvo no aparelho; `?mad=0` desliga; `?mestre=1` também funciona). Selo no topo: MAD / BANDA. Eventos `st/reset/oculta/rank` sem `ms:1` são ignorados. Os outros tablets seguem: abrem sozinhos a cifra de quem foi chamado.
- **Histórico**: cada tablet da banda guarda todo pedido em `localStorage` (`bk_hist`), não some com NOVA NOITE. Aba HISTÓRICO tem ranking por noite e backup (copiar/colar).
- **Ranking do QR**: `fonte/ranking.py` (lista da banda) + pedidos reais do histórico. O mestre publica o ranking (`k:'rank'`) ao abrir e no NOVA NOITE.
