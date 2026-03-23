import { Injectable } from '@angular/core';
import { KonfiguratorI } from '../servisI/konfigurator';

@Injectable(
{
  providedIn: 'root'
})
export class KonfiguratorService 
{
  private config? : KonfiguratorI;
  
  async load() : Promise<void>
  {
    const res = await fetch('/config.json');
    this.config = (await res.json() as KonfiguratorI);
  }

  get value() : KonfiguratorI
  {
    if(!this.config)
      throw new Error('Konfiguracija nije učitana!');
    return this.config;
  }


  constructor() { }
}
