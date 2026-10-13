# Ajouter un conseil ou un guide à Term Dates Finder

Notice pour l'agent qui prolonge le site. À lire avec `~/Documents/GitHub/RECETTE-SITE.md` (§6, §7, §9.3, §11, §21, §26).

## Principe : une page = un fichier de données

- **Un conseil** = `src/data/councils/<slug>.json`. Ce fichier seul produit la page `/en/<slug>-term-dates/`,
  l'entrée de la liste `/en/councils/`, le menu des outils (sélecteur), les tableaux des guides
  (`h.breakTable`, `h.groups`), les comparaisons et le fichier `/data/councils/<slug>.json` que les outils
  chargent dans le navigateur quand le visiteur choisit ce conseil.
- **Un guide** = `src/content/pages/<id>.ts` (`definePage`, types dans `src/lib/guide-types.ts`) : URL, titre,
  description, H1, chapeau, bloc citable `resume(h)`, FAQ `faqs(h)`, corps `body(h)`, outil (`tool` en premier
  écran, ou `mini` après le bloc citable), sources (clés de `src/data/params-2026.json`). Un outil secondaire
  s'insère dans le corps par `<!--tool:<kind>|<slug-du-conseil>-->` (kinds : `checker`, `compare`, `countdown`,
  `countdown-summer`, `year`, `inset`, `bank`, `penalty`, `break:<october|christmas|february|easter|may|summer>`).

## Ajouter un conseil

1. **Lire la source officielle**, et seulement elle : la page « term dates » du conseil, ou son PDF / .doc.
   Jamais savemyexams, cognito, wego, un site d'école ou un article. Agent navigateur obligatoire :
   `curl -sL --compressed -A 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36' URL`.
   PDF : `pypdf` ; .doc/.docx : `textutil -convert txt -stdout`.
2. **Page bloquée** (Cloudflare, 403) : on ne contourne pas. Voies ouvertes : copie Wayback de l'URL officielle
   (`https://web.archive.org/web/2026id_/<URL>`, `--compressed`), index CDX
   (`https://web.archive.org/cdx/search/cdx?url=<domaine>/*term*&output=json`), ou WebFetch. Le JSON le dit
   (`via: "wayback"` / `"webfetch"`) et la page l'affiche à côté de la source.
3. **Garder le texte lu** dans `data-raw/<slug>-<année>.txt` (pièce d'audit).
4. **Écrire le JSON** en copiant la structure de `kent.json` (jamais ses phrases) :
   - `sessions` : périodes continues de trimestre (lundi–vendredi), dans l'ordre ; **chaque vacance coupe une
     session**, même d'un jour ; un jour férié anglais/gallois dans un trimestre ne coupe pas (le moteur ferme
     l'école ce jour-là d'après `bank-holidays.json`), on peut le mettre dans `closures`.
   - En Écosse, les jours fériés ne ferment pas l'école d'eux-mêmes : seuls comptent les `holidays`,
     `closures` et `inset` du conseil.
   - `inset` : jours pédagogiques fixés par le conseil, **à l'intérieur** d'une session (session étendue).
     `insetMode` : `fixed`, `school-chooses`, `partly-fixed`, `not-stated`.
   - `holidays` : noms usuels (`October half term`, `Christmas holidays`, `February half term`,
     `Easter holidays`, `May half term`, `Summer holidays`, ou le nom du conseil). Les `Summer holidays` de fin
     d'année ne vont jusqu'à la rentrée suivante que si elle est publiée.
   - `status` : `published`, `provisional` (projet, « proposed », consultation) ou `not-published`.
   - `localFacts` : 3 à 8 faits propres au conseil, lus sur ses pages, chacun avec son URL. **C'est la seule
     partie non générée de la page** : c'est elle qui la rend unique (§6). Pas de tournure reprise d'un autre
     conseil : deux boroughs de Londres partagent souvent le même document, réécrire (cas Lewisham/Southwark).
   - Un conseil dont 2026-27 est illisible **n'a pas de fichier** (Tameside, Hampshire au 2026-10-13).
5. **Valider** : `npx vitest run tests/data.test.ts` (sessions, trous couverts, snippets 50-60 / 150-160,
   FAQ de 40 à 90 mots). Le validateur de collecte vit hors du dépôt ; les mêmes règles sont dans le test.
6. Tous les contrôles (ci-dessous), puis commit local en français, dernière ligne `Co-Authored-By: …`.

## Ce qui est généré, ce qui est écrit

- `src/lib/council-text.ts` : chapeau, bloc citable, comparaison et FAQ des pages conseils, **choisis par la
  donnée** (deux semaines en octobre ou non, Pâques dans la pause ou non, règle INSET, 2027-28 publié ou non).
  Ces blocs sont marqués `data-chrome` : ils ne comptent pas dans `check-unique`, les `localFacts` si.
- `src/data/council-snippets.ts` : titre et description des pages conseils, premier candidat de bonne longueur.
- Aucun chiffre réglementaire en dur dans une page : amendes, seuils et jours viennent de `params-2026.json`,
  les dates des fichiers conseils, les jours fériés de `bank-holidays.json` (flux GOV.UK, OGL, relevé le
  2026-10-12 : `curl -s https://www.gov.uk/bank-holidays.json`).

## Droits de réutilisation

Dates des conseils, jours fériés GOV.UK, législation : informations du secteur public sous Open Government
Licence v3.0, reprises comme faits (une date, un seuil) avec la source et la date de relevé, jamais la mise en
page d'un document. Pas de donnée en direct : le site est statique, les outils tournent dans le navigateur et
ne chargent que les fichiers JSON du site lui-même.

## Contrôles (tous à 0)

```bash
cd ~/Documents/GitHub/a-publier/Mottalib-10M/uk-term-dates
export NODE_PATH=$(npm root -g):$PWD/node_modules
npm run build          # inclut typo-nbsp et check-snippets (bloquant)
npx vitest run
python3 scripts/check-seo.py . ; python3 scripts/check-trame.py . ; python3 scripts/check-unique.py .
python3 scripts/check-simulateurs.py . ; python3 scripts/check-regles.py . ; python3 scripts/check-portefeuille.py .
python3 scripts/check-cookies.py . ; python3 scripts/check-liens.py .
node scripts/check-legal.mjs ; node scripts/check-sources.mjs . ; node scripts/typo-nbsp.mjs dist --check
npx astro preview --port 4445 &   # port propre au site
node scripts/check-contraste.mjs dist ; node scripts/check-nombres.mjs dist ; node scripts/check-saisie.mjs dist --max=60
node scripts/check-url-propre.mjs . ; node scripts/check-premier-ecran.mjs . ; node scripts/check-layout.mjs .
```

Arrêter le serveur par son port : `lsof -ti tcp:4445 | xargs kill` (jamais `pkill -f`).

## À refaire chaque trimestre

Relire les pages des conseils (`retrieved` à jour), passer en `published` les années `provisional`, ajouter
2027-28 là où il manque (Barnet, Wandsworth, Essex, île de Wight, Leicestershire, Irlande du Nord au
2026-10-13), et l'année 2028-29 dès que les conseils la publient (ajouter la clé dans `YEARS` du moteur).
