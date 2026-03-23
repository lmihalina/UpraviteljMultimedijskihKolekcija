import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { KorisniciService } from '../../servisi/korisnici.service';


@Component({
  selector: 'app-odjava',
  imports: [CommonModule],
  templateUrl: './odjava.component.html',
  styleUrl: './odjava.component.scss'
})
export class OdjavaComponent implements OnInit
{
  korisniciService = inject(KorisniciService)

  ngOnInit(): void 
  {
    this.korisniciService.odjaviKorisnika().subscribe();
  }
}
