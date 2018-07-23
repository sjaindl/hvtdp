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
