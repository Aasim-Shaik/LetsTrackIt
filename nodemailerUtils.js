const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

async function send(addr , subjectMail , textMail){
let transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user:process.env.USR,
		pass: process.env.PASS
	}

})

let mailOptions = {
	from: "",
	to: addr ,
	subject: subjectMail ,
	text: textMail
}

transporter.sendMail(mailOptions, function(err,success){
	if(err){
		console.log(err)
	}
	else{
		console.log("Email sent to address "+addr);
	}
});
}

module.exports = {send};