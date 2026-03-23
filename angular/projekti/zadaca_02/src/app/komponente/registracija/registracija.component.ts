import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KorisniciService } from '../../servisi/korisnici.service';
import { KorisnikI } from '../../servisI/aplikacijaI';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registracija',
  imports: [FormsModule, CommonModule],
  templateUrl: './registracija.component.html',
  styleUrl: './registracija.component.scss'
})
export class RegistracijaComponent 
{
  korisniciServis = inject(KorisniciService);
  
  poruka : string | undefined;
  
  ime = '';
  prezime = '';
  email = '';
  korime = '';
  lozinka = '';
  spol = '';
  adresa = '';
  telefon = '';

  registracija()
  {
    let korisnik : KorisnikI  =
    {
      ime : this.ime,
      prezime : this.prezime,
      email : this.email,
      korisnicko_ime : this.korime,
      lozinka : this.lozinka,
      spol : this.spol,
      adresa : this.adresa,
      telefon : this.telefon,
      korisnik_id : 0,
      blokiran : 0,
      datum_registracije : "",
      pogresne_prijave : 0,
      uloga_id : 0,
      aktiviran : 0,
      aktivacijski_kod : 0
    }

    this.korisniciServis.registrirajKorisnika(korisnik).subscribe(
    {
      next : (podaci : any) => {this.poruka = "Registracija uspješna";},
      error : (greska : any) => {this.poruka = greska.error?.poruka ?? "Dogodila se greška";}
    });
  }
}
