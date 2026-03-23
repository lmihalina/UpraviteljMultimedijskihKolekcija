import { FilmoviTmdbI, OdgovorVideoTmdbI } from "../servisI/tmdbI.js";

export class TMDBklijent
{
    private bazicniURL = "https://api.themoviedb.org/3";
    public apiKljuc : string

    constructor(apiKljuc : string)
    {
        this.apiKljuc = apiKljuc;
    }

    public async dohvatiSveFilmove()
    {
        let resurs = "/discover/movie";
        let odgovor = await this.obaviZahtjev(resurs);
        return JSON.parse(odgovor) as FilmoviTmdbI;
    }

    public async dohvatiFilmovePoNazivu(naziv : string, stranica : number)
    {
        let resurs = "/search/movie";
        let parametri = 
        {
            sort_by : "popularity.desc",
            include_adult : false,
            page : stranica,
            query : naziv
        }
        let odgovor = await this.obaviZahtjev(resurs, parametri);
        return JSON.parse(odgovor) as FilmoviTmdbI;
    }

    public async dohvatiLinkVidea(id : string)
    {
        //https://api.themoviedb.org/3/movie/{movie_id}/videos?api_key=<TVOJ_API_KLJUC>
        let resurs = `/movie/${id}/videos`;
        let odgovor = JSON.parse((await this.obaviZahtjev(resurs))) as OdgovorVideoTmdbI;
        let trailer = odgovor.results.find(el => el.site === "YouTube" && el.type === "Trailer")
        let poveznica = "https://www.youtube.com/embed/" + trailer?.key;
        return {poveznica : poveznica};
    }

    private async obaviZahtjev(resurs : string, parametri : {[kljuc : string] : string | number | boolean} = {})
    {
        let zahtjev = this.bazicniURL + resurs + "?api_key=" + this.apiKljuc;
        for(let p in parametri)
            zahtjev+="&"+p+"="+parametri[p];

        console.log("TMDB api: " + zahtjev);
        let odgovor = await fetch(zahtjev);
        let rezultat = await odgovor.text();
        return rezultat;
    }
     
    
}