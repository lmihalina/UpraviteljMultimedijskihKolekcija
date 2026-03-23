import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { PrijavaComponent } from './komponente/prijava/prijava.component';
import { JavneKolekcijeComponent } from './komponente/javne-kolekcije/javne-kolekcije.component';
import { PrivatneKolekcijeComponent } from './komponente/privatne-kolekcije/privatne-kolekcije.component';
import { KolekcijeComponent } from './komponente/kolekcije/kolekcije.component';
import { FilmoviPretragaComponent } from './komponente/filmovi-pretraga/filmovi-pretraga.component';
import { KorisniciComponent } from './komponente/korisnici/korisnici.component';
import { RegistracijaComponent } from './komponente/registracija/registracija.component';
import { DokumentacijaComponent } from './komponente/dokumentacija/dokumentacija.component';
import { OdjavaComponent } from './komponente/odjava/odjava.component';

export const routes: Routes = 
[
    {path : "javneKolekcije", component : JavneKolekcijeComponent},
    {path : "privatneKolekcije" , component : PrivatneKolekcijeComponent},
    {path : "kolekcije", component : KolekcijeComponent},
    {path : "korisnici", component : KorisniciComponent},
    {path : "filmovi", component : FilmoviPretragaComponent},
    {path : "dokumentacija", component : DokumentacijaComponent},
    {path : "registracija", component : RegistracijaComponent},
    {path : 'prijava', component : PrijavaComponent},
    {path : 'odjava', component : OdjavaComponent},
    {path : '', redirectTo : "/javneKolekcije", pathMatch : 'full'}
];
