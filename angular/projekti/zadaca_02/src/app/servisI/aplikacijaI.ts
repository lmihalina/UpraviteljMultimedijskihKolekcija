export interface KolekcijaI
{
    kolekcija_id : number,
    naziv : string,
    javna : number,
    naslovna_slika_putanja : string | null
}

export interface MultimedijskiSadrzajI
{
    multimedijski_sadrzaj_id : number,
    naziv : string,
    putanja : string,
    javni : number,
    autor : string | null,
    velicina : number | null,
    datum : string | null,
    tip : string  | null
}

export interface KorisnikI
{
    korisnik_id : number,
    ime : string | null,
    prezime : string |  null,
    email : string,
    korisnicko_ime : string,
    lozinka : string,
    pogresne_prijave : number,
    spol : string |  null,
    adresa : string | null,
    telefon : string | null,
    blokiran : number,
    datum_registracije : string,
    uloga_id : number,
    aktiviran : number,
    aktivacijski_kod : number
}