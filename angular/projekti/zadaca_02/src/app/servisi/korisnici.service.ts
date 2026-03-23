import { Injectable, inject } from '@angular/core';
import { HttpClient,  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KolekcijaI, KorisnikI, MultimedijskiSadrzajI } from '../servisI/aplikacijaI';
import { APP_CONF, KonfiguratorI } from '../servisI/konfigurator';


@Injectable(
{
  providedIn: 'root'
})

export class KorisniciService 
{
  config : KonfiguratorI = inject(APP_CONF);

  constructor(private http : HttpClient ) {}

  prijaviKorisnika(podaci : any) : Observable<any>
  {
    return this.http.post<any>(`${this.config.bazicna_putanja}${this.config.port}/api/korisnici/prijava/${podaci.korime}`, {lozinka : podaci.lozinka});
  }

  registrirajKorisnika(korisnik : KorisnikI) : Observable<any>
  {
     console.log(korisnik)
    return this.http.post<any>(`${this.config.bazicna_putanja}${this.config.port}/api/korisnici`, korisnik);
  }

  odjaviKorisnika() : Observable<any>
  {
    return this.http.get<any>(`${this.config.bazicna_putanja}${this.config.port}/api/odjava`);
  }

  dohvatiJavneKolekcije() : Observable<Array<KolekcijaI>>
  {
    return this.http.get<Array<KolekcijaI>>(`${this.config.bazicna_putanja}${this.config.port}/api/javneKolekcije`);
  }

  dohvatiKolekcijeKorisnika() : Observable<Array<KolekcijaI>>
  {
    return this.http.get<Array<KolekcijaI>>(`${this.config.bazicna_putanja}${this.config.port}/api/privatneKolekcije`);
  }

  dohvatiKolekcije() : Observable<Array<KolekcijaI>>
  {
    return this.http.get<Array<KolekcijaI>>(`${this.config.bazicna_putanja}${this.config.port}/api/kolekcije`);
  }

  dohvatiJavneSadrzaje(kolekcija_id : number) : Observable<Array<MultimedijskiSadrzajI>>
  {
    return this.http.get<Array<MultimedijskiSadrzajI>>(`${this.config.bazicna_putanja}${this.config.port}/api/javniSadrzaji/${kolekcija_id}`);
  }

  dohvatiSadrzaje(kolekcija_id : number)
  {
    return this.http.get<Array<MultimedijskiSadrzajI>>(`${this.config.bazicna_putanja}${this.config.port}/api/sadrzaji/${kolekcija_id}`);
  }

  dohvatiKorisnike()
  {
    return this.http.get<Array<KorisnikI>>( `${this.config.bazicna_putanja}${this.config.port}/api/korisnici`);
  }

  azurirajKorisnika (korisnik : any) : Observable<any>
  {
    return this.http.put<any>(`${this.config.bazicna_putanja}${this.config.port}/api/korisnik`, korisnik);
  }

  dodajKolekciju(kolekcija : KolekcijaI) : Observable<any>
  {
    return this.http.post<any>(`${this.config.bazicna_putanja}${this.config.port}/api/kolekcije`, kolekcija);
  }

  dodijeliKorisnikeKolekciji(kolekcija_id : number, korisnici_id : Array<string>) : Observable<any>
  {
    return this.http.post<any>(`${this.config.bazicna_putanja}${this.config.port}/api/korisniciKolekcije`, {kolekcija_id : kolekcija_id.toString(), korisnici_id : korisnici_id})
  }

  azurirajKolekciju(kolekcija : KolekcijaI) : Observable<any>
  {
    return this.http.put<any>(`${this.config.bazicna_putanja}${this.config.port}/api/kolekcije`, kolekcija);
  }

  traziJavneSadrzaje(trazi : string) : Observable<Array<MultimedijskiSadrzajI>>
  {
    return this.http.get<Array<MultimedijskiSadrzajI>>(`${this.config.bazicna_putanja}${this.config.port}/api/javniSadrzaji/pretraga`,
      {
        params : {trazi : trazi}
      });
  }

}
