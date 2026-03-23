import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KorisniciService } from '../../servisi/korisnici.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prijava',
  imports: [FormsModule, CommonModule],
  templateUrl: './prijava.component.html',
  styleUrl: './prijava.component.scss'
})
export class PrijavaComponent 
{
  korisniciServis = inject(KorisniciService);

  korime = '';
  lozinka = '';
  poruka : string | undefined;
  

  prijava()
  { 
    this.korisniciServis.prijaviKorisnika({korime : this.korime, lozinka : this.lozinka}).subscribe(
      {
        next : (podaci : any) => {this.poruka = "Prijava uspješna";},
        error : (greska : any) => {this.poruka = greska.error?.poruka ?? "Dogodila se greška";}
      }
    );
  }
}
