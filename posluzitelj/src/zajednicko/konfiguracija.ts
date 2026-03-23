import dsPromise from "fs/promises";

type Konf =
{
    tajniKljucSesija : string,
    stranicaLimit : string,
    tmdbApiKeyV3 : string,
    tmdbApiKeyV4 : string
};



export class Konfiguracija
{
    private konf : Konf;

    constructor()
    {
        this.konf = 
        {
            tajniKljucSesija : "",
            stranicaLimit : "",
            tmdbApiKeyV3 : "",
            tmdbApiKeyV4 : ""
        }
    }

    public dajKonf()
    {
        return this.konf;
    }

    public async ucitajKonfiguraciju()
    {
        if (process.argv[2] == undefined)
            throw new Error("Nedostaje putanja do konfiguracijske datoteke!");

         let putanja: string = "podaci/" + process.argv[2];
         var podaci: string = await dsPromise.readFile(putanja, { encoding: "utf-8" });

         this.pretvoriUJson(podaci);
         this.provjeriIspravnostKonfiguracije();
    }

    private pretvoriUJson(podaci : string)
    {
        let konf : {[kljuc : string] : string} = {};
        let nizPodataka = podaci.split("\n");

        for(let redak of nizPodataka)
        {
            let stupci = redak.split("$");
            let naziv = stupci[0];
            if (typeof naziv != "string" || naziv == "") continue;
            let vrijednost : string = stupci[1] ?? "";

            konf[naziv] = vrijednost;
        }

        this.konf = konf as Konf;
    }

    private provjeriIspravnostKonfiguracije()
    {
        if (!podaciIspravni(this.konf.tajniKljucSesija))
            throw new Error ("Fali tajni kljuc sesije");
        if (!podaciIspravni(this.konf.stranicaLimit))
            throw new Error ("Fali broj entiteta po stranici");
        if (!podaciIspravni(this.konf.tmdbApiKeyV3))
            throw new Error ("Fali API kljuc V3");
        if (!podaciIspravni(this.konf.tmdbApiKeyV4))
            throw new Error ("Fali API kljuc V4");

        let brojStranica : number = parseInt(this.konf.stranicaLimit);
        if(isNaN(brojStranica) || brojStranica < 10 || brojStranica > 50)
            throw new Error ("Broj entiteta po stranici nije u trazenom formatu");
        
        if(this.konf.tajniKljucSesija.length < 100 || this.konf.tajniKljucSesija.length > 200)
            throw new Error ("Tajni kljuc sesije nije u trazenom formatu nije u trazenom formatu");

    
        function podaciIspravni(podaci : string)
        {
            if(podaci == undefined || podaci.trim() == "")
                return false;
            return true;
        }
    }
}