import { KolekcijaI, KorisnikI, MojaSesija, MultimedijskiSadrzajI, UlogaI} from "../servisI/bazaI";
import {BazaDAO} from "./bazaDAO.js";
import {Request, Response} from "express";
import {kreirajSHA256, dajNasumceBroj} from "../zajednicko/kodovi.js";
import { posaljiMail } from "../zajednicko/mail.js";

export class BazaREST
{
    private bdao;
    constructor()
    {
        this.bdao = new BazaDAO();
    }
    
    private korisnikAutoriziran(zahtjev : Request, uloga : string)
    {
        let sesija = zahtjev.session as MojaSesija;
        if(sesija.korisnik == undefined || sesija.uloga != uloga)
            return false;
        return true;
    }

    getKorisnici(zahtjev : Request, odgovor :  Response)
    {
        odgovor.type("application/json");
        if(this.korisnikAutoriziran(zahtjev, "administrator"))
        {
            this.bdao.dajKorisnike().then( (korisnici : Array<KorisnikI>) =>
            {
                odgovor.send(JSON.stringify(korisnici));
            });
        }
        else if(this.korisnikAutoriziran(zahtjev, "moderator")) //change
        {
            this.bdao.dajKorisnike().then( (korisnici : Array<KorisnikI>) =>
            {
                let rezultat  = new Array<KorisnikI>();
                for(let k of korisnici)
                {
                    let privremeni : KorisnikI = 
                    {
                        korisnik_id : k["korisnik_id"],
                        ime : "¯\\_(ツ)_/¯",
                        prezime : "¯\\_(ツ)_/¯",
                        email : "¯\\_(ツ)_/¯",
                        korisnicko_ime : k["korisnicko_ime"],
                        lozinka : "¯\\_(ツ)_/¯",
                        pogresne_prijave : -999,
                        spol : "¯\\_(ツ)_/¯",
                        adresa : "¯\\_(ツ)_/¯",
                        telefon : "¯\\_(ツ)_/¯",
                        blokiran : -999,
                        datum_registracije : "¯\\_(ツ)_/¯",
                        uloga_id : -999,
                        aktiviran : -999,
                        aktivacijski_kod : -999
                    }
                    rezultat.push(privremeni);
                }
                odgovor.status(206);
                odgovor.send(JSON.stringify(rezultat));
            });
        }
        else
        {
            odgovor.status(401);
            odgovor.send({poruka : "Neautoriziran pristup!"});
        }
    }

    getKorisnik(zahtjev : Request, odgovor : Response)
    {
        let korisnik = zahtjev.params["korime"] ?? "";
        odgovor.type("application/json");
        this.bdao.dajKorisnika(korisnik).then( (korisnik : KorisnikI | null) =>
        {
            odgovor.send(JSON.stringify(korisnik));
        });
    }

    putKorisnik(zahtjev : Request, odgovor : Response)
    {
        odgovor.type("application/json");
        if(!this.korisnikAutoriziran(zahtjev, "administrator"))
        {
            odgovor.status(401);
            odgovor.send({poruka : "Neautoriziran pristup!"});
            return;
        }

        let azurirani_korisnik = zahtjev.body;
        this.bdao.dajKorisnikaPoID(azurirani_korisnik.korisnik_id.toString()).then((korisnik : KorisnikI | null)=>
        {
            if(korisnik == null)
            {
                odgovor.status(404);
                odgovor.send(JSON.stringify({poruka : "Korisnik ne postoji"}));
            }
            else
            {

                if (azurirani_korisnik.blokiran != undefined) 
                    korisnik.blokiran = azurirani_korisnik.blokiran;
                if(azurirani_korisnik.uloga_id != undefined)
                    korisnik.uloga_id = azurirani_korisnik.uloga_id;
                if(azurirani_korisnik.pogresne_prijave != undefined)
                    korisnik.pogresne_prijave = azurirani_korisnik.pogresne_prijave;

                this.bdao.azurirajKorisnika(korisnik).then((status : boolean)=>
                {
                    if(status)
                    {
                        odgovor.status(201);
                        odgovor.send(JSON.stringify({poruka : "Korisnik ažuriran"}));
                    }
                    else
                    {
                        odgovor.status(500);
                        odgovor.send(JSON.stringify({poruka : "Greška kod ažuriranja korisnika"}));
                    }
                    
                });
            }
        });
    }

    getKorisnikPoID(zahtjev : Request, odgovor : Response)
    {
        let korisnik = zahtjev.params["id"] ?? "";
        odgovor.type("application/json");
        this.bdao.dajKorisnikaPoID(korisnik).then((korisnik : KorisnikI | null) =>
        {
            odgovor.send(JSON.stringify(korisnik));
        });
    }

    getKorisnikPrijava (zahtjev : Request, odgovor : Response)
    {
        odgovor.type("application/json");
        let korime = zahtjev.params["korime"];
        if(korime == undefined)
        {
            odgovor.status(401);
            odgovor.send(JSON.stringify({ poruka: "Krivi podaci!" }));
            return;
        }
        
        this.bdao.dajKorisnika(korime).then((korisnik : KorisnikI | null)=>
        {
            let lozinka = kreirajSHA256(zahtjev.body.lozinka, "tajna sol lozinke"); //change
            if(korisnik != null)
            {
                if(korisnik.lozinka == lozinka && korisnik.blokiran == 0 && korisnik.aktiviran == 1)
                {
                    korisnik.pogresne_prijave = 0;
                    this.bdao.azurirajKorisnika(korisnik);
                    console.log("uspjesna prijava!!!!!");
                    korisnik.lozinka = "¯\\_(ツ)_/¯";
                    let sesija = zahtjev.session as MojaSesija;
                    sesija.korisnik = korisnik.ime + " " + korisnik.prezime;
                    sesija.korisnicko_ime = korisnik.korisnicko_ime;

                    this.bdao.dajUloguKorisnika(korisnik.uloga_id.toString()).then((uloga : UlogaI | null)=>
                    {
                        if (uloga != null)
                            sesija.uloga = uloga.naziv;
                        else
                            sesija.uloga = null;
                        console.log(sesija);
                        odgovor.send(JSON.stringify(korisnik));
                        console.log(korisnik);
                    }); 
                }
                else if(korisnik.blokiran == 1)
                {
                    odgovor.status(403);
                    odgovor.send(JSON.stringify({ poruka: "Korisnik blokiran. Obratite se administratoru." }));
                }
                else if(korisnik.aktiviran == 0)
                {
                    odgovor.status(403);
                    odgovor.send(JSON.stringify({ poruka: "Aktivirajte račun prije prijave!" }));
                }
                else
                {
                    console.log("kriva lozinka");
                    odgovor.status(401);
                    odgovor.send(JSON.stringify({ poruka : "Krivi podaci!" }));

                    korisnik.pogresne_prijave++;
                    if(korisnik.pogresne_prijave >= 3)
                        korisnik.blokiran = 1;
                    this.bdao.azurirajKorisnika(korisnik);
                }
            }
            else
            {
                console.log("kriva lozinka");
                odgovor.status(401);
				odgovor.send(JSON.stringify({ poruka : "Krivi podaci!" }));
            }
        });
        
    }

    getOdjava(zahtjev : Request, odgovor : Response)
    {
        let sesija = zahtjev.session as MojaSesija;
        sesija.korisnicko_ime = sesija.korisnik = sesija.uloga = null;
        zahtjev.session.destroy((greska) => {console.log("Odjavljen! Greska: " + greska);});
        odgovor.send(JSON.stringify({ poruka : "Uspješno ste odjavljeni" }));
    }

    getKorisnikLogiran(zahtjev : Request, odgovor : Response)
    {
        let sesija = zahtjev.session as MojaSesija;
        if(sesija.korisnicko_ime == null)
        {
            console.log("bazaREST : korisnik nije prijavljen");
            odgovor.status(401);
            odgovor.send({ poruka: "Neautoriziran pristup!" });
            return;
        }
        console.log("bazaREST : korisnik prijavljen");
        odgovor.send({ poruka: "Korisnik prijavljen" });
    }

    getModeratorLogiran(zahtjev : Request, odgovor : Response)
    {
        let sesija = zahtjev.session as MojaSesija;
        if(sesija.korisnicko_ime == null)
        {
            console.log("bazaREST : korisnik nije prijavljen");
            odgovor.status(401);
            odgovor.send({ poruka: "Neautoriziran pristup!" });
            return;
        }
        if(sesija.uloga != "administrator" && sesija.uloga != "moderator")
        {
            console.log("bazaREST : moderator nije prijavljen");
            odgovor.status(401);
            odgovor.send({ poruka: "Neautoriziran pristup!" });
            return;
        }
        console.log("bazaREST : moderator  prijavljen");
        odgovor.send({ poruka: "Korisnik prijavljen" });
    }

    getAdministratorLogiran(zahtjev : Request, odgovor : Response)
    {
        let sesija = zahtjev.session as MojaSesija;
        if(sesija.korisnicko_ime == null)
        {
            console.log("bazaREST : korisnik nije prijavljen");
            odgovor.status(401);
            odgovor.send({ poruka: "Neautoriziran pristup!" });
            return;
        }
        if(sesija.uloga != "administrator")
        {
            console.log("bazaREST : admin nije prijavljen");
            odgovor.status(401);
            odgovor.send({ poruka: "Neautoriziran pristup!" });
            return;
        }
        console.log("bazaREST : admin prijavljen");
        odgovor.send({ poruka: "Korisnik prijavljen" });
    }

    getUlogaKorisnika(zahtjev : Request , odgovor : Response)
    {
        let uloga = zahtjev.params["uloga_id"] ?? "";
        odgovor.type("application/json");
        this.bdao.dajUloguKorisnika(uloga).then((uloga : UlogaI | null) =>
        {
            odgovor.send(JSON.stringify(uloga));
        });
    }

    getJavneKolekcije(zahtjev : Request, odgovor : Response)
    {
        odgovor.type("application/json");
        this.bdao.dajJavneKolekcije().then((kolekcije : Array<KolekcijaI>) =>
        {
            odgovor.send(JSON.stringify(kolekcije));
        })
    }

    getKolekcije(zahtjev : Request, odgovor :Response)
    {
        odgovor.type("application/json");
        if(!this.korisnikAutoriziran(zahtjev, "moderator") && !this.korisnikAutoriziran(zahtjev, "administrator") )
        {
            odgovor.status(401);
            odgovor.send({poruka : "Neautoriziran pristup!"});
            return;
        }
        
        this.bdao.dajKolekcije().then((kolekcije : Array<KolekcijaI>) =>
        {
            odgovor.send(JSON.stringify(kolekcije));
        });
    }

    getKolekcijeKorisnika(zahtjev : Request, odgovor : Response)
    {
        odgovor.type("application/json");
        if(!this.korisnikAutoriziran(zahtjev, "moderator") && !this.korisnikAutoriziran(zahtjev, "administrator") && !this.korisnikAutoriziran(zahtjev, "registrirani korisnik"))
        {
            odgovor.status(401);
            odgovor.send({poruka : "Neautoriziran pristup!"});
            return;
        }

        let sesija = zahtjev.session as MojaSesija;
        if(sesija.korisnicko_ime != null)
        {
            this.bdao.dajKolekcijeKorisnika(sesija.korisnicko_ime).then( (kolekcije : Array<KolekcijaI>) =>
            {
                odgovor.send(JSON.stringify(kolekcije));
            });
        }
        else
        {
            odgovor.status(401);
            odgovor.send(JSON.stringify({poruka : "Morate se prijaviti"}));
        }
    }

    postKorisnici(zahtjev : Request, odgovor :Response)
    {
		odgovor.type("application/json");
        let podaci = zahtjev.body as KorisnikI;
        console.log(podaci);
        if( zahtjev.body.korisnicko_ime == undefined || zahtjev.body.korisnicko_ime == ""
            || zahtjev.body.lozinka == undefined || zahtjev.body.lozinka== ""
            || zahtjev.body.email == undefined || zahtjev.body.email == "")
        {
            odgovor.status(417);
            odgovor.json({poruka : "Morate unijeti korisničko ime, lozinku i e-mail adresu!"});
        }
        else
        {
            this.bdao.dajKorisnika(zahtjev.body.korisnicko_ime).then((korisnik : KorisnikI | null)=>
            {
                if (korisnik == null)
                { 
                    podaci.lozinka = kreirajSHA256(podaci.lozinka, "tajna sol lozinke");
                    podaci.aktivacijski_kod = dajNasumceBroj(10_000 , 99_999);
                    
                    let mailPoruka = `aktivacijski kod : ${podaci.aktivacijski_kod}, \n` +
                        `http://localhost:12222/api/aktivacija?korime=${podaci.korisnicko_ime}&kod=${podaci.aktivacijski_kod}`;
                    posaljiMail("lmihalina22@student.foi.hr", podaci.email, "Aktivacijski kod", mailPoruka);

                    this.bdao.dodajKorisnika(podaci).then((status : boolean)=>
                    {
                        odgovor.send(JSON.stringify(status));
                    });
                }
                else
                {
                    odgovor.status(417);
				    odgovor.json({ poruka: "Korisničko ime zauzeto!" });
                }
            });
        }
    }

    postKolekcija(zahtjev : Request, odgovor : Response)
    {
        odgovor.type("application/json");
        if(!this.korisnikAutoriziran(zahtjev, "moderator") && !this.korisnikAutoriziran(zahtjev, "administrator") )
        {
            odgovor.status(401);
            odgovor.send({poruka : "Neautoriziran pristup!"});
            return;
        }

        let kolekcija = zahtjev.body as KolekcijaI;
        this.bdao.dodajKolekciju(kolekcija).then((uspjeh : boolean)=>
        {
            if(uspjeh)
            {
                odgovor.status(201);
                odgovor.send({poruka : "Kolekcija uspješno dodana"});
            }
            else
            {
                odgovor.status(500);
                odgovor.send({poruka : "Dogodila se greska kod dodavanja kolekcije"});
            }
        });
    }

    putKolekcija(zahtjev : Request, odgovor : Response)
    {
        odgovor.type("application/json");
        if(!this.korisnikAutoriziran(zahtjev, "moderator") && !this.korisnikAutoriziran(zahtjev, "administrator") && !this.korisnikAutoriziran(zahtjev, "registrirani korisnik"))
        {
            odgovor.status(401);
            odgovor.send({poruka : "Neautoriziran pristup!"});
            return;
        }

        let azuriranaKolekcija = zahtjev.body;
        this.bdao.dajKolekciju(azuriranaKolekcija.kolekcija_id.toString()).then((kolekcija : KolekcijaI | null)=>
        {
            if(kolekcija == null)
            {
                odgovor.status(404);
                odgovor.send(JSON.stringify({poruka : "Kolekcija ne postoji"}));
            }
            else
            {
                if(azuriranaKolekcija.naslovna_slika_putanja != undefined && azuriranaKolekcija.naslovna_slika_putanja != "")
                    kolekcija.naslovna_slika_putanja = azuriranaKolekcija.naslovna_slika_putanja;
                if(azuriranaKolekcija.javna != undefined)
                    kolekcija.javna = azuriranaKolekcija.javna;
                if(azuriranaKolekcija.naziv != undefined && azuriranaKolekcija.naziv != '')
                    kolekcija.naziv=azuriranaKolekcija.naziv;

                this.bdao.azurirajKolekciju(kolekcija).then((status : Boolean)=>
                {
                    if(status)
                    {
                        odgovor.status(201);
                        odgovor.send({poruka : "Kolekcija uspješno ažurirana"});
                    }
                    else
                    {
                        odgovor.status(500)
                        odgovor.send({poruka : "Greška kod upisa u bazu"});
                    }
                });
            }
        });
    }

    getMultimedijeKolekcije(zahtjev : Request, odgovor : Response)
    {
        odgovor.type("application/json");
        if(!this.korisnikAutoriziran(zahtjev, "moderator") && !this.korisnikAutoriziran(zahtjev, "administrator") && !this.korisnikAutoriziran(zahtjev, "registrirani korisnik"))
        {
            odgovor.status(401);
            odgovor.send({poruka : "Neautoriziran pristup!"});
            return;
        }

        let kolekcija_id = zahtjev.params["kolekcija_id"];
        if(kolekcija_id == null)
        {
            odgovor.status(417);
            odgovor.send({poruka : "Nepotpuni podaci"});
            return;
        }

        this.bdao.dajMultimedijeKolekcije(kolekcija_id).then((sadrzaji : Array<MultimedijskiSadrzajI>) =>
        {
            odgovor.send(JSON.stringify(sadrzaji));
        });
    }

    getJavneMultimedijeKolekcije(zahtjev : Request, odgovor : Response)
    {
        odgovor.type("application/json");
        let kolekcija_id = zahtjev.params["kolekcija_id"];

         if(kolekcija_id == null)
        {
            odgovor.status(417);
            odgovor.send({poruka : "Nepotpuni podaci"});
            return;
        }

        this.bdao.dajJavneMultimedijeKolekcije(kolekcija_id).then((sadrzaji : Array<MultimedijskiSadrzajI>)=>
        {
            odgovor.send(JSON.stringify(sadrzaji));
        });
    }

    postKorisniciKolekcije(zahtjev : Request, odgovor : Response)
    {
        odgovor.type("application/json");
        if(!this.korisnikAutoriziran(zahtjev, "moderator") && !this.korisnikAutoriziran(zahtjev, "administrator") )
        {
            odgovor.status(401);
            odgovor.send({poruka : "Neautoriziran pristup!"});
            return;
        }

        if(zahtjev.body.kolekcija_id == undefined || zahtjev.body.korisnici_id == null)
        {
            odgovor.status(417);
            odgovor.send({poruka : "Nepotpuni podaci"});
            return;
        }
        this.bdao.dodajKolekcijeKorisnicima(zahtjev.body.kolekcija_id, zahtjev.body.korisnici_id).then((status : boolean)=>
        {
            if(status)
            {
                odgovor.send({poruka : "Dodjela korisnika uspješna"});
            }
            else
            {
                odgovor.status(500);
                odgovor.send({poruka : "Dodjela korisnika neuspješna"});
            }
        });
    }

    getAktivacijaKorisnika(zahtjev : Request, odgovor : Response)
    {
        odgovor.type("application/json");
        let korime = zahtjev.query["korime"];
        let kod = zahtjev.query["kod"];

        if(korime == undefined || korime == "" || typeof(korime) != "string" 
            || kod == undefined || kod == "" || typeof(kod) != "string")
        {
            odgovor.status(417);
            odgovor.send({poruka : "Nepotpuni ili neočekivani podaci"});
            return;
        }

        this.bdao.dajKorisnika(korime).then( (korisnik : KorisnikI | null) => 
        {
            if(korisnik != null && parseInt(kod) == korisnik.aktivacijski_kod)
            {
                korisnik.aktiviran = 1;
                this.bdao.azurirajKorisnika(korisnik).then((status : boolean)=>
                {
                    if(status)
                    {
                        odgovor.status(201);
                        odgovor.send(JSON.stringify({poruka : "Korisnički račun aktiviran"}));
                    }
                    else
                    {
                        odgovor.status(500);
                        odgovor.send(JSON.stringify({poruka : "Greška kod ažuriranja korisnika"}));
                    }
                    
                });
            }
            else
            {
                odgovor.status(417);
                odgovor.send(JSON.stringify({poruka : "Aktivacija neuspjela zbog pogrešnih podataka"}));   
            }
        })
    }

    getTrazeneJavneMultimedije(zahtjev : Request, odgovor : Response)
    {
        odgovor.type("application/json");
        if(!this.korisnikAutoriziran(zahtjev, "moderator") && !this.korisnikAutoriziran(zahtjev, "administrator") && !this.korisnikAutoriziran(zahtjev, "registrirani korisnik"))
        {
            odgovor.status(401);
            odgovor.send({poruka : "Neautoriziran pristup!"});
            return;
        }

        let trazi = zahtjev.query["trazi"];

        if(trazi == undefined || trazi == '' || typeof(trazi) != "string")
        {
            odgovor.status(417);
            odgovor.send({poruka : "Nepotpuni ili neočekivani podaci"});
        }
        else
        {
            this.bdao.traziJavneMultimedije(trazi).then( (podaci : Array<MultimedijskiSadrzajI>) => 
            {
                odgovor.send(JSON.stringify(podaci));
            })
        }
    }
}
