export class Player {
    firstName: String
    lastName: String
    position: String
    memberSinceYear: Number
    imagePath: String
}

export const PLAYERS : Player[] = [
    {
      firstName: "Christian",
      lastName: 'Schnitter',
      position: "Tormann",
      memberSinceYear: 2015,
      imagePath: '../../assets/images/schnitti.JPG'
    }, 
    {
      firstName: "Hrovje",
      lastName: 'Sincek',
      position: "Verteidiger",
      memberSinceYear: 2014,
      imagePath: '/assets/images/sinci.JPG'
    }
];
