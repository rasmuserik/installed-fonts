function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// # Get the list of installed fonts
//
// Sample usage:
//
// ```
// let { installedFonts } = require('installed-fonts');
// installFonts().then(fonts => console.log(fonts));
// ```
//
// To get the font list, it tries:
//
// - `system_profiler` on OS-X (not tested yet)
// - `fc-list` on Linux / Unix-like
// - `powershell` on windows (not tested yet)
// - Probing predefined font list with HTML5 canvas measureText.
//
// and returns the first that yields a result
//
// # Actual source code
//
exports.installedFonts = _asyncToGenerator(function* () {

  let execSync;

  // Try to get the fonts via system_profiler (may work on OS-X, not tested)

  try {
    let fontList = execSync('system_profiler SPFontsDataType ' + '| grep Family:').split('\n').replace('Family:', '').map(function (s) {
      return s.trim();
    }).filter(function (s) {
      return s.length > 0;
    });
    fontList = Array.from(new Set(fontList));

    if (fontList.length) {
      return fontList;
    }
  } catch (e) {}
  /* do nothing, fall through to next attempt */


  // Try to get the fonts via fc-list (should work on linux etc.)

  try {
    execSync = (typeof window === 'object' && window.require && window.require('child_process') || require('child_process')).execSync;
    let fontList = execSync('fc-list', { encoding: 'utf-8' }).split('\n').map(function (s) {
      return s.split(':')[1];
    }).join(',').split(',').map(function (s) {
      return s.trim();
    }).filter(function (s) {
      return s.length > 0;
    });
    fontList = Array.from(new Set(fontList));

    if (fontList.length) {
      return fontList;
    }
  } catch (e) {}
  /* do nothing, fall through to next attempt */


  // Try to get the fonts via powershell (should work on windows)

  try {
    let cmd = 'powershell -Command "' + '[void] [System.Reflection.Assembly]::' + 'LoadWithPartialName(\'System.Drawing\');' + '(New-Object System.Drawing.Text.InstalledFontCollection)' + '.Families"';
    let fontList = execSync(cmd, { encoding: 'utf-8' });
    fontList = fontList.split('\n').slice(2).map(function (s) {
      return s.trim();
    }).filter(function (s) {
      return s.length > 0;
    });

    if (fontList.length) {
      return fontList;
    }
  } catch (e) {}
  /* do nothing, fall through to next attempt */


  // Probe through predefined list on browser

  try {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let fonts = fontList();

    let result = [];
    ctx.font = `12px sans-serif`;
    let w0 = ctx.measureText('i').width;
    for (let i = 0; i < fonts.length; ++i) {
      if (i & 63 === 0) {
        yield wait();
      }
      let font = fonts[i];
      ctx.font = `12px "${font}", sans-serif`;
      let w1 = ctx.measureText('i').width;
      if (w1 === w0) {
        ctx.font = `12px "${font}", monospace`;
        let w2 = ctx.measureText('i').width;
        if (w1 !== w2) {
          continue;
        }
      }
      result.push(font);
    }
    return result;
  } catch (e) {
    /* do nothing, fall through to next attempt */
  }

  throw 'not implemented on this platform';
});

// ## Wait utility function

function wait() {
  return new Promise(resolve => setTimeout(resolve, 0));
}

// ## main/test

exports.main = _asyncToGenerator(function* () {
  window.app.innerHTML = 'Fonts found: <div style=font-size:8px>' + (yield exports.installedFonts()).join(', ') + '</div>';
});

if (typeof require === 'function' && require.main === module) {
  module.exports.installedFonts().then(o => o.map(s => console.log(s)));
}

function fontList() {
  // ##
  return `
3x3
Aakar
Abadi MT Condensed Light
ABeeZee
Abel
Abhaya Libre
Abril Fatface
Abyssinica SIL
Accanthis ADF Std
Accanthis ADF Std No2
Accanthis ADF Std No3
Aclonica
Acme
Actor
Adamina
Ad Lib
Adobe Jenson
Adobe Originals
Advent Pro
Agency FB
Agenda
Aguafina Script
Aharoni
Akronim
Akzidenz Grotesk
Aladin
Al Bayan
Albertus
Aldhabi
Aldrich
Aldus
Alef
Alegreya
Alegreya Sans
Alegreya Sans SC
Alegreya SC
Alexandria
Alex Brush
Alfa Slab One
Algerian
Alice
Alike
Alike Angular
Allan
Allegro
Allerta
Allerta Stencil
Allura
Almendra
Almendra Display
Almendra SC
Alphabetum
Amarante
Amaranth
Amatica SC
Amatic SC
American Scribe
American Typewriter
Amethysta
Amiko
Amiri
Amiri Quran
Amita
Amplitude
AMS Euler
Anaheim
Andada
Andale Mono
Andalé Mono
Andalé Sans
Andalus
Andika
Andreas
Andy
Angkor
Angsana New
AngsanaUPC
Ani
Annie Use Your Telescope
Anonymous Pro
Antic
Antic Didone
Antic Slab
Antiqua
Antique Olive
Anton
Aparajita
Aperçu
Apple Casual
Apple Chancery
Apple Garamond
Apple Gothic
Apple LiGothic
Apple LiSung
Apple Myungjo
Apple Symbols
AquaKana
Arabic Typesetting
Arapey
Arbutus
Arbutus Slab
Archer
Architects Daughter
Archivo Black
Archivo Narrow
Aref Ruqaa
Arial
Arial Black
Arial Hebrew
Arial Monospaced
Arial Nova
Arial Unicode MS
Arima Madurai
Arimo
Arizonia
Armata
Arnhem
Arno
Arnold Böcklin
Arsenal
Artifika
Arvo
Arya
Asana Math
Asana-Math
Asap
Asar
Ashley Script
Asset
Assistant
Aster
Astloch
Astur
Asul
Athens
Athiti
Atma
Atomic Age
Aubrey
Audiowide
Aurora
Autour One
Avant Garde
Avenir
Average
Average Sans
Averia Gruesa Libre
Averia Libre
Averia Sans Libre
Averia Serif Libre
Ayuthaya
Bad Script
Baghdad
Bahiana
Balloon
Baloo
Balthazar
Banco
Bangers
Bank Gothic
Barrio
Base
Basic
Baskerville
Bastard
Batang
BatangChe
Battambang
Bauhaus
Baumans
Bayon
Beijing
Belgrano
Bell
Bell Centennial
Belleza
Bell Gothic
Bello
Belwe Roman
Bembo
BenchNine
Benguiat
Benguiat Gothic
Bentham
Berkeley Old Style
Berkshire Swash
Berlin Sans
Bernhard Modern
Bevan
BiauKai
Bickham Script
Big Caslon
Bigelow Rules
Bigshot One
Bilbo
Bilbo Swash Caps
BioRhyme
BioRhyme Expanded
Biryani
Bitstream Charter
Bitstream Cyberbit
Bitstream Vera
Bitter
Blackboard bold
Black Ops One
Blur
Bodoni
Bokor
Bonbon
Boogaloo
Book Antiqua
Bookman
Bookshelf Symbol
Bowlby One
Bowlby One SC
Braggadocio
Brandon Grotesque
Brawler
Bree Serif
Breitkopf Fraktur
Broadway
Browallia New
BrowalliaUPC
Brown
Brush Script
Bubblegum Sans
Bubbler One
Buda
Buenard
Bulmer
Bungee
Butcherman
Butterfly Kids
Cabin
Cabin Condensed
Cabin Sketch
Caecilia
Caesar Dressing
Cagliostro
Cairo
Caladea
Caledonia
Calibri
Calibri Light
Californian FB
Calisto MT
Calligraffitti
Cambay
Cambo
Cambria
Cambria Math
Candal
Candara
Candida
Cantarell
Cantata One
Cantora One
Capitals
Capriola
Cardo
Carlito
Carme
Carrois Gothic
Carrois Gothic SC
Carter One
Cartier
Casey
Caslon
Caslon Antique
Catamaran
Catull
Caudex
Caveat
Caveat Brush
Cedarville Cursive
Centaur
Century Gothic
Century Old Style
Century Schoolbook
Century Schoolbook L
Ceviche One
Cézanne
Chalet
Chalkboard
Chalkduster
Chandas
Changa
Changa One
Chango
Charcoal
Charcoal CY
Charis SIL
Charter
Chathura
Chau Philomene One
Chela One
Chelsea Market
Cheltenham
Chenla
Cherry Cream Soda
Cherry Swash
Chewy
Chicago
Chicle
Chivo
Choc
Cholla Slab
Chonburi
Cinzel
Cinzel Decorative
Circular
City
Clarendon
Clearface
Clearview
Clicker Script
Cloister Black
Cochin
Coda
Coda Caption
Code2000
Code2001
Code2002
Codystar
Coiny
Colonna
Combo
Comfortaa
Comic Sans
Comic Sans MS
Coming Soon
Compacta
Compatil
Computer Modern
Concert One
Concrete Roman
Condiment
Consolas
Constantia
Content
Contrail One
Convergence
Cookie
Cooper Black
Copperplate
Copperplate Gothic
Copperplate Gothic Bold
Copperplate Gothic Light
Copse
Corbel
Corben
Cordia New
CordiaUPC
Cormorant
Cormorant Garamond
Cormorant Infant
Cormorant SC
Cormorant Unicase
Cormorant Upright
Corona
Coronet
Corpid
Corporate ASE
Corsiva Hebrew
Courgette
Courier
Courier 10 Pitch
Courier New
Cousine
Coustard
Covered By Your Grace
Crafty Girls
Creepster
Crete Round
Crimson Text
Croissant One
Crushed
Cuprum
Curlz
cursive
Cutive
Cutive Mono
C zanne
Dalliance
Damion
Dancing Script
Dangrek
DaunPenh
David
David Libre
Dawning of a New Day
Dax
Days One
DecoType Naskh
DejaVu fonts
DejaVu Sans
DejaVu Sans Condensed
DejaVu Sans Light
DejaVu Sans Mono
DejaVu Serif
DejaVu Serif Condensed
Dekko
Delius
Delius Swash Caps
Delius Unicase
Della Respira
Dengxian
Denk One
Devanagari
Devonshire
DFKai-SB
Dhurjati
Didact Gothic
Didone
Didot
DilleniaUPC
Din
DIN 1451
Dingbats
Diplomata
Diplomata SC
DokChampa
Dom Casual
Domine
Donegal One
Doppio One
Dorsa
Dosis
Dotum
DotumChe
Doulos SIL
Droid Arabic Kufi
Droid Arabic Naskh
Droid fonts
Droid Naskh Shift Alt
Droid Sans
Droid Sans Arabic
Droid Sans Armenian
Droid Sans Ethiopic
Droid Sans Fallback
Droid Sans Georgian
Droid Sans Hebrew
Droid Sans Japanese
Droid Sans Mono
Droid serif
Droid Serif
Dr Sugiyama
Duru Sans
Dynalight
Dyslexie
Eagle Lake
Easyreading
Eater
EB Garamond
EB Garamond 08
EB Garamond 08 SC
EB Garamond 12
EB Garamond Initials
EB Garamond Initials Fill1
EB Garamond Initials Fill2
Ebrima
Ecofont
Economica
Eczar
Egyptienne
Ek Mukta
Electrolize
Elephant
Ellington
El Messiri
Elsie
Elsie Swash Caps
Emblema One
Emerson
Emilys Candy
Engagement
Englebert
Enriqueta
Eras
Erica One
Espy Sans
Esseltub
Esteban
Estrangelo Edessa
EucrosiaUPC
Euphemia
Euphoria Script
Eurocrat
Eurostile
Everson Mono
Ewert
Excelsior
Exo
Exo 2
Exocet
Expletus Sans
Fago
Fairfield
Fallback font
Fang Song
FangSong
Fanwood Text
Farsan
Fascinate
Fascinate Inline
Faster One
Fasthand
Fauna One
Federant
Federo
Fedra
Felipa
Fenix
Fette Fraktur
FF Dax
FF Meta
FF Scala
FF Scala Sans
FIG Script
Filosofia
Finger Paint
Fira Mono
Fira Sans
Fira Sans Condensed
Fira Sans Extra Condensed
Fixed
Fixedsys
Fixedsys Excelsior
Fjalla One
Fjord One
Flamenco
Flavors
Fleishmann
Fletcher
Folio
Fondamento
FontAwesome
Fontdiner Swanky
Footlight
Formata
Forte
Forum
Fraktur
Francois One
Franklin Gothic
Franklin Gothic Medium
FrankRuehl
Frank Ruhl Libre
Freckle Face
Fredericka the Great
Fredoka One
Freehand
FreeMono
FreeSans
FreeSerif
FreesiaUPC
Free UCS Outline
French Script
Fresca
Frijole
Friz Quadrata
Fruktur
Frutiger
Fugaz One
Futura
Gabriela
Gabriola
Gadget
Gadugi
Gaelic type
Gafata
Galada
Galdeano
Galindo
Garamond
gargi
Gargi
Garuda
Gautami
Geezah
Geeza Pro
Generis
Geneva
Geneva CY
Gentium
GentiumAlt
Gentium Basic
Gentium Book Basic
Gentium Plus
Geo
Georgia
Georgia Pro
Geostar
Geostar Fill
Germania One
GFS Artemisia
GFS Baskerville
GFS BodoniClassic
GFS Complutum
GFS Didot
GFS Didot Classic
GFS Didot Rg
GFS Gazis
GFS Neohellenic
GFS Neohellenic Rg
GFS Olga
GFS Porson
GFS Solomos
GFS Theokritos
Gidugu
Gilda Display
Gillius ADF
Gillius ADF Cd
Gillius ADF No2
Gillius ADF No2 Cd
Gill Sans
Gill Sans Nova
Gill Sans Schoolbook
Gisha
Give You Glory
Glass Antiqua
Glegoo
Gloria Hallelujah
Gloucester
GNU Unifont
Goblin One
Gochi Hand
Gorditas
Gotham
Goudy Bookletter 1911
Goudy Old Style
Graduate
Grand Hotel
Granjon
Grasset
Gravitas One
Gravura
Great Vibes
Grecs du roi
Griffy
Gruppo
GT Walsheim
Guardian Egyptian
Gubbi
Gudea
Gujarati
Gulim
GulimChe
Gung Seoche
Gungsuh
GungsuhChe
Gurajada
Gurmukhi
Habibi
Haettenschweiler
Halant
Hammersmith One
Hanacaraka
Hanalei
Hanalei Fill
Handel Gothic
Handlee
Hands
Hangangche
Hanuman
Happy Monkey
Harmattan
Headland One
HeadlineA
Heebo
Hei
Helvetica
Helvetica CY
Helvetica Neue
Henny Penny
Herculanum
Herr Von Muellerhoff
High Tower Text
Highway Gothic
Hind
Hind Guntur
Hind Madurai
Hind Siliguri
Hind Vadodara
Hiragino Kaku Gothic Pro
Hiragino Kaku Gothic ProN
Hiragino Kaku Gothic Std
Hiragino Kaku Gothic StdN
Hiragino Maru Gothic Pro
Hiragino Maru Gothic ProN
Hiragino Mincho Pro
Hiragino Mincho ProN
Hobo
Hoefler Text
Holtwood One SC
Homemade Apple
Homenaje
Horizon
House Gothic 23
HyperFont
Iceberg
Iceland
IM Fell Double Pica
IM Fell Double Pica SC
IM Fell DW Pica
IM Fell DW Pica SC
IM Fell English
IM Fell English SC
IM Fell French Canon
IM Fell French Canon SC
IM Fell Great Primer
IM Fell Great Primer SC
Impact
Imprima
Imprint
Inai Mathi
Inconsolata
Inder
Indie Flower
Industria
Info
Inika
Inknut Antiqua
Instant Types
Interstate
Ionic No. 5
IPAゴシック
IPAexゴシック
IPAexGothic
IPAexMincho
IPAex明朝
IPAGothic
IPAMincho
IPA Pゴシック
IPAPGothic
IPAPMincho
IPA P明朝
IPA明朝
Irish Grover
IrisUPC
Iskoola Pota
Istok Web
Italiana
Italianno
ITC Avant Garde
ITC Benguiat
ITC Zapf Chancery
Itim
Jacques Francois
Jacques Francois Shadow
Jaldi
Jamrul
Janson
Japanese
Japanese Gothic typeface
JasmineUPC
Javanese Text
Jim Crow
Jim Nightshade
Joanna
Jockey One
Johnston
Jokerman
Jolly Lodger
Jomhuria
Jomolhari
Josefin Sans
Josefin Slab
Joti One
Judson
Julee
Julius Sans One
Junge
Jung Gothic
Junicode
Jura
Just Another Hand
Just Me Again Down Here
Kabel
KacstArt
KacstBook
KacstDecorative
KacstDigital
KacstFarsi
KacstLetter
KacstNaskh
KacstOffice
KacstOne
KacstPen
KacstPoster
KacstQurn
KacstScreen
KacstTitle
KacstTitleL
Kadwa
Kai
KaiTi
Kalam
Kalapi
Kalimati
Kalinga
Kameron
Kanit
Kantumruy
Karla
Karma
Kartika
Katibeh
Kaushan Script
Kavivanar
Kavoon
Kdam Thmor
Keania One
Kedage
Kelly Slab
Kenia
Keyboard
Khand
Khmer
Khmer OS
Khmer OS System
Khmer UI
Khula
Kinnari
Kiran fonts
Kite One
Klavika
Knewave
Kochi font
KodchiangUPC
Kokila
Koren Type
Korinna
Kosmik
Kotta One
Koulen
Kranky
Kreon
Kristen
Kristi
Krona One
Krungthep
Kruti Dev
Kuenstler Script
KufiStandard GK
Kumar One
Kumar One Outline
Kurale
La Belle Aurore
Laila
Lakki Reddy
Laksaman
Lalezar
Lancelot
Lao UI
LastResort
Lateef
Latha
Latin Modern Math
Latin Modern Mono
Latin Modern Mono Caps
Latin Modern Mono Light
Latin Modern Mono Light Cond
Latin Modern Mono Prop
Latin Modern Mono Prop Light
Latin Modern Mono Slanted
Latin Modern Roman
Latin Modern Roman Caps
Latin Modern Roman Demi
Latin Modern Roman Dunhill
Latin Modern Roman Slanted
Latin Modern Roman Unslanted
Latin Modern Sans
Latin Modern Sans Demi Cond
Latin Modern Sans Quotation
Lato
Lato Black
Lato Hairline
Lato Heavy
Lato Light
Lato Medium
Lato Semibold
Lato Thin
League Script
Leckerli One
Ledger
Leelawadee
Leelawadee UI
Legacy
Lekton
Lemon
Lemonada
Letter Gothic
Lexia
Lexia Readable
Lexicon
Liberation fonts
Liberation Mono
Liberation Sans
Liberation Sans Narrow
Liberation Serif
Libre Baskerville
Libre Franklin
Life Savers
LiHei Pro
Likhan
Lilita One
Lily Script One
LilyUPC
Limelight
Linden Hill
Linux Biolinum
Linux Biolinum Keyboard O
Linux Biolinum O
Linux Libertine
Linux Libertine Display O
Linux Libertine Initials O
Linux Libertine Mono O
Linux Libertine O
LiSong Pro
Literaturnaya
Lithos
LKLUG
LM Mono
LM Roman
LM Sans
Lobster
Lobster Two
Lohit
Loma
Londrina Outline
Londrina Shadow
Londrina Sketch
Londrina Solid
Lora
Lo-Type
Loved by the King
Lovers Quarrel
Love Ya Like A Sister
Lucida
Lucida Blackletter
Lucida Console
Lucida Grande
Lucida Handwriting
Lucida Sans Unicode
Luckiest Guy
Lusitana
Lustria
Luxi
Lydian
Macondo
Macondo Swash Caps
Mada
Magra
Maiden Orange
Maitree
Mako
Malgun Gothic
Mallanna
Mallige
Mandali
Mangal
Manny ITC
Marcellus
Marcellus SC
Marck Script
Margarine
Marker Felt
Marko One
Marlett
Marmelad
Martel
Martel Sans
Marvel
Mate
Mate SC
Matrix
Maven Pro
McLaren
Meddon
MedievalSharp
Medula One
Meera
Meera Inimai
Megrim
Meie Script
Meiryo
Meiryo UI
Melior
Memphis
Menlo
Merienda
Merienda One
Merriweather
Merriweather Sans
Meta
Metal
Metal Mania
Metamorphous
Metro
Metrophobic
Michroma
Microgramma
Microsoft Himalaya
Microsoft JhengHei
Microsoft JhengHei UI
Microsoft New Tai Lue
Microsoft PhagsPa
Microsoft Sans Serif
Microsoft Tai Le
Microsoft Uighur
Microsoft YaHei
Microsoft YaHei UI
Microsoft Yi Baiti
Miller
Milonga
Miltonian
Miltonian Tattoo
Minchō
Ming
MingLiU-ExtB, PMingLiU-ExtB
MingLiU_HKSCS
MingLiU_HKSCS-ExtB
MingLiU, PMingLiU
Minion
Miniver
Miriam Libre
Miriam, Miriam Fixed
Mirza
Miss Fajardose
Mistral
Mitr
Mitra Mono
Modak
Modern Antiqua
Mogra
Molengo
Molle
Monaco
Monaco CY
Mona Font
Mona Lisa
Monda
Mongolian Baiti
Monofett
monospace
Monospace
Monoton
Monotype Corsiva
Monsieur La Doulaise
Montaga
Montez
Montserrat
Montserrat Alternates
Montserrat Subrayada
MoolBoran
Motorway
Moul
Moulpali
Mountains of Christmas
Mouse Memoirs
Mr Bedfort
Mr Dafoe
Mr De Haviland
Mrs Eaves
Mrs Saint Delafield
Mrs Sheppards
mry_KacstQurn
MS Gothic
MS Gothic, MS PGothic
Mshtakan
MS Mincho
MS Mincho, MS PMincho
MS Sans Serif
MS Serif
MS UI Gothic
Mukta Vaani
Mukti Narrow
Muli
MV Boli
Myanmar Text
Myriad
Mystery Quest
Nadeem
Nakula
NanumBarunGothic
NanumGothic
NanumMyeongjo
Narkisim
Nastaliq Navees
Navilu
Neucha
Neue Haas Grotesk Text Pro
Neuland
Neuton
Neutraface
Neuzeit S
New Century Schoolbook
New Gulim
New Peninim
New Rocker
News Cycle
News Gothic
New York
Niconne
Nilland
Nimbus Mono L
Nimbus Roman
Nimbus Roman No9 L
Nimbus Sans
Nimbus Sans L
Nirmala UI
NISC GB18030
Nixie One
Nobel
Nobile
Nokora
Norasi
Norican
Nosifer
Nothing You Could Do
Noticia Text
Noto
Noto Sans
Noto Serif
Nova Cut
Nova Flat
Nova Mono
Nova Oval
Nova Round
Nova Script
Nova Slim
Nova Square
NPS Rawlinson Roadway
NSimSun
NTR
Numans
Nunito
Nunito Sans
Nyala
OCR
OCR A Extended
OCR-A font
OCR-B
Odor Mean Chey
Officina
Offside
Oldenburg
Old English Text
Old English Text MT
Old Standard TT
Oleo Script
Oleo Script Swash Caps
Open Sans
Open Sans Condensed
OpenSymbol
Optima
Oranienbaum
Orbitron
Oregano
ori1Uni
Orienta
Original Surfer
Osaka
Oswald
Overlock
Overlock SC
Overpass
Overpass Mono
Over the Rainbow
Ovo
Oxygen
Oxygen Mono
Pacifico
Padauk
Padauk Book
padmaa
padmmaa
Palanquin
Palanquin Dark
Palatino
Palatino Linotype
Pangolin
Paprika
Papyrus
Parisienne
Parisine
Passero One
Passion One
Pathway Gothic One
Patrick Hand
Patrick Hand SC
Pattaya
Patua One
Pavanam
Paytone One
PC Myungjo
Peddana
Peignot
Peralta
Permanent Marker
Perpetua
Perpetua Greek
Petit Formal Script
Petrona
Phetsarath OT
Philosopher
Piedra
Pilgiche
Pinyon Script
Pirata One
Plantagenet Cherokee
Plantin
Plaster
Play
Playball
Playbill
Playfair Display
Playfair Display SC
Podkova
Poiret One
Poller One
Poly
Pompiere
Pontano Sans
Poppins
Porson
Port Lligat Sans
Port Lligat Slab
Pothana2000
Pragati Narrow
PragmataPro
Prata
Preahvihear
Press Start 2P
Prestige Elite
Pridi
Primer
Princess Sofia
Prociono
Product Sans
ProFont
Proforma
Proggy programming fonts
Prokyon
Prompt
Prosto One
Proxima Nova
Proza Libre
PT Mono
PT Sans
PT Sans Caption
PT Sans Narrow
PT Serif
PT Serif Caption
Purisa
Puritan
Purple Purse
Quadraat
Quando
Quantico
Quattrocento
Quattrocento Sans
Quay Sans
Questrial
Quicksand
Quintessential
Qwigley
Raanana
Raavi
Rachana
Racing Sans One
Radley
Rail Alphabet
Rajdhani
Rakkas
Raleway
Raleway Dots
Ramabhadra
Ramaraja
Rambla
Rammetto One
Ranchers
Rancho
Ranga
Rasa
Rationale
Ravi Prakash
Redressed
Reem Kufi
Reenie Beanie
Rekha
Renault#Typeface
Reporter
Requiem
Revalia
Rhodium Libre
Ribeye
Ribeye Marrow
Righteous
Risque
Roboto
Roboto Condensed
Roboto Mono
Roboto Slab
Rochester
Rock Salt
Rockwell
Rockwell Nova
Rod
Rokkitt
Romanesco
Ropa Sans
Rosario
Rosarivo
Rotis
Rotis#Rotis II Sans
Rotis Serif
Rouge Script
Rozha One
Rubik
Rubik Mono One
Ruda
Rufina
Ruge Boogie
Ruluko
Rum Raisin
Ruslan Display
Russo One
Ruthie
Rye
Saab
Sabon
Sacramento
Sahadeva
Sahitya
Sail
Sakkal Majalla
Salsa
Samanata
Samyak Devanagari
Samyak Gujarati
Samyak Tamil
Sanchez
Sancreek
Sand
San Francisco
Sansita
Sanskrit Text
sans-serif
Sarai
Sarala
Sarina
Sarpanch
Sathu
Satisfy
Sawasdee
Scada
Scala
Schadow
Scheherazade
Schoolbell
Schwabacher
Scope One
Script typeface
Seaweed Script
Secular One
Segoe
Segoe MDL2 Assets
Segoe Print
Segoe Script
Segoe UI
Segoe UI Emoji
Segoe UI Historic
Segoe UI Symbol
Seoul
serif
Serifa
Sevillana
Seymour One
Shadows Into Light
Shadows Into Light Two
Shanti
Share
Share Tech
Share Tech Mono
Shin Myungjo Neue
Shojumaru
Shonar Bangla
Short Stack
Shrikhand
Shruti
Siemreap
Sigmar One
Signika
Signika Negative
Silom
SimHei
SimKai
Simonetta
Simplified Arabic
SimSun
SimSun-ExtB
Sintony
Sirin Stencil
Sistina
Sitka Banner
Sitka Display
Sitka Heading
Sitka Small
Sitka Subheading
Sitka Text
Six Caps
Skeleton Antique
Skia
Skranji
Slabo 13px
Slabo 27px
Slackey
Smokum
Smythe
Sniglet
Snippet
Snowburst One
Sofadi One
Sofia
Song
Sonsie One
Sorts Mill Goudy
Source Code Pro
Source Sans Pro
Source Serif Pro
Souvenir
Space Mono
Special Elite
Spicy Rice
Spinnaker
Spirax
Squada One
Squarish Sans CT
Sreda
Sree Krushnadevaraya
Sriracha
Stalemate
Stalinist One
Standard Symbols L
Stardos Stencil
Stencil
ST FangSong
ST Heiti
Stint Ultra Condensed
Stint Ultra Expanded
STIX
STIXGeneral
STIXIntegralsD
STIXIntegralsSm
STIXIntegralsUp
STIXIntegralsUpD
STIXIntegralsUpSm
STIX Math
STIXNonUnicode
STIXSizeFiveSym
STIXSizeFourSym
STIXSizeOneSym
STIXSizeThreeSym
STIXSizeTwoSym
STIXVariants
ST Kaiti
Stoke
Stone
Strait
ST Song
Sue Ellen Francisco
Suez One
Sumana
Sunshiney
Supermercado One
Sura
Suranna
Suravaram
Suwannaphum
Swanky and Moo Moo
Sweden Sans
Swift
Swiss 721
Sylfaen
Symbol
Symbola
Syncopate
Syntax
System
Tae Graphic
Tahoma
Taipei
Takao Pゴシック
TakaoPGothic
Tangerine
Taprom
Tauri
Taviraj
Techno
Teko
Telex
Template Gothic
Tenali Ramakrishna
Tengwar
Tenor Sans
Terminal
TeX Gyre Adventor
TeX Gyre Bonum
TeX Gyre Bonum Math
TeX Gyre Chorus
TeX Gyre Cursor
TeX Gyre Heros
TeX Gyre Heros Cn
TeX Gyre Pagella
TeX Gyre Pagella Math
TeX Gyre Schola
TeX Gyre Schola Math
TeX Gyre Termes
TeX Gyre Termes Math
Textile
Text Me One
The Girl Next Door
Thesis
Thesis Sans
Thonburi
Tibetan Machine Uni
Tienne
Tillana
Times
Times CY
Times New Roman
Timmana
Tinos
Tiresias
Titan One
Titillium Web
Titus Cyberbit Basic
TlwgMono
TlwgTypewriter
Tlwg Typist
Tlwg Typo
Today Sans
Torino
Tower
Trade Gothic
Trade Winds
Traditional Arabic
Trajan
Transport
Trebuchet MS
Trinit
Trinité
Triplex
Trirong
Trixie
Trocchi
Trochut
Trump Mediaeval
Trykker
Tulpen One
Tunga
Twentieth Century
Ubuntu
Ubuntu Condensed
Ubuntu Light
Ubuntu Mono
Ultra
Umbra
Umpush
Uncial Antiqua
Underdog
Unica One
UnifrakturCook
UnifrakturMaguntia
Univers
Universalis ADF Cd Std
Universalis ADF Std
Unkempt
Unlock
Unna
Urdu Typesetting
URW Bookman L
URW Chancery L
URW Gothic L
URW Palladio L
utkal
Utopia
Utsaah
Vampiro One
Vani
Varela
Varela Round
Vast Shadow
Vemana2000
Verdana
Verdana Pro
Vesper Libre
Vibur
Vidaloka
Viga
Vijaya
Vista
Voces
Volkhov
Vollkorn
Voltaire
Vrinda
VT323
Waiting for the Sunrise
Walbaum
Wallpoet
Walter Turncoat
Waree
Warnes
Webdings
Wellfleet
Wendy One
Westminster
Wide Latin
Wiesbaden Swing
Wilhelm Klngspor Gotisch
Willow
Wilson Greek
Windsor
Wingdings
Wingdings 2
Wingdings 3
Wire One
Work Sans
XITS
XP
Yanone Kaffeesatz
Yantramanav
Yatra One
Yellowtail
Yeseva One
Yesteryear
Yrsa
Yu Gothic
Yu Gothic UI
Yu Mincho
Zapf Chancery
Zapf Dingbats
Zapfino
Zapf Renaissance
Zeyada
Zurich
`.split('\n').filter(o => o);
}
