import { KolekcijaI, KorisnikI, MultimedijskiSadrzajI, UlogaI } from "../servisI/bazaI";
import Baza from "../zajednicko/sqliteBaza.js";

export class BazaDAO
{
    private baza : Baza;

    constructor()
    {
        this.baza = new Baza("podaci/RWA2025lmihalina22.sqlite");
        this.baza.spoji();
    }

    async dajKorisnike() : Promise<Array<KorisnikI>>  //change
    {
        let sql = "SELECT * FROM Korisnik;";
        var podaci = (await this.baza.dajPodatke(sql, [])) as Array<KorisnikI>;
        let rezultat = new Array<KorisnikI>();

        for (let p of podaci)
        {
            let k : KorisnikI =
            {
                korisnik_id : p["korisnik_id"],
                ime : p["ime"],
                prezime : p["prezime"],
                email : p["email"],
                korisnicko_ime : p["korisnicko_ime"],
                lozinka : p["lozinka"],
                pogresne_prijave : p["pogresne_prijave"],
                spol : p["spol"],
                adresa : p["adresa"],
                telefon : p["telefon"],
                blokiran : p["blokiran"],
                datum_registracije : p["datum_registracije"],
                uloga_id : p["uloga_id"],
                aktiviran : p["aktiviran"],
                aktivacijski_kod : p["aktivacijski_kod"]
            }
            rezultat.push(k);
        }
        return rezultat;
    }

    async dajKorisnikaPoID(id : string) : Promise<KorisnikI | null> //change
    {
        let sql = "SELECT * FROM Korisnik WHERE korisnik_id=?;";
        var podaci = (await this.baza.dajPodatke(sql, [id])) as Array<KorisnikI>;
        
        if (podaci.length == 1 && podaci[0] != undefined)
        {
            let p = podaci[0];
            let k : KorisnikI = 
            {
                korisnik_id : p["korisnik_id"],
                ime : p["ime"],
                prezime : p["prezime"],
                email : p["email"],
                korisnicko_ime : p["korisnicko_ime"],
                lozinka : p["lozinka"],
                pogresne_prijave : p["pogresne_prijave"],
                spol : p["spol"],
                adresa : p["adresa"],
                telefon : p["telefon"],
                blokiran : p["blokiran"],
                datum_registracije : p["datum_registracije"],
                uloga_id : p["uloga_id"],
                aktiviran : p["aktiviran"],
                aktivacijski_kod : p["aktivacijski_kod"]
            }
            return k;
        }
        return null;
    }

    async dajKorisnika(korisnicko_ime : string) : Promise<KorisnikI | null> //change
    {
        let sql = "SELECT * FROM Korisnik WHERE korisnicko_ime = ?;";
        var podaci = (await this.baza.dajPodatke(sql, [korisnicko_ime])) as Array<KorisnikI>;
        
        if (podaci.length == 1 && podaci[0] != undefined)
        {
            let p = podaci[0];
            let k : KorisnikI = 
            {
                korisnik_id : p["korisnik_id"],
                ime : p["ime"],
                prezime : p["prezime"],
                email : p["email"],
                korisnicko_ime : p["korisnicko_ime"],
                lozinka : p["lozinka"],
                pogresne_prijave : p["pogresne_prijave"],
                spol : p["spol"],
                adresa : p["adresa"],
                telefon : p["telefon"],
                blokiran : p["blokiran"],
                datum_registracije : p["datum_registracije"],
                uloga_id : p["uloga_id"],
                aktiviran : p["aktiviran"],
                aktivacijski_kod : p["aktivacijski_kod"]
            }
            return k;
        }
        return null;
    }

    async dajUloguKorisnika(id_uloga : string) : Promise<UlogaI | null>
    {   
        let sql = "SELECT * FROM Uloga WHERE id_uloga = ?;";
        var podaci = await this.baza.dajPodatke(sql, [id_uloga]) as Array<UlogaI>;
        
        if (podaci.length == 1 && podaci[0] != undefined)
        {
            let p = podaci[0];
            let u : UlogaI =
            {
                id_uloga : p["id_uloga"],
                naziv : p["naziv"],
                opis : p["opis"]
            }
            return u;
        }
        return null;
    }

    async dodajKorisnika(korisnik : KorisnikI) //change
    {
        let pomocni_sql = "SELECT * FROM Korisnik ORDER BY korisnik_id DESC LIMIT 1;";
        let zadnji_korisnik = await this.baza.dajPodatke(pomocni_sql, []) as KorisnikI;

        korisnik.korisnik_id = zadnji_korisnik.korisnik_id + 1;
        korisnik.pogresne_prijave = 0;
        korisnik.blokiran = 0;
        korisnik.datum_registracije = "DATE('now')";
        korisnik.uloga_id = 1;
        korisnik.aktiviran = 0;

        let sql = "INSERT INTO Korisnik VALUES(?,?,?,?,?,?,?,?,?,?,?,DATETIME('now'),?,?,?);";
        let podaci = 
        [
            korisnik.korisnik_id,
            korisnik.ime,
            korisnik.prezime,
            korisnik.email,
            korisnik.korisnicko_ime,
            korisnik.lozinka,
            korisnik.pogresne_prijave,
            korisnik.spol,
            korisnik.adresa,
            korisnik.telefon,
            korisnik.blokiran,
            korisnik.uloga_id,
            korisnik.aktiviran,
            korisnik.aktivacijski_kod
        ];
        await this.baza.ubaciAzurirajPodatke(sql, podaci);
        return true;
    }

    async azurirajKorisnika(korisnik : KorisnikI)  //change
    {
        let sql = "UPDATE Korisnik SET pogresne_prijave = ?, blokiran = ?, uloga_id = ?, aktiviran = ? WHERE korisnik_id = ?;";
        let podaci = [korisnik.pogresne_prijave, korisnik.blokiran, korisnik.uloga_id, korisnik.aktiviran, korisnik.korisnik_id];
        await this.baza.ubaciAzurirajPodatke(sql, podaci);
        return true;
    }

    async dajJavneKolekcije() : Promise<Array<KolekcijaI>>
    {
        let sql = "SELECT * FROM Kolekcija WHERE javna = TRUE;";
        let podaci = (await this.baza.dajPodatke(sql, [])) as Array<KolekcijaI>;
        let rezultat = new Array<KolekcijaI>();

        for(let p of podaci)
        {
            let kolekcija : KolekcijaI =
            {
                kolekcija_id : p["kolekcija_id"],
                naziv : p["naziv"],
                javna : p["javna"],
                naslovna_slika_putanja : p["naslovna_slika_putanja"]
            };
            rezultat.push(kolekcija);
        }
        return rezultat;
    }

    async dajKolekcije() : Promise<Array<KolekcijaI>>
    {
        let sql = "SELECT * FROM Kolekcija";
        let podaci = (await this.baza.izvrsiUpit(sql)) as Array<KolekcijaI>;
        let rezultat = new Array<KolekcijaI>();

        for(let p of podaci)
        {
            let kolekcija : KolekcijaI =
            {
                kolekcija_id : p["kolekcija_id"],
                naziv : p["naziv"],
                javna : p["javna"],
                naslovna_slika_putanja : p["naslovna_slika_putanja"]
            };
            rezultat.push(kolekcija);
        }
        return rezultat;

    }

    async dajKolekciju(id : string) : Promise<KolekcijaI | null>
    {
        let sql = "SELECT * FROM Kolekcija WHERE kolekcija_id=?";
        let podaci = (await this.baza.dajPodatke(sql, [id])) as Array<KolekcijaI>;

        if (podaci.length == 1 && podaci[0] != undefined)
        {
            let p = podaci[0];
            let k : KolekcijaI =
            {
                kolekcija_id : p["kolekcija_id"],
                naziv : p["naziv"],
                javna : p["javna"],
                naslovna_slika_putanja : p["naslovna_slika_putanja"]
            };
            return k;
        }
        return null;
    }
    
    async dajKolekcijeKorisnika(korisnicko_ime : string) : Promise<Array<KolekcijaI>>
    {
        let korisnik : KorisnikI | null = await this.dajKorisnika(korisnicko_ime);
        let korisnik_id : number;
        if (korisnik == undefined)
            korisnik_id = -1;
        else
            korisnik_id = korisnik.korisnik_id;
        korisnik_id;
       
        let sql = "SELECT Kolekcija.kolekcija_id, Kolekcija.naziv, Kolekcija.javna, Kolekcija.naslovna_slika_putanja FROM Kolekcija, Korisnik_Kolekcija " +
        "WHERE Korisnik_Kolekcija.Korisnik_id = ? AND Korisnik_Kolekcija.Kolekcija_id = Kolekcija.kolekcija_id;"
        let podaci = (await this.baza.dajPodatke(sql, [korisnik_id])) as Array<KolekcijaI>;
        let rezultat = new Array<KolekcijaI>();
        
        for(let p of podaci)
        {
            let kolekcija : KolekcijaI =
            {
                kolekcija_id : p["kolekcija_id"],
                naziv : p["naziv"],
                javna : p["javna"],
                naslovna_slika_putanja : p["naslovna_slika_putanja"]
            };
            rezultat.push(kolekcija);
        }
        return rezultat;
        
    }

    async dodajKolekciju(kolekcija : KolekcijaI)
    {
        let pomocni_sql = "SELECT * FROM Kolekcija ORDER BY kolekcija_id DESC LIMIT 1";
        let zadnja_kolekcija = (await this.baza.izvrsiUpit(pomocni_sql)) as KolekcijaI;
        let zadnja_kolekcija_id : number;
        if(zadnja_kolekcija == null) 
            zadnja_kolekcija_id = 0;
        else
            zadnja_kolekcija_id = zadnja_kolekcija.kolekcija_id;

        kolekcija.kolekcija_id = zadnja_kolekcija_id + 1;
        let sql = "INSERT INTO Kolekcija VALUES(?,?,?,?);";
        let podaci = [kolekcija.kolekcija_id, kolekcija.naziv, kolekcija.javna, kolekcija.naslovna_slika_putanja];
        await this.baza.ubaciAzurirajPodatke(sql, podaci);
        return true;
    }   

    async azurirajKolekciju(kolekcija : KolekcijaI)
    {
        let sql = "UPDATE Kolekcija SET naziv=?, javna=?, naslovna_slika_putanja=? WHERE kolekcija_id=?;";
        let podaci = [kolekcija.naziv, kolekcija.javna, kolekcija.naslovna_slika_putanja, kolekcija.kolekcija_id];
        await this.baza.ubaciAzurirajPodatke(sql, podaci);
        return true;
    }

    async dodajKolekcijeKorisnicima(kolekcija_id : string, korisnici_id : Array<string>) : Promise<boolean>
    {
        await this.baza.ubaciAzurirajPodatke("DELETE FROM Korisnik_Kolekcija WHERE Kolekcija_id=?;", [kolekcija_id]);
        if(korisnici_id.length > 0)
        {
            let sql = "INSERT INTO Korisnik_Kolekcija  VALUES";
            let podaci = [];
            for (let kor of korisnici_id)
            {
                sql += `(?,?),`;
                podaci.push(kor, kolekcija_id);
            }
            sql = sql.substring(0, sql.length - 1);
            sql += ";";
            await this.baza.ubaciAzurirajPodatke(sql, podaci);
        }
        return true;
    }

    async dajJavneMultimedijeKolekcije(id_kolekcija : string) : Promise<Array<MultimedijskiSadrzajI>>
    {
        let sql = "SELECT m.* FROM Multimedijski_sadrzaj AS m JOIN Kolekcija_Multimedijski_sadrzaj AS km ON m.multimedijski_sadrzaj_id = km.Multimedijski_sadrzaj_id WHERE km.kolekcija_id = ? AND m.javni=1;";
        let podaci = (await this.baza.dajPodatke(sql, [id_kolekcija])) as Array<MultimedijskiSadrzajI>;
        let rezultat = new Array<MultimedijskiSadrzajI>();

        for (let p of podaci)
        {
            let mutlimedija : MultimedijskiSadrzajI =
            {
                multimedijski_sadrzaj_id : p["multimedijski_sadrzaj_id"],
                naziv : p["naziv"],
                putanja : p["putanja"],
                javni : p["javni"],
                autor : p["autor"],
                velicina : p["velicina"],
                datum : p["datum"],
                tip : p["tip"]
            };
            rezultat.push(mutlimedija);
        }
        return rezultat;
    }

    async dajMultimedijeKolekcije(id_kolekcija : string) : Promise<Array<MultimedijskiSadrzajI>>
    {
        let sql = "SELECT m.* FROM Multimedijski_sadrzaj AS m JOIN Kolekcija_Multimedijski_sadrzaj AS km ON m.multimedijski_sadrzaj_id = km.Multimedijski_sadrzaj_id WHERE km.kolekcija_id = ?;";
        let podaci = (await this.baza.dajPodatke(sql , [id_kolekcija])) as Array<MultimedijskiSadrzajI>;
        let rezultat = new Array<MultimedijskiSadrzajI>();

        for(let p of podaci)
        {
            let mutlimedija : MultimedijskiSadrzajI =
            {
                multimedijski_sadrzaj_id : p["multimedijski_sadrzaj_id"],
                naziv : p["naziv"],
                putanja : p["putanja"],
                javni : p["javni"],
                autor : p["autor"],
                velicina : p["velicina"],
                datum : p["datum"],
                tip : p["tip"]
            };
            rezultat.push(mutlimedija);
        }
        return rezultat;
    }
    
    async traziJavneMultimedije(pretraga : string) : Promise<Array<MultimedijskiSadrzajI>>
    {
        let sql = `SELECT * FROM Multimedijski_sadrzaj WHERE javni=1 AND naziv LIKE ?`;
        let podaci = (await this.baza.dajPodatke(sql, [`%${pretraga}%`])) as Array<MultimedijskiSadrzajI>;
        let rezultat = new Array<MultimedijskiSadrzajI>();

        for (let p of podaci)
        {
            let mutlimedija : MultimedijskiSadrzajI =
            {
                multimedijski_sadrzaj_id : p["multimedijski_sadrzaj_id"],
                naziv : p["naziv"],
                putanja : p["putanja"],
                javni : p["javni"],
                autor : p["autor"],
                velicina : p["velicina"],
                datum : p["datum"],
                tip : p["tip"]
            };
            rezultat.push(mutlimedija);
        }
        return rezultat;
    }
}