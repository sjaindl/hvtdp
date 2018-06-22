export class Items {
    name: String
    description: String
    price: String
    imagePath: String
}

export const ITEMS : Items[] = [
    {
        name: 'HV TDP Stainz Heimtrikot (inkl. Red Bull Gravur)',
        description: 'Das originale Heimtrikot unseres Vereines. Die einzigartige FC Red Bull Salzburg Gravur (vorne) erinnert an unser größtes Spiel unserer bisherigen Vereinsgeschichte im Jahr 2017. Das Design des Trikots ist einzigartig und ein echter Hingucker.',
        price: '19,90 €',
        imagePath: '../../assets/images/fanshop/fanshirt.jpg'
    }, 
    {
        name: 'Weihnachtsmütze',
        description: 'Ho Ho Ho! Ja ist denn schon Weihnachten? Bei uns das ganze Jahr! Deshalb gibt es die exklusiven HV TDP Stainz Weihnachtsmützen das Ganze Jahr zum Erwerben. Wir bieten die Mützen in 2 Farben an: Rot oder Violett.',
        price: '4,90 €',
        imagePath: '../../assets/images/fanshop/xmas_muetze.jpg'
    },
    {
        name: 'Handtuch',
        description: 'Nach der heißen Dusche am Abend der ideale Fanartikel für Jeden. Auch als Strandhandtuch ist das große Handtuch vom HV TDP ideal. Ob klein oder groß, wir haben beide Arten für euch zum Kauf.',
        price: 'groß: 15,90 €, klein: 12,90 €',
        imagePath: '../../assets/images/fanshop/handtuch.jpg'
    },
    {
        name: 'Polo-Shirt',
        description: 'Das Ausgehpolo, welches auch unsere Spieler tragen. Das in Navy Blue gehaltene Polo gibt es sowohl für Männer, als auch für Frauen.',
        price: '12,90 €',
        imagePath: '../../assets/images/fanshop/polo.jpg'
    }
];
