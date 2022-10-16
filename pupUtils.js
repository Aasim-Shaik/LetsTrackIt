const pup = require("puppeteer");



async function fetchPrice(url){

	//return new Promise((resolve,reject)=>{
	
	const browser = await pup.launch();
	const page = await browser.newPage();
	await page.goto(url);
			let price = await page.evaluate(() => {
	return document.querySelector("span.a-offscreen").innerHTML
	});
			//resolve(price);
	await browser.close();
	numPrice = Number((price.split('₹').join('')).split(',').join(''))
	return numPrice;
//});

}
module.exports = {fetchPrice};






