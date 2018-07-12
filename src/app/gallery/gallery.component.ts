import { Component, OnInit } from '@angular/core';
import { AlbumSeason, PHOTOS, Album } from '../shared/photos';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  seasons: AlbumSeason[]
  selectedSeason: AlbumSeason = null
  selectedAlbum: Album = null

  constructor() { 
    this.seasons = PHOTOS.sort((a, b) => {

      if (a.season < b.season) {
        return 1;
      } 
      else if (a.season > b.season) {
        return -1;
      }
      else {
          return 0;
      }
    });
  }

  ngOnInit() {
  }

  selectSeason(season: AlbumSeason) {
    this.selectedSeason = season
  }

  selectAlbum(album: Album) {
    this.selectedAlbum = album
  } 

  backFromPhotos() {
    this.selectedAlbum = null
  }

  backFromAlbums() {
    this.selectedSeason = null
  }

}
