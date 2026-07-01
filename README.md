# City Reality Liberec

Nový web připravený pro nasazení na běžný hosting. Většina webu je statická, kontaktní formulář má navíc PHP endpoint pro přímé odeslání e-mailu.

## Lokální náhled

Spusťte ve složce projektu jednoduchý lokální server, například:

```sh
python3 -m http.server 4173
```

Web pak otevřete na `http://localhost:4173`.

## Automatické články

Články se načítají ze souboru `content/articles.json`. Automatizace nebo budoucí CMS stačí nastavit tak, aby tento soubor pravidelně aktualizovaly při zachování stejné datové struktury. Pokud zdroj není dostupný, web použije bezpečnou vestavěnou kopii tří článků.

## Kontaktní formulář

Formulář se nejprve pokusí odeslat poptávku přes serverový endpoint `api/contact.php`, který používá PHP funkci `mail()` a posílá zprávy na `info@cityrealityliberec.cz`. Pokud endpoint při lokálním náhledu nebo na statickém hostingu není dostupný, JavaScript připraví záložní e-mail s vyplněnou poptávkou.

Po nasazení je potřeba udělat ostrý test z produkční domény. Některé hostingy mají PHP `mail()` omezené; pokud by e-maily nechodily, je vhodné napojit stejný formulář na SMTP nebo formulářovou službu.

## Právní dokumenty a cookies

Web obsahuje stránky `pravni-informace.html`, `ochrana-osobnich-udaju.html` a `cookies.html`. Cookie lišta je řešená v `script.js`; aktuálně nejsou zapojené žádné analytické ani marketingové nástroje třetích stran. Pokud se později doplní analytika, reklamní pixely nebo externí formulářová služba, je potřeba před spuštěním aktualizovat texty a spouštět tyto nástroje až po odpovídajícím souhlasu.
