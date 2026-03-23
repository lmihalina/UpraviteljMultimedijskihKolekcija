import { Component, OnInit, inject } from '@angular/core';
import { KorisniciService } from '../../servisi/korisnici.service';
import { KolekcijaI, MultimedijskiSadrzajI } from '../../servisI/aplikacijaI';
import { CommonModule } from '@angular/common';
import { SadrzajiComponent } from "../sadrzaji/sadrzaji.component";


@Component(
{
  selector: 'app-privatne-kolekcije',
  imports: [CommonModule, SadrzajiComponent],
  templateUrl: './privatne-kolekcije.component.html',
  styleUrl: './privatne-kolekcije.component.scss'
})
export class PrivatneKolekcijeComponent implements OnInit
{
  korisniciServis = inject(KorisniciService);

  kolekcije : Array<KolekcijaI> | undefined;
  poruka : string | undefined
  poruka_azuriranja : string | undefined;
  sadrzajiKolekcije : Array<MultimedijskiSadrzajI> | undefined;

  ngOnInit(): void 
  {
    this.dajKolekcije();
  }

  dajKolekcije()
  {
    this.korisniciServis.dohvatiKolekcijeKorisnika().subscribe(
    {
      next : (podaci : Array<KolekcijaI>) => {this.kolekcije = podaci;},
      error : (greska : any) => {this.poruka = greska.error?.poruka ?? "Dogodila se greška";}
    });
  }

  prikaziSadrzaj(kolekcija_id : number)
  {
    this.korisniciServis.dohvatiSadrzaje(kolekcija_id).subscribe(
      {
        next : (podaci : Array<MultimedijskiSadrzajI>) => {this.sadrzajiKolekcije = podaci;},
        error : (greska : any) => {this.poruka = greska.error?.poruka ?? "Dogodila se greška";}
      }
    )
  }

  azurirajKolekcije(id : number, javnost : string, putanja : string)
  {
    let kolekcija : KolekcijaI = 
    {
      kolekcija_id : id,
      naziv : '',
      javna : parseInt(javnost),
      naslovna_slika_putanja : putanja
    }
    this.korisniciServis.azurirajKolekciju(kolekcija).subscribe(
      {
        next : (podaci : any) => 
        {
          this.poruka_azuriranja = podaci.poruka;
          this.dajKolekcije();
        },
        error : (greska : any) => {this.poruka_azuriranja = greska.error?.poruka ??  "Dogodila se greška";}
      });
  }
}
