import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FilmoviTmdbI } from '../servisI/FilmoviI';
import { Observable } from 'rxjs';
import { APP_CONF, KonfiguratorI } from '../servisI/konfigurator';

@Injectable({
  providedIn: 'root'
})
export class FilmoviService 
{

  constructor(private http : HttpClient) { }

  config : KonfiguratorI = inject(APP_CONF);

  pretraziFilmove(naziv : string, stranica : number) : Observable<FilmoviTmdbI>
  {
    return this.http.get<FilmoviTmdbI>(`${this.config.bazicna_putanja}${this.config.port}/api/filmovi`, 
    {
        params : 
        {
          naziv : naziv, 
          stranica : stranica.toString()
        }
    });
  }

  dohvatiLinkVidea(id : number) : Observable<any>
  {
    return this.http.get<any>(`${this.config.bazicna_putanja}${this.config.port}/api/film/video`,
    {
      params: {id : id.toString()}
    }
    );
  }
}
