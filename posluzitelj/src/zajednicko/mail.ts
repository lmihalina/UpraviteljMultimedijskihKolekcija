import nodemailer from "nodemailer";

let mailer = nodemailer.createTransport(
{
	host: "smtp.gmail.com",
	port: 587,
	 auth: 
    {
		user: "lmihalina22@student.foi.hr",
        pass: "ngzfnyudfwvrlnzy"
    }
   //ngzf nyud fwvr lnzy 
});

export async function posaljiMail(salje : string, prima : string, predmet : string, poruka : string) 
{
	let message = 
    {
		from: salje,
		to: prima,
		subject: predmet,
		text: poruka,
	};

	let odgovor = await mailer.sendMail(message);
	//console.log(odgovor);
	return odgovor;
}
