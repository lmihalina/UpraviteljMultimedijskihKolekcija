import { Component, inject, OnInit } from '@angular/core';
import { KorisniciService } from '../../servisi/korisnici.service';
import { KolekcijaI, MultimedijskiSadrzajI } from '../../servisI/aplikacijaI';
import { CommonModule } from '@angular/common';
import { SadrzajiComponent } from "../sadrzaji/sadrzaji.component";
import { APP_CONF, KonfiguratorI } from '../../servisI/konfigurator';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-javne-kolekcije',
  imports: [CommonModule, SadrzajiComponent, FormsModule],
  templateUrl: './javne-kolekcije.component.html',
  styleUrl: './javne-kolekcije.component.scss'
})
export class JavneKolekcijeComponent implements OnInit
{
    korisniciServis = inject(KorisniciService);
    config : KonfiguratorI = inject(APP_CONF);

    kolekcije : Array<KolekcijaI> | undefined;
    poruka : string | undefined
    sadrzajiKolekcije : Array<MultimedijskiSadrzajI> | undefined;
    pretrazivanje = '';

  ngOnInit(): void 
  {
    this.korisniciServis.dohvatiJavneKolekcije().subscribe(
      {
        next : (podaci : Array<KolekcijaI>) => {this.kolekcije = podaci;},
        error : (greska : any) => {this.poruka = greska.error?.poruka ?? "Dogodila se greška";}
      }
    );
    console.log(this.config);
  }

  prikaziSadrzaj(kolekcija_id : number)
  {
    this.korisniciServis.dohvatiJavneSadrzaje(kolekcija_id).subscribe(
      {
        next : (podaci : Array<MultimedijskiSadrzajI>) => {this.sadrzajiKolekcije = podaci;},
        error : (greska : any) => {this.poruka = greska.error?.poruka ?? "Dogodila se greška";}
      }
    )
  }

  pretraziSadrzaj()
  {
    if (this.pretrazivanje.length < 3)
    {
      this.sadrzajiKolekcije = undefined;
      this.poruka = "Upišite minimalno 3 znaka";
    }
    else
    {
      this.poruka = undefined;
      this.korisniciServis.traziJavneSadrzaje(this.pretrazivanje).subscribe(
      {
        next : (podaci : Array<MultimedijskiSadrzajI>) => {this.sadrzajiKolekcije = podaci;},
        error : (greska : any) => {this.poruka = greska.error?.poruka ?? "Dogodila se greška";}
      });
    }
  }
}
