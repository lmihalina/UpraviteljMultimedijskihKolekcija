-- Creator:       MySQL Workbench 8.0.36/ExportSQLite Plugin 0.1.0
-- Author:        Unpredictable
-- Caption:       New Model
-- Project:       Name of the project
-- Changed:       2025-12-01 13:04
-- Created:       2025-11-02 21:45

BEGIN;
CREATE TABLE "Uloga"(
  "id_uloga" INTEGER PRIMARY KEY NOT NULL,
  "naziv" VARCHAR(45) NOT NULL,
  "opis" VARCHAR(255) NOT NULL,
  CONSTRAINT "id_uloga_UNIQUE"
    UNIQUE("id_uloga")
);
CREATE TABLE "Kolekcija"(
  "kolekcija_id" INTEGER PRIMARY KEY NOT NULL,
  "naziv" VARCHAR(45) NOT NULL,
  "javna" INTEGER NOT NULL,
  "naslovna_slika_putanja" VARCHAR(255),
  CONSTRAINT "kolekcija_id_UNIQUE"
    UNIQUE("kolekcija_id"),
  CONSTRAINT "naslovna_slika_putanja_UNIQUE"
    UNIQUE("naslovna_slika_putanja")
);
CREATE TABLE "Multimedijski_sadrzaj"(
  "multimedijski_sadrzaj_id" INTEGER PRIMARY KEY NOT NULL,
  "naziv" VARCHAR(100) NOT NULL,
  "putanja" VARCHAR(255) NOT NULL,
  "javni" INTEGER NOT NULL,
  "autor" VARCHAR(45),
  "velicina" INTEGER,
  "datum" DATETIME,
  "tip" VARCHAR(45),
  CONSTRAINT "putanja_UNIQUE"
    UNIQUE("putanja"),
  CONSTRAINT "multimedijski_sadrzaj_id_UNIQUE"
    UNIQUE("multimedijski_sadrzaj_id")
);
CREATE TABLE "Kolekcija_Multimedijski_sadrzaj"(
  "Kolekcija_id" INTEGER NOT NULL,
  "Multimedijski_sadrzaj_id" INTEGER NOT NULL,
  PRIMARY KEY("Kolekcija_id","Multimedijski_sadrzaj_id"),
  CONSTRAINT "fk_Kolekcija_has_Multimedijski_sadrzaj_Kolekcija1"
    FOREIGN KEY("Kolekcija_id")
    REFERENCES "Kolekcija"("kolekcija_id"),
  CONSTRAINT "fk_Kolekcija_has_Multimedijski_sadrzaj_Multimedijski_sadrzaj1"
    FOREIGN KEY("Multimedijski_sadrzaj_id")
    REFERENCES "Multimedijski_sadrzaj"("multimedijski_sadrzaj_id")
);
CREATE INDEX "Kolekcija_Multimedijski_sadrzaj.fk_Kolekcija_has_Multimedijski_sadrzaj_Multimedijski_sadrza_idx" ON "Kolekcija_Multimedijski_sadrzaj" ("Multimedijski_sadrzaj_id");
CREATE INDEX "Kolekcija_Multimedijski_sadrzaj.fk_Kolekcija_has_Multimedijski_sadrzaj_Kolekcija1_idx" ON "Kolekcija_Multimedijski_sadrzaj" ("Kolekcija_id");
CREATE TABLE "Korisnik"(
  "korisnik_id" INTEGER PRIMARY KEY NOT NULL,
  "ime" VARCHAR(45),
  "prezime" VARCHAR(45),
  "email" VARCHAR(45) NOT NULL,
  "korisnicko_ime" VARCHAR(45) NOT NULL,
  "lozinka" VARCHAR(255) NOT NULL,
  "pogresne_prijave" INTEGER NOT NULL,
  "spol" VARCHAR(15),
  "adresa" VARCHAR(100),
  "telefon" VARCHAR(15),
  "blokiran" INTEGER NOT NULL,
  "datum_registracije" DATETIME NOT NULL,
  "uloga_id" INTEGER NOT NULL,
  CONSTRAINT "id_korisnik_UNIQUE"
    UNIQUE("korisnik_id"),
  CONSTRAINT "fk_korisnik_Uloge"
    FOREIGN KEY("uloga_id")
    REFERENCES "Uloga"("id_uloga")
);
CREATE INDEX "Korisnik.fk_korisnik_Uloge_idx" ON "Korisnik" ("uloga_id");
CREATE TABLE "Korisnik_Kolekcija"(
  "Korisnik_id" INTEGER NOT NULL,
  "Kolekcija_id" INTEGER NOT NULL,
  PRIMARY KEY("Korisnik_id","Kolekcija_id"),
  CONSTRAINT "fk_Korisnik_has_Kolekcija_Korisnik1"
    FOREIGN KEY("Korisnik_id")
    REFERENCES "Korisnik"("korisnik_id"),
  CONSTRAINT "fk_Korisnik_has_Kolekcija_Kolekcija1"
    FOREIGN KEY("Kolekcija_id")
    REFERENCES "Kolekcija"("kolekcija_id")
);
CREATE INDEX "Korisnik_Kolekcija.fk_Korisnik_has_Kolekcija_Kolekcija1_idx" ON "Korisnik_Kolekcija" ("Kolekcija_id");
CREATE INDEX "Korisnik_Kolekcija.fk_Korisnik_has_Kolekcija_Korisnik1_idx" ON "Korisnik_Kolekcija" ("Korisnik_id");
COMMIT;

INSERT INTO Uloga(id_uloga, naziv, opis) VALUES 
(1, 'registrirani korisnik', 'obican korisnik'),
(2, 'moderator', 'korisnik koji moze sve sto i obican te upravljati web aplikacijom'),
(3, 'administrator', 'korisnik koji moze sve sto i moderator te upravljati postojecim korisnicima');

INSERT INTO Korisnik(korisnik_id, ime, prezime, email, korisnicko_ime, lozinka, pogresne_prijave,spol, adresa, telefon, blokiran, datum_registracije, uloga_id) VALUES
(1, 'Marko', 'Markić', 'mmarkic@foi.hr', 'obican', 'rwa', 0, 'M' , 'Varazdinska 15', '095-666-4444', FALSE, CURRENT_TIMESTAMP, 1 ),
(2, 'Darko', 'Darkić', 'ddarkic@foi.hr', 'moderator', 'rwa', 0, 'M' , 'Varazdinska 25', '095-555-3333', FALSE, CURRENT_TIMESTAMP, 2 ),
(3, 'Žarko', 'Žarkić', 'zzarkic@foi.hr', 'admin', 'rwa', 0, 'M' , 'Varazdinska 35', '095-222-1111', FALSE, CURRENT_TIMESTAMP, 3 );

UPDATE Korisnik SET lozinka = '80352ff1a1242f8dd138bb33ba3c7faadb67e56fa122aeaf539efeea7082e374';
DELETE FROM Korisnik where Korisnik_id = 4 or Korisnik_id = 5;

INSERT INTO Kolekcija VALUES
(1, 'Western', TRUE, '1' ),
(2, 'Horor', FALSE, '2' ),
(3, 'Akcija', FALSE, '3' ),
(4, 'Misterij', TRUE, '4' );

UPDATE Kolekcija SET  
naslovna_slika_putanja = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2//ooqASvA7qxlTVKL3KwOzBwy57Dh.jpg' WHERE kolekcija_id = 1;
UPDATE Kolekcija SET 
naslovna_slika_putanja = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2//6K0wjP8kPCiPYy9PtXBGuypyt5I.jpg' WHERE kolekcija_id = 2;
UPDATE Kolekcija SET   
naslovna_slika_putanja = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2//M7SUK85sKjaStg4TKhlAVyGlz3.jpg' WHERE kolekcija_id = 3;
UPDATE Kolekcija SET   
naslovna_slika_putanja = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2//p9ZUzCyy9wRTDuuQexkQ78R2BgF.jpg' WHERE kolekcija_id = 4; 

INSERT INTO Korisnik_Kolekcija VALUES
(1, 2),
(1,3);

SELECT Kolekcija.kolekcija_id, Kolekcija.naziv, Kolekcija.javna, Kolekcija.naslovna_slika_putanja FROM Kolekcija, Korisnik_Kolekcija
            WHERE Korisnik_Kolekcija.Korisnik_id = 1 AND Korisnik_Kolekcija.Kolekcija_id = Kolekcija.kolekcija_id;

            SELECT Kolekcija.kolekcija_id, Kolekcija.naziv, Kolekcija.javna, Kolekcija.naslovna_slika_putanja FROM Kolekcija, Korisnik_Kolekcija WHERE Korisnik_Kolekcija.Korisnik_id = 1 AND Korisnik_Kolekcija.Kolekcija_id = Kolekcija.kolekcija_id;

delete from korisnik where korisnik_id > 5;
delete from kolekcija where kolekcija_id = 5;

INSERT INTO Multimedijski_sadrzaj(multimedijski_sadrzaj_id, naziv, putanja, javni, tip) VALUES
(1, 'Fistful of dollars - slika', 'https://image.tmdb.org/t/p/w500/lBwOEpwVeUAmrmglcstnaGcJq3Y.jpg', 1, 'slika'),
(2, 'Fistful of dollars - video', 'https://www.youtube.com/embed/f_oZUWAdEe8', 1 , 'video' ),
(3, 'For a few dollars more - slika', 'https://image.tmdb.org/t/p/w500/ooqASvA7qxlTVKL3KwOzBwy57Dh.jpg', 0, 'slika'),
(4, 'For a few dollars more - video', 'https://www.youtube.com/embed/xZm8i5sGlWI', 0, 'video'),
(5, 'The Beekeeper - slika', 'https://image.tmdb.org/t/p/w500/A7EByudX0eOzlkQ2FIbogzyazm2.jpg', 1, 'slika');


INSERT INTO Kolekcija_Multimedijski_sadrzaj VALUES 
(1,1), (1,2), (1,3), (1,4), (3,5);

SELECT m.* FROM Multimedijski_sadrzaj AS m JOIN Kolekcija_Multimedijski_sadrzaj as km ON m.multimedijski_sadrzaj_id = km.Multimedijski_sadrzaj_id WHERE km.kolekcija_id = 1;
SELECT m.* FROM Multimedijski_sadrzaj AS m JOIN Kolekcija_Multimedijski_sadrzaj AS km ON m.multimedijski_sadrzaj_id = km.Multimedijski_sadrzaj_id WHERE km.kolekcija_id = 1 AND m.javni=1;

ALTER TABLE Korisnik ADD COLUMN aktiviran INTEGER NOT NULL DEFAULT 0;
UPDATE Korisnik SET aktiviran = 1 WHERE korisnik_id < 4;

ALTER TABLE Korisnik ADD COLUMN aktivacijski_kod INTEGER;

UPDATE Multimedijski_sadrzaj SET datum = DATETIME('now') WHERE multimedijski_sadrzaj_id=5;
UPDATE Multimedijski_sadrzaj SET autor = 'moderator' WHERE multimedijski_sadrzaj_id=5;
UPDATE Multimedijski_sadrzaj SET velicina = 100 WHERE tip = 'video';

INSERT INTO Multimedijski_sadrzaj VALUES
(6, 'The Good, the Bad and the Ugly', 'https://image.tmdb.org/t/p/w500/bX2xnavhMYjWDoZp1VM6VnU1xwe.jpg', 1, 'admin', 1, DATETIME('now'), 'slika'),
(7, 'The Autopsy of Jane Doe', 'https://image.tmdb.org/t/p/w500/6K0wjP8kPCiPYy9PtXBGuypyt5I.jpg', 1, 'moderator', 1, DATETIME('now'), 'slika'),
(8, 'Annabelle', 'https://image.tmdb.org/t/p/w500/yLsuU2P2SpDYFwtZQ7dtfVAf6TE.jpg', 0, 'admin', 1, DATETIME('now'), 'slika'),
(9, 'Nobody', 'https://image.tmdb.org/t/p/w500/oBgWY00bEFeZ9N25wWVyuQddbAo.jpg', 1, 'admin', 1, DATETIME('now'), 'slika'),
(10, 'The Black Phone', 'https://image.tmdb.org/t/p/w500/p9ZUzCyy9wRTDuuQexkQ78R2BgF.jpg', 1, 'moderator', 1, DATETIME('now'), 'slika'),
(11, 'El Camino: A Breaking Bad Movie', 'https://image.tmdb.org/t/p/w500/ePXuKdXZuJx8hHMNr2yM4jY2L7Z.jpg', 1, 'admin', 1, DATETIME('now'), 'slika'),
(12, 'Ambulance', 'https://image.tmdb.org/t/p/w500/hUbgg3mMSbY9PlpTxBo4IFUVSd6.jpg', 0, 'admin', 1, DATETIME('now'), 'slika');

INSERT INTO Kolekcija_Multimedijski_sadrzaj VALUES
(1, 6),
(2, 7),
(2,8),
(2,10),
(3,9),
(3,12),
(4,10),
(5,11),
(5,12);

INSERT INTO Multimedijski_sadrzaj VALUES
(13, 'The Good, the Bad and the Ugly - trailer','https://www.youtube.com/embed/WCnRSl24FPA', 0, 'admin', 100, DATETIME('now'), 'video'),
(14, 'The Autopsy of Jane Doe - trailer', 'https://www.youtube.com/embed/BNxsaFCzqxc', 1, 'inspektor', 100, DATETIME('now'), 'video' ),
(15, 'Annabelle - trailer', 'https://www.youtube.com/embed/xabuZwG3XyM', 0, 'inspektor', 100, DATETIME('now'), 'video'),
(16, 'Nobody - trailer', 'https://www.youtube.com/embed/wZti8QKBWPo', 1, 'moderator', 100, DATETIME('now'), 'video' ),
(17, 'The Black Phone - trailer', 'https://www.youtube.com/embed/nQWAVkx8O74' , 1, 'admin', 100, DATETIME('now'), 'video'),
(18, 'El Camino: A Breaking Bad Movie - trailer', 'https://www.youtube.com/embed/rklOejPnD3Y', 0, 'inspektor', 200, DATETIME('now'), 'video' ),
(19, 'Ambulance - trailer', 'https://www.youtube.com/embed/tFWOyZNHjX8', 0, 'obican', 250, DATETIME('now'), 'video' );

INSERT INTO Kolekcija_Multimedijski_sadrzaj VALUES
(1, 13),
(2,14),
(2,15),
(3,16),
(2,17),
(4,17),
(5,18),
(3,19),
(5,19),
(5,16);