export class News {
    newsDate: Date
    title: string
    news: NewsLines[]
    imagePath: string
}

export class NewsLines {
    newsLine: string
}

export const NEWS: News[] = [
    {
        newsDate: new Date('2018-07-14'),
        title: 'Der HV TDP ist Meister 2017/2018 im Südweststeirercup!',
        news: [
            {
                newsLine: 'Unsere Meisterfeier gestern hat eine perfekte Saison abgeschlossen!'
            },
            {
               newsLine: 'Danke an alle Spieler, Fans, Sponsoren und Helfer für die Unterstützung und perfekte Saison! :)', 
            }
        ],
        imagePath: '../../assets/images/news/news1.jpg'
    },
    {
        newsDate: new Date('2018-07-25'),
        title: 'HV TDP, offizieller Trainingsauftakt!',
        news: [
            {
                newsLine: 'Gelungener Trainingsauftakt vom HV TDP zum Start in die neue Saison im Grenzlandcup!'
            }
        ],
        imagePath: '../../assets/images/news/news3.jpg'
    },
    {
        newsDate: new Date('2018-07-30'),
        title: 'Fit Lounge Stainz - Outdoor Training',
        news: [
            {
                newsLine: 'Kraft und Ausdauer für die neue Saison? Kein Problem mit dem Training der Fit Lounge Stainz :)'
            }
        ],
        imagePath: '../../assets/images/news/news4.jpg'
    },
    {
        newsDate: new Date('2018-08-08'),
        title: 'Testspiel HV TDP Stainz - HFC StudioA Köflach',
        news: [
            {
                newsLine: 'Nach einem schnellen Rückstand konnten wir die Partie in Halbzeit eins noch zu einer Führung drehen. Vorallem der Treffer von Michael Primus nach Doppelpass mit Nöstel zum 1:1 war herausragend herausgespielt. Erik Hilberger nach Flanke von Nöstel und Daniel Fabian per direkten Eckball sorgten für die weiteren Treffer auf unserer Seite. Nach der Halbzeit konnten wir sogar auf 4:2 erhöhen. Torschütze war der an diesem Tag in der Offensive sehr gut aufgelegte Rene Nöstel mit einem Schuss aus 20m. Halbzeit zwei nutzten wir mit viel Probieren und Testen von Spielern auf ungewohnten Positionen und auch wegen der Hitze ging uns gegen Ende hin etwas die Luft aus und so mussten wir noch drei Gegentreffer hinnehmen. Alles in Allem trotzdem ein sehr guter Test für uns, bei dem man vorallem auf Halbzeit eins voll aufbauen kann und dort anschließen muss. Erfreulich auch die Tatsache, dass wir mit 16 Leuten einen starken Kader stellen konnten. Danke an unsere Gäste aus Köflach für das faire Spiel und wir freuen uns auf ein eventuelles Rückspiel in der nächsten Vorbereitungszeit. #hvtdpstainz'
            }
        ],
        imagePath: '../../assets/images/news/news5.jpg'
    },
    {
        newsDate: new Date('2018-08-20'),
        title: '1. Runde: FC Schatz Pistorf - HV TDP Stainz 5:2 (2:1)',
        news: [
            {
                newsLine: 'Torschützen: Michael Primus, Herbi Kohlberger'
            },
            {
               newsLine: 'Kein guter Auftakt für unser Team im Spiel Meister Grenzlandcup gegen Meister Süd-Weststeirer Cup! Wir taten uns von Anfang an sehr schwer auf dem sehr kleinen Platz und konnten unsere spielerische Überlegenheit nicht so auf den Platz bringen wie gewünscht. Wir kämpften uns zwar zweimal zurück und konnten den Rückstand aufholen, aber 10 Minuten in Halbzeit 2 entschieden die Partie. Dort kassierten wir 3 Tore und somit war die Niederlage besiegelt. Trotzdem kopf hoch, wir haben gegen den amtierenden Meister verloren, bei dem sich sicher mehrere Teams noch schwer tun werden.', 
            },
            {
                newsLine: 'Jubiläum: Michael Primus (50. Spiel)'
            },
            {
                newsLine: 'Nächste Woche treffen wir im ersten Heimspiel der Saison auf den SV Fresing-Kitzeck. Schaut vorbei und unterstützt unser Team! 💪💪💪'
            },
            {
                newsLine: 'https://www.facebook.com/events/328191404421314/'
            }
        ],
        imagePath: '../../assets/images/news/news1.jpg'
    },
    {
        newsDate: new Date('2018-09-08'),
        title: '4. Runde GLC: HV TDP Stainz – HC Kaindorf/Oberhaag 6:0 (5:0)',
        news: [
            {
                newsLine: 'Torschützen: Fabian (4), Nöstel, Puchleitner'
            },
            {
               newsLine: 'Nach dem schlechten Saisonstart mit zwei Niederlagen, vorallem am vergangenen Donnerstag musste man bei der Heimpremiere eine heftige 2:8 Niederlage gegen SV Fresing-Kitzeck einstecken und so wollte der HV TDP Stainz ﻿umso mehr am vergangenen Samstag mit allen Mitteln erstmals anzuschreiben. Ein Kader von 16 Leuten komplettierte einen tollen Mannschaftszusammenhalt.', 
            },
            {
                newsLine: 'Eine Gelb-Rote Karte für das Auswärtsteam erleichterte dem HV TDP das Spiel in Halbzeit zwei. Die zweite Halbzeit verflachte von Minute zu Minute. Die vielen Wechsel der Stainzer merkte man und somit kam es nur mehr zu wenigen konstruktiven Torchancen. Den einzigen Treffer in Halbzeit zwei erzielte Florian Puchleitner, der einen Elfmeter nach Foulspiel an Nöstel souverän traf. Am Ende gab es an diesem Sieg überhaupt keine Diskussion und der HV TDP Stainz schaffte somit endlich den ersten Erfolg in der neuen Liga. Jetzt heißt es nach vorne schauen und das gute Gefühl für die kommenden Partien mitnehmen.'
            }
        ],
        imagePath: '../../assets/images/news/news6.JPG'
    },
    {
        newsDate: new Date('2018-09-14'),
        title: '5. Runde Grenzlandcup - HV TDP Stainz : FC Stainztal 3:2 (3:0)',
        news: [
            {
                newsLine: 'Torschützen: Herbi Kohlberger, Daniel Fabian, Rene Nöstel'
            },
            {
               newsLine: 'Ganz wichtiger Heimerfolg von unserem Team rund um die Nummer 1 Christian Schnitter (Bild) am gestrigen Nachmittag im "Stainzer Derby" gegen den FC Stainztal. Die erste Halbzeit war wieder eine, die durchaus überzeugt hat. Von Anfang an waren wir die bessere Mannschaft und konnten auch die Chancen in Tore umsetzen. Die Führung nach einem schönen Spielzug über rechts, der flache Pass von Nöstel landet genau bei Kohlberger, der ins lange Eck trifft. Das 2:0 erzielte unsere Nr. 9 Fabian, der einen Pass von Thomann im 16er annehmen kann und den Ball mit links verwertet. Das 3:0 nach einem schnell abgespielten Freistoß von Fabian auf der Mittellinie ideal auf Nöstel, der aufs Tor zieht und seinen Torinstinkt nicht verloren hat. Die zweite Halbzeit war wie auch in der Woche davor eindeutig schwächer und die Gäste kamen mit zwei Toren noch ganz knapp heran an einen Punktegewinn. Wir konnten das Ergebnis dann noch über die Zeit retten und holen uns damit den zweiten Sieg in Folge! Nächste Woche geht es am Samstag zu einem ganz schweren Auswärtsspiel nach Gralla, dem Vizemeister des Vorjahres!', 
            },
            {
                newsLine: 'Aufstellung: Schnitter, Maderthoner, Jaindl, Thomann, Kügerl, DiMeo, Kohlberger, Fabian, Gödl, Nöstel, Bohacek'
            },
            {
                newsLine: 'Ersatz: Kremser, Stelzer, Rathswohl, Sincek, Hilberger, Sackl'
            },
            {
                newsLine: '#hvtdpstainz #derbysieg #stadionstainz #heimdreier'
            }
        ],
        imagePath: '../../assets/images/news/news7.jpg'
    },
    {
        newsDate: new Date('2018-09-22'),
        title: '+++BITTERE NIEDERLAGE+++ 6. Runde GLC - HC Pro Gralla : HV TDP Stainz 3:1 (0:0)',
        news: [
            {
                newsLine: 'Torschütze: Daniel Fabian'
            },
            {
               newsLine: 'Was für ein Spiel von unserem Team! Eine geschlossene Mannschaftsleistung die nicht mit dem richtigen Ergebnis belohnt wurde. Wir waren die klar bessere Mannschaft, vom Tormann, über die gut stehende Verteidigung, über das Mittelfeld wo unsere Sprintrakete Patrick Wolf (Bild) immer wieder über die Seite für Druck sorgte, bis hin zu den Stürmern die immer für Gefahr sorgten, einfach eine geschlossene super Leistung. Die Führung durch Fabian, der einen Freistoß aus 35m herrlich unhaltbar ins Tor jagte war die verdiente Belohnung für die Leistung. Der Schiedsrichter entschied dann leider die Partie, denn in Halbzeit eins 3 unfassbare Fehlentscheidungen, die uns große Chancen verwehrte, und ein vermeintliches Abseitstor nicht gegeben haben.', 
            },
            {
                newsLine: 'Wir lassen uns nicht unterkriegen, sind stolz auf diese Leistung gegen den mehrmaligen Meister aus der Liga und werden in den nächsten Wochen weiter Gas geben und uns den Erfolg holen!'
            }
        ],
        imagePath: '../../assets/images/news/news8.jpg'
    },
    {
        newsDate: new Date('2018-10-04'),
        title: 'Dankeschön für den neuen Ball, Philippe 😉✌️🍻',
        news: [
            {
                newsLine: 'Vielen Dank an unsere Nr. 10, Philipp Bohacek, der uns mit einem neuen Ball ausgestattet hat! 😎'
            },
            {
               newsLine: 'Der neue Champions League Ball wird uns hoffentlich spielerisch auf ein ganz hohes Level bringen! ⚽️😜', 
            },
            {
                newsLine: '#hvtdpstainz #ball #stadionstainz – sehr dankbar mit Philipp Bohaček hier: Stadion Stainz.'
            }
        ],
        imagePath: '../../assets/images/news/news9.jpg'
    },
    {
        newsDate: new Date('2018-10-06'),
        title: 'Halbes Dutzend voll gemacht! 8. Runde Grenzlandcup – HV TDP Stainz : FC Gasselsdorf 6:1 (2:1)',
        news: [
            {
                newsLine: 'Torschützen: Fabian(3), Hilberger, Wolf, Sackl'
            },
            {
               newsLine: '⚽ Matchballsponsoring : Schnattls Restaurant Marktplatz 2 Groß St. Florian', 
            },
            {
                newsLine: 'Aufstellung: Christian Schnitter, Stefan Jaindl, Michael Primus, Michi Thomann (Michael Kremser), Rene Di Meo (Mario Kügerl), Rene Nöstel, Patrick Wolf, Daniel Fabian, Herbi Kohlberger (Hrvoje Sincek), Kovács Dávid, Philipp Bohaček (Erik Hilberger, Markus Sackl), Ersatz: Andreas Stelzer, Nico Reinbacher'
            },
            {
                newsLine: 'Wir haben wieder voll angeschrieben! Das Spiel beginnt für uns denkbar schlecht, vorne vergibt Fabian eine tausendprozentige Chance und mit dem ersten Eckball gegen uns bekommen wir das Gegentor. Wir haben aber Moral gezeigt und in Halbzeit eins drehen wir die Partie noch durch zweite späte Treffer von Fabian. Mit der Halbzeitführung spielten wir immer weiter nach vorne und wurden belohnt. Hilberger mit Saisontor Nummer eins nach Pass von Kohlberger zum 3:1. Wolf ebenfalls mit Saisontor Nummer eins nach Pass von Fabian und Sackl nach Pass von Sincek erhöhten auf 5:1. Den Schlusspunkt aus einem Konter setzte Fabian mit seinem dritten Treffer in diesem Spiel. Völlig verdienter Heimerfolg für unser Team! Erwähnenswert auch die Tatsache, dass wir mit Primus den mittlerweile vierten Libero in dieser Saison erfolgreich ausgetestet haben für weitere Aufgaben! ;)'
            },
            {
                newsLine: 'Bedanken möchten wir uns noch bei Gerlinde Gödl von Schnattl´s Restaurant, die den Matchball für dieses Spiel gesponsert hat.'
            },
            {
                newsLine: '#hvtdpstainz #heimsieg #halbesdutzend #stadionstainz'
            }
        ],
        imagePath: '../../assets/images/news/news10.jpg'
    },
    {
        newsDate: new Date('2018-10-11'),
        title: '👕👕👕NEUE PULLOVER👕👕👕',
        news: [
            {
                newsLine: 'Der Herbst bzw. Winter kann kommen, wir sind gerüstet!'
            },
            {
               newsLine: '⚽ Matchballsponsoring : Schnattls Restaurant Marktplatz 2 Groß St. Florian', 
            },
            {
                newsLine: 'Unsere Mannschaft hat gestern Pullover für die kalte Jahreszeit entgegennehmen dürfen. Jeder Spieler hat einen brandneuen Nike Pullover erhalten.⚽'
            },
            {
                newsLine: 'Vielen Dank an die beiden Sponsoren, die uns mit dem tollen Gewand ausgestattet haben:'
            },
            {
                newsLine: '▶ Die Mühle, ein "SchmuckStück" (Inhaber Johann Schmuck)'
            },
            {
                newsLine: '▶ Ernst Schmuck – Dienstleistungen aller Art, Minibaggerarbeiten'
            },
            {
                newsLine: 'Weiters noch ein Danke an unseren Hauptsponsor TDP Textildruckprofi Gmbh, der für die Endproduktion des Druckens zuständig war.😎'
            },
            {
                newsLine: '#hvtdpstainz #pullover #dankbar #diemühle'
            }
        ],
        imagePath: '../../assets/images/news/news11.jpg'
    },
    {
        newsDate: new Date('2018-10-22'),
        title: '10. Runde Grenzlandcup - HV TDP Stainz : HFC Leutschach 3:3 (2:0)',
        news: [
            {
                newsLine: 'Torschützen: Nöstel (2), Hilberger'
            },
            {
               newsLine: 'Im letzten Heimspiel der Herbstsaison müssen wir uns die Punkte mit unseren Gästen aus Leutschach teilen. Halbzeit eins war von uns wieder eine sehr starke und wir führen verdient mit 2 Toren. Die Führung über links und den Querpass von Kohlberger verwertet Nöstel zur Führung. Kurz vor der Pause Aktion über rechts, die Flanke von Fabian lässt Hilberger ideal tropfen und Nöstel scnürt seinen Doppelpack. Halbzeit zwei beginnt auch noch gut für uns und Hilberger kann sogar auf 3:0 erhöhen. Im Anschluss folgen 10 Minuten, die man am besten vergessen möchte. Unverständlicherweise lassen wir die Gäste wieder ins Spiel und kassieren noch 3 Treffer. Am Ende kann man sogar noch froh sein, dass es keine Niederlage wurde. Schade, aber man kann trotzdem auch in diesem Spiel sehr viel positives mitnehmen, denn wir waren über die längere Zeit des Spieles klar überlegen.', 
            },
            {
                newsLine: 'Aufstellung: Christian Schnitter, Christian Maderthoner, Hrvoje Sincek, Michi Thomann, Mario Kügerl (Patrick Gödl), Rene Di Meo (Klaus Loscher), Herbi Kohlberger, Rene Nöstel, Daniel Fabian, Patrick Wolf, Hilberger (Florian Puchleitner), Ersatz: Markus Sackl, Ronegg, Michael Kremser'
            },
            {
                newsLine: 'Jubiläum: Maderthoner (10. Spiel)'
            },
            {
                newsLine: '#hvtdpstainz #stadionstainz #freistileinlokal #matchball'
            }
        ],
        imagePath: '../../assets/images/news/news12.jpg'
    },
    {
        newsDate: new Date('2018-10-14'),
        title: '9. Runde - Hobbyclub Aqua Line Groß St. Florian : HV TDP Stainz 3:4 (3:3)',
        news: [
            {
                newsLine: 'Torschützen: Fabian (Elfer), Nöstel, Sincek, Kügerl'
            },
            {
               newsLine: 'Aufstellung: Klösch, Wolf, Maderthoner, Thomann, DiMeo (Bohacek P., Sackl), Kügerl (Reinbacher N.), Sincek (Puchleitner), Fabian (Hilberger), Kohlberger, Kovacs, Nöstel', 
            },
            {
                newsLine: 'Was für ein Spiel! Wir starten ins Spiel und sind gleich mit 2 Toren zurück. Die Chance zum 3:0 vergibt das Heimteam per Elfmeter. Auf unserer Seite sind wir sicherer und Daniel Fabian erzielt per Elfmeter das 2:1. Wir erhalten trotzdem das 3:1 und laufen einem 2 Tore Rückstand nach. Rene Nöstel per Kopf und Hrvoje Sincek gleichen noch vor der Pause aus. Ein Gewaltschuss von Mario Kügerl (Bild) sorgt für die 3:4 Führung. Noch ein Elfmeter wird vergeben vom Heimteam und so retten wir den Sieg über die Zeit! Wichtiger Erfolg und somit können wir ein erfolgreiches Fußballwochenende abschließen!'
            },
            {
                newsLine: 'Jubiläum: Philipp Bohaček (50. Spiel), Florian Puchleitner (20. Spiel)'
            },
            {
                newsLine: 'Debüt: Philipp Klösch (1. Spiel)'
            },
            {
                newsLine: '#hvtdpstainz #auswärtssieg #bravojungs'
            }
        ],
        imagePath: '../../assets/images/news/news13.jpg'
    },
    {
        newsDate: new Date('2018-10-16'),
        title: '+++EINHUNDERT+++',
        news: [
            {
                newsLine: 'Ein Fall für die HV TDP Stainz Geschichtsbücher!'
            },
            {
               newsLine: 'Am vergangenen Sonntag erzielte unser Daniel Fabian gegen Aqua Line per Elfmeter den zwischenzeitlichen Anschlusstreffer zum 1:2. Was zu diesem Zeitpunkt noch niemand wusste, dass sich unsere Nummer 9 damit in die Geschichtsbücher des Vereines eingetragen hat.', 
            },
            {
                newsLine: 'Er ist nämlich der erste Spieler, der 100 Tore für den HV TDP erzielt hat. Insgesamt 79 Spiele benötigte er dafür, um diese Marke zu knacken!'
            },
            {
                newsLine: 'Herzliche Gratulation zu diesem Erfolg und wir hoffen weiterhin auf viele Tore und Torbeteiligungen für unseren Verein! ⚽'
            },
            {
                newsLine: 'Willkommen im 100er Club! 😎🎉'
            },
            {
                newsLine: '#hvtdpstainz #hunderter #jubiläum'
            }
        ],
        imagePath: '../../assets/images/news/news14.jpg'
    }
].sort((a, b) => {

    if (a.newsDate < b.newsDate) {
      return 1;
    } 
    else if (a.newsDate > b.newsDate) {
      return -1;
    }
    else {
        return 0;
    }
  });
