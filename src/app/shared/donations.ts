export class Donations {
    donator: String
    date: String
    description: String
    imagePath: String
}

export const DONATIONS : Donations[] = [
    {
        donator: 'Village Bar Stainz',
        date: '13.05.2018',
        description: 'Wir durften unser gestriges Meisterschaftsspiel gegen den FC Stainztal wieder mit einem brandneuen Matchball absolvieren! Ein riesiges Dankeschön geht nochmals über diesen Weg an die Inhaberin der Village Bar Stainz, Christina Weber, für die gestrige Matchballspende! Unser Tipp an alle die am Wochenende feiern möchten: Besucht die Village Bar, dort lässt es sich gut feiern (wir sprechen aus Erfahrung)',
        imagePath: '../../assets/images/matchballspende/spende2.jpg'
    }, 
    {
        donator: 'Studo - Die App für dein Studium',
        date: '16.04.2018',
        description: 'Wir möchten uns auf diesem Weg nochmals ganz herzlich bei Julian Kainz und seinem Unternehmen Studo - Die App für dein Studium für das Sponsoring eines brandneuen Matchballes bedanken. Der Ball kam am vergangenen Samstag gegen den HFC Schilcher erfolgreich zum Einsatz! Unser Kapitän durfte den Ball von der Mitarbeiterin des Unternehmens, Jasmin Fabian, entgegennehmen.',
        imagePath: '../../assets/images/matchballspende/spende1.jpg'
    }
];
