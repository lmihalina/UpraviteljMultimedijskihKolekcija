import express, {Application} from 'express';
import cors from "cors";
import sesija from "express-session";
import kolacici from "cookie-parser";
import {dajPort,__dirname, __filename} from "./zajednicko/esmPomocnik.js";
import {Konfiguracija} from "./zajednicko/konfiguracija.js"
import { TMDBklijent } from './servis/TMDBklijent.js';
import { TMDBrest } from './servis/TMDBrest.js';
//import { pripremiPutanjeWebAplikacije } from './aplikacija/aplikacija.js';
import {BazaREST} from "./servis/bazaREST.js"

main(process.argv);

async function main(argv : Array<string>)
{
    let port = dajPort("lmihalina22");
    if (argv[3] != undefined) 
		port =  parseInt(argv[3]);

    let konf : Konfiguracija = new Konfiguracija
    try
    {
         await konf.ucitajKonfiguraciju();
    }
	catch(greska : Error | any)
    {
        if (process.argv.length == 2)
			console.error("Potrebno je dati naziv datoteke");
        else if (greska.path != undefined)
			console.error("Nije moguće otvoriti datoteku: " + greska.path);
        else console.log(greska.message);
		process.exit();
    }
    //console.log(konf);
    //console.log(port);
    //console.log(argv[2]);

    let server : Application = express();
    inicijalizirajPostavkeServera(server, konf);
    //pripremiPutanjeWebAplikacije(server, port);
    pripremiPutanjeServera(server, konf);
    pokreniServer(server, port)
}

function inicijalizirajPostavkeServera( server: Application, konf: Konfiguracija) 
{
	server.use(express.json());
	server.use(express.urlencoded({ extended: true }));
	server.use(
		cors({
			origin: (origin, povratniPoziv) => 
            {
				if (!origin || origin.startsWith("http://spider.foi.hr:") || origin.startsWith("http://localhost:")) 
                    povratniPoziv(null, true); 
                else 
					povratniPoziv(new Error("Nije dozvoljeno zbog CORS"));	
			},
			optionsSuccessStatus: 200,
		})
	);

	server.use(kolacici());
	server.use(sesija(
    {
        secret: konf.dajKonf().tajniKljucSesija,
        saveUninitialized: true,
        cookie: { maxAge: 1000 * 60 * 60 * 3 },
        resave: false,
    })
	);
}

function pripremiPutanjeServera(server : Application, konf : Konfiguracija)
{
    
    let restTMDB = new TMDBrest(konf.dajKonf().tmdbApiKeyV3);
    server.get("/api/filmovi", restTMDB.getFilmovi.bind(restTMDB)); 
    server.get("/api/film/video", restTMDB.getLinkVidea.bind(restTMDB));

    server.get("/tmdb", (zahtjev, odgovor)=>
    {
        
        let tmdb : TMDBklijent = new TMDBklijent(konf.dajKonf().tmdbApiKeyV3);
        tmdb.dohvatiFilmovePoNazivu("dollars", 1).then((podaci : any)=>{odgovor.send(podaci)});
        //tmdb.dohvatiSveFilmove().then((podaci : any)=>{odgovor.send(podaci)});
    });  //testiranje servisa, nije dio predane aplikacije

    let restBaza = new BazaREST();
    server.get("/api/korisnici", restBaza.getKorisnici.bind(restBaza));
    server.post("/api/korisnici", restBaza.postKorisnici.bind(restBaza));
    server.put("/api/korisnik",restBaza.putKorisnik.bind(restBaza));
    server.get("/api/korisnik/:korime", restBaza.getKorisnik.bind(restBaza));
    //server.get("/api/korisnik/:id" , restBaza.getKorisnikPoID.bind(restBaza));
    server.get("/api/uloga/:uloga_id", restBaza.getUlogaKorisnika.bind(restBaza));
    server.post("/api/korisnici/prijava/:korime", restBaza.getKorisnikPrijava.bind(restBaza));
    server.get("/api/odjava", restBaza.getOdjava.bind(restBaza));
    server.get("/api/aktivacija", restBaza.getAktivacijaKorisnika.bind(restBaza));

    //server.get("/api/korisnici/prijavljen/korisnik", restBaza.getKorisnikLogiran.bind(restBaza));
    //server.get("/api/korisnici/prijavljen/moderator", restBaza.getModeratorLogiran.bind(restBaza));
    //server.get("/api/korisnici/prijavljen/administrator", restBaza.getAdministratorLogiran.bind(restBaza));

    server.get("/api/javneKolekcije", restBaza.getJavneKolekcije.bind(restBaza));  //radi
    server.get("/api/kolekcije", restBaza.getKolekcije.bind(restBaza));
    server.post("/api/kolekcije", restBaza.postKolekcija.bind(restBaza));
    server.put("/api/kolekcije", restBaza.putKolekcija.bind(restBaza));
    server.get("/api/privatneKolekcije", restBaza.getKolekcijeKorisnika.bind(restBaza));

    server.get("/api/sadrzaji/:kolekcija_id", restBaza.getMultimedijeKolekcije.bind(restBaza));
    server.get("/api/javniSadrzaji/pretraga" , restBaza.getTrazeneJavneMultimedije.bind(restBaza));
    server.get("/api/javniSadrzaji/:kolekcija_id", restBaza.getJavneMultimedijeKolekcije.bind(restBaza));
    server.post("/api/korisniciKolekcije", restBaza.postKorisniciKolekcije.bind(restBaza));
    

    server.use("/", express.static("./angular"));
    let angularPutanje = ["/prijava", "/javneKolekcije", "/privatneKolekcije", "/kolekcije", "/korisnici", "/filmovi","/registracija", "/dokumentacija", "/odjava"];

    angularPutanje.forEach( (putanja) =>
    {
        server.get(putanja , (zahtjev, odgovor) => 
        {
            odgovor.sendFile("index.html", { root : "./angular"});
        });
    });
  
    server.use((zahtjev, odgovor) => 
    {
		odgovor.status(404);
		let poruka = { greska: "Nepostojeći resurs" };
		odgovor.send(JSON.stringify(poruka));
	});
}

function pokreniServer(server : Application, port : number)
{
    server.listen(port, ()=>
    {
        //console.log(__dirname());
        //console.log(__filename());
        //console.log(process.cwd());
        console.log(`Server pokrenut na portu: ${port}`);
    });
}












//film sve
//https://api.themoviedb.org/3/discover/movie?api_key=<TVOJ_API_KLJUC>&sort_by=popularity.desc&page=1

//film search
//https://api.themoviedb.org/3/search/movie?api_key=<TVOJ_API_KLJUC>&query=<TVOJ_UPIT>&page=1&include_adult=false

//film link do videa
//https://api.themoviedb.org/3/movie/{movie_id}/videos?api_key=<TVOJ_API_KLJUC>

//serije sve
//https://api.themoviedb.org/3/discover/tv?api_key=<TVOJ_API_KLJUC>&sort_by=popularity.desc&page=1

//serije search
//https://api.themoviedb.org/3/search/tv?api_key=<TVOJ_API_KLJUC>&query=<TVOJ_UPIT>&page=1

//serije link do videa
//https://api.themoviedb.org/3/tv/{tv_id}/videos?api_key=<TVOJ_API_KLJUC> , atribut key

//slika
//https://image.tmdb.org/t/p/w500/<poster_path>


