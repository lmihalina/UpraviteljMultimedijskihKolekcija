import { Component, OnInit } from '@angular/core';

@Component(
{
  selector: 'app-dokumentacija',
  imports: [],
  templateUrl: './dokumentacija.component.html',
  styleUrl: './dokumentacija.component.scss'
})
export class DokumentacijaComponent //implements OnInit
{
  /*
  html = '';

  ngOnInit(): void 
  {
     this.dohvatiDokumentaciju().then( html =>  this.html = html);
  }

  async dohvatiDokumentaciju()
  {

    const odgovor = await fetch('/dokumentacija/dokumentacija.html');
    let html = await odgovor.text();

    let body_pocetak = html.indexOf("<body>") + 6;
    let body_kraj = html.indexOf("</body>");

    html = html.substring(body_pocetak, body_kraj);
    return html;
  }
    */
}
