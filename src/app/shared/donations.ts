export class Donations {
    donator: string
    date: Date
    match: string
    description: string
    imagePath: string
    matchBallImagePath: string
}

export const DONATIONS : Donations[] = [
    {
        donator: 'Sportcafe Murlitz',
        date: new Date('2017-05-14'),
        match: 'HV TDP - Stainztal',
        description: 'Wir bedanken uns auf diesem Weg nochmals ganz herzlich beim Sportcafe Frauental für die Spende eines Matchballes, den wir im Heimspiel gegen den FC Stainztal zum ersten mal zum Einsatz gebracht haben! Vielen Dank dafür! :)',
        imagePath: '../../assets/images/matchballspende/spende_murlitz.jpg',
        matchBallImagePath: '../../assets/images/matchballspende/murlitz.gif'
    }, 
    {
        donator: 'Village Bar Stainz',
        date: new Date('2018-05-13'),
        match: 'HV TDP - Stainztal',
        description: 'Wir durften unser gestriges Meisterschaftsspiel gegen den FC Stainztal wieder mit einem brandneuen Matchball absolvieren! Ein riesiges Dankeschön geht nochmals über diesen Weg an die Inhaberin der Village Bar Stainz, Christina Weber, für die gestrige Matchballspende! Unser Tipp an alle die am Wochenende feiern möchten: Besucht die Village Bar, dort lässt es sich gut feiern (wir sprechen aus Erfahrung)',
        imagePath: '../../assets/images/matchballspende/spende_village.jpg',
        matchBallImagePath: '../../assets/images/matchballspende/village.gif'
    }, 
    {
        donator: 'Studo - Die App für dein Studium',
        date: new Date('2018-04-16'),
        match: 'HV TDP - HFC Schilcher',
        description: 'Wir möchten uns auf diesem Weg nochmals ganz herzlich bei Julian Kainz und seinem Unternehmen Studo - Die App für dein Studium für das Sponsoring eines brandneuen Matchballes bedanken. Der Ball kam am vergangenen Samstag gegen den HFC Schilcher erfolgreich zum Einsatz! Unser Kapitän durfte den Ball von der Mitarbeiterin des Unternehmens, Jasmin Fabian, entgegennehmen.',
        imagePath: '../../assets/images/matchballspende/spende_studo.jpg',
        matchBallImagePath: '../../assets/images/matchballspende/studo.gif'
    }
].sort((a, b) => {

    if (a.date < b.date) {
      return 1;
    } 
    else if (a.date > b.date) {
      return -1;
    }
    else {
        return 0;
    }
  });;
