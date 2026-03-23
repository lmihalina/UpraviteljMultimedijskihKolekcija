import { Component, inject, OnInit } from '@angular/core';
import { KorisniciService } from '../../servisi/korisnici.service';
import { KolekcijaI, KorisnikI } from '../../servisI/aplikacijaI';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component(
{
  selector: 'app-kolekcije',
  imports: [CommonModule, FormsModule],
  templateUrl: './kolekcije.component.html',
  styleUrl: './kolekcije.component.scss'
})
export class KolekcijeComponent implements OnInit
{
  korisniciServis = inject(KorisniciService);

  poruka : string | undefined;
  poruka_dodane_kolekcije : string | undefined;
  kolekcije : Array<KolekcijaI> |  undefined;
  korisnici : Array<KorisnikI> | undefined;

  kolekcija : KolekcijaI = 
  {
    kolekcija_id : 0,
    javna : 0,
    naslovna_slika_putanja : '',
    naziv : ''
  };

  ngOnInit(): void 
  {
    this.dajKolekcije();
  }

  dajKolekcije()
  {
    this.korisniciServis.dohvatiKolekcije().subscribe(
    {
      next : (podaci : Array<KolekcijaI>) => 
      {
        this.kolekcije = podaci;
        this.korisniciServis.dohvatiKorisnike().subscribe(
        {
          next : (korisnici : Array<KorisnikI>) => this.korisnici = korisnici
        });
      },

      error : (greska : any) => {this.poruka = greska.error?.poruka ?? "Dogodila se greška";}
    });
  }

  novaKolekcija()
  {
    this.korisniciServis.dodajKolekciju(this.kolekcija).subscribe(
      {
        next : (podaci : any) => 
        {
          this.poruka_dodane_kolekcije = podaci.poruka; 
          this.dajKolekcije();
        },
        error : (greska : any) => {this.poruka_dodane_kolekcije = greska.error?.poruka ?? "Dogodila se greška";}
      });
      
  }

  dodijeliKorisnike(id : number, korisnici : HTMLCollectionOf<HTMLOptionElement>)
  { 
    let korisnici_id = Array<string>();
    console.log(korisnici);
    for(let k of korisnici)
    {
      korisnici_id.push(k.value);
    }
    console.log
    this.korisniciServis.dodijeliKorisnikeKolekciji(id, korisnici_id).subscribe(
      {
        next : (podaci : any) => 
          {
            this.poruka_dodane_kolekcije = podaci.poruka;
            this.dajKolekcije();
          },
        error : (greska : any) => {this.poruka_dodane_kolekcije = greska.error?.poruka ?? "Dogodila se greška";}
      });
  }
  
}
