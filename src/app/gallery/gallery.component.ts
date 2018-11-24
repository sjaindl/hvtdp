import { Component, OnInit } from '@angular/core';
import { AlbumSeason, Album } from '../shared/photos';
import { MysqlService } from '../services/mysql.service';
import { baseUrlImages } from '../shared/baseurls';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  seasons: AlbumSeason[]
  selectedSeason: AlbumSeason = null
  selectedAlbum: Album = null
  imageBaseUrl: String

  constructor(private mysqlService: MysqlService) { 
  }

  ngOnInit() {
    this.imageBaseUrl = baseUrlImages

    this.mysqlService.getPhotos().subscribe(seasons => {
      this.seasons = seasons
    })
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
