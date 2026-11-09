ORDEM=['ROCK NACIONAL','POP ROCK INTERNACIONAL','POP & DIVAS','BRASILIDADES, AXÉ & MPB','REGGAE & GOOD VIBES','SERTANEJO & ROMÂNTICAS','FESTA & ZOEIRA']
A={
'POP ROCK INTERNACIONAL':'The Beatles;The Rolling Stones;Red Hot Chili Peppers;Oasis;Green Day;Foo Fighters;Roy Orbison;Bon Jovi;Queen;KISS;Men At Work;Fleetwood Mac;4 Non Blondes;Iggy Pop;Keane',
'POP & DIVAS':'The Cranberries;Sheryl Crow;Harry Styles;Dua Lipa;Amy Winehouse;Britney Spears;Spice Girls;Shania Twain;Roxette;Madonna;Natalie Imbruglia;Cyndi Lauper;Ace Of Base;Avril Lavigne',
'ROCK NACIONAL':'Papas da Língua;TNT;Os Paralamas do Sucesso;Titãs;Skank;Legião Urbana;Rita Lee;Cazuza;Barão Vermelho;Raul Seixas;Raimundos;Pitty;Capital Inicial;Nenhum de Nós;Kid Abelha;Jota Quest;Detonautas;Charlie Brown Jr.;Cachorro Grande;RPM;Secos & Molhados;Los Hermanos;LS Jack;Graforréia Xilarmônica;Frejat;Lulu Santos;Bidê ou Balde;Cogumelo Plutão;Ultramen;Ritchie;Cássia Eller;Alemão Ronaldo',
'REGGAE & GOOD VIBES':'Natiruts;Cidade Negra;O Rappa;Armandinho;Vitor Kley;Maskavo;Donavon Frankenreiter',
'BRASILIDADES, AXÉ & MPB':'Jorge Ben Jor;Tim Maia;Gilberto Gil;Banda Eva;Ivete Sangalo;Djavan;Marisa Monte;Netinho;Gilsons;Caetano Veloso;Ed Motta;Sandra de Sá;Lenine;Os Garotin;Marina Lima;Raça Negra',
'SERTANEJO & ROMÂNTICAS':'Roupa Nova;Bruno & Marrone;Marília Mendonça;Chitãozinho & Xororó;Wando;Fábio Jr.;Vera Loca',
'FESTA & ZOEIRA':'Anitta;LUDMILLA;Perlla;Molejo;Mamonas Assassinas;Claudinho e Buchecha;Sidney Magal',
}
MAP={a:k for k,v in A.items() for a in v.split(';')}
def estilo(a):return MAP.get(a,'ROCK NACIONAL')
