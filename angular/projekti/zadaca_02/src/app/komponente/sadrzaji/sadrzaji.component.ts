import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MultimedijskiSadrzajI } from '../../servisI/aplikacijaI';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-sadrzaji',
  imports: [CommonModule],
  templateUrl: './sadrzaji.component.html',
  styleUrl: './sadrzaji.component.scss'
})
export class SadrzajiComponent 
{
  dezinfektor = inject(DomSanitizer);
  @Input() sadrzaji : Array<MultimedijskiSadrzajI> | undefined;
  @Input() sakriveniMetapodaci = false;
  @Output() sadrzajiChange = new EventEmitter<undefined>();
  
  povratak()
  {
    this.sadrzaji = undefined;
    this.sadrzajiChange.emit(undefined);
  }

  dezinficiraj(url : string)
  {
    return this.dezinfektor.bypassSecurityTrustResourceUrl(url);
  }
}
