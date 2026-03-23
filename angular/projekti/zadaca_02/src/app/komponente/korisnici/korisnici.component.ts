import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KorisnikI } from '../../servisI/aplikacijaI';
import { KorisniciService } from '../../servisi/korisnici.service';
import { FormsModule } from '@angular/forms';

@Component(
{
  selector: 'app-korisnici',
  imports: [CommonModule],
  templateUrl: './korisnici.component.html',
  styleUrl: './korisnici.component.scss'
})
export class KorisniciComponent implements OnInit
{
  korisniciServis = inject(KorisniciService);

  poruka : string | undefined;
  poruka_dodanog_korisnika : string | undefined;
  korisnici : Array<KorisnikI> | undefined;

  ngOnInit(): void 
  {
    this.dajKorisnike();
  }

  dajKorisnike()
  {
    this.korisniciServis.dohvatiKorisnike().subscribe(
    {
      next : (podaci : Array<KorisnikI>) => {this.korisnici = podaci;},
      error : (greska : any) => {this.poruka = greska.error?.poruka ?? "Dogodila se greška";}
    });
  }

  azurirajKorisnika(id : number, blokiran : string, uloga_id : string)
  {
    let korisnik = 
    {
      korisnik_id : id,
      blokiran : parseInt(blokiran),
      uloga_id : parseInt(uloga_id),
      pogresne_prijave : 0
    }
    this.korisniciServis.azurirajKorisnika(korisnik).subscribe(
    {
      next : (podaci : any) => 
      {
        this.poruka_dodanog_korisnika = podaci.poruka; 
        this.dajKorisnike();
      },
      error : (greska : any) => {this.poruka_dodanog_korisnika = greska.error?.poruka ?? "Dogodila se greška";}
    });
  }
}
