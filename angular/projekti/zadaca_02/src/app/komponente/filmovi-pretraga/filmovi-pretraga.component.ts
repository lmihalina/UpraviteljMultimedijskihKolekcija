import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilmoviTmdbI, FilmTmdbI } from '../../servisI/FilmoviI';
import { FilmoviService } from '../../servisi/filmovi.service';
import { MultimedijskiSadrzajI } from '../../servisI/aplikacijaI';
import { SadrzajiComponent } from "../sadrzaji/sadrzaji.component";

@Component(
{
  selector: 'app-filmovi-pretraga',
  imports: [FormsModule, CommonModule, SadrzajiComponent],
  templateUrl: './filmovi-pretraga.component.html',
  styleUrl: './filmovi-pretraga.component.scss'
})
export class FilmoviPretragaComponent 
{
  filmoviServis = inject(FilmoviService);

  pretraga = '';
  poruka : string | undefined;
  filmovi : Array<FilmTmdbI> | undefined;
  odabraniFilm : Array<MultimedijskiSadrzajI> | undefined;

  pretrazi()
  {
    if (this.pretraga.length < 3)
      this.filmovi = undefined;
    else
    {
      this.filmoviServis.pretraziFilmove(this.pretraga, 1).subscribe(
      {
        next : (podaci : FilmoviTmdbI) => {this.filmovi = podaci.results;},
        error : (greska : any) => {this.poruka = greska.error?.poruka ?? "Dogodila se greška";}
      });
    }
  }

  prikaziDetalje(id : number)
  {
    let film = this.filmovi?.find( f => id == f.id);
    if(film == undefined || this.filmovi == undefined)
      return;
    
    this.filmoviServis.dohvatiLinkVidea(film.id).subscribe( (video : any) =>
    { 
      this.odabraniFilm = new Array<MultimedijskiSadrzajI>();
      this.odabraniFilm.push({multimedijski_sadrzaj_id : 99, tip : "slika", naziv : film.title + " - slika", 
        putanja : "https://image.tmdb.org/t/p/w500" + film.poster_path, javni:  1, autor : null, velicina : null, datum : null});
      this.odabraniFilm.push({multimedijski_sadrzaj_id : 100, tip : "video", naziv : film.title + " - video",
        putanja : video.poveznica, javni:  1, autor : null, velicina : null, datum : null}); 
    });
    
  }
}
