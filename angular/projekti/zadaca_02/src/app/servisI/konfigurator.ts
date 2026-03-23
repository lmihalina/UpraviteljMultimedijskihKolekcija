import { InjectionToken } from "@angular/core";

export interface KonfiguratorI
{
    bazicna_putanja : string;
    port : string;
}

export const APP_CONF = new InjectionToken<KonfiguratorI>('APP_CONF');