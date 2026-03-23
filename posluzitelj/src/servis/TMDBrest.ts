import { TMDBklijent } from "./TMDBklijent.js";
import {FilmoviTmdbI} from "../servisI/tmdbI";
import { Request, Response } from "express";
import { MojaSesija } from "../servisI/bazaI.js";

export class TMDBrest
{
    private tmdb : TMDBklijent;

    constructor(api_kljuc : string)
    {
        this.tmdb = new TMDBklijent(api_kljuc);
    }

    getFilmovi(zahtjev : Request, odgovor :Response)
    {
        odgovor.type("application/json");
        let sesija = zahtjev.session as MojaSesija;
        if(sesija.korisnicko_ime == null)
        {
            odgovor.status(401);
            odgovor.send({poruka : "Neautoriziran pristup!"});
            return;
        }

        let stranica = zahtjev.query["stranica"];
        let naziv = zahtjev.query["naziv"];
        if(stranica == null || naziv == null || typeof stranica != "string" || typeof naziv != "string")
        {
            odgovor.status(417);
            odgovor.send({poruka : "Nepotpuni podaci"});
            return;
        }

        this.tmdb.dohvatiFilmovePoNazivu(naziv, parseInt(stranica)).then((filmovi : FilmoviTmdbI)=>
        {
            odgovor.status(200);
            odgovor.send(filmovi);
        })
    }

    getLinkVidea(zahtjev : Request, odgovor : Response)
    {
        odgovor.type("application/json");
        let id = zahtjev.query["id"];

        if(id == null || typeof id != "string")
        {
            odgovor.status(417);
            odgovor.send({poruka : "Nepotpuni podaci"});
            return;
        }

        this.tmdb.dohvatiLinkVidea(id).then((poveznica : any)=>
        {
            odgovor.status(200);
            odgovor.send(poveznica);
            console.log(poveznica);
        });
    }
}