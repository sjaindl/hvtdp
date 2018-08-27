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
