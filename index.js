const cron = require('node-cron');
const dotenv = require('dotenv');
const pup = require('./pupUtils');
const dateTime = require("./DateTime");
const mailer = require("./nodemailerUtils");
const sqliteUtils = require('./sqliteUtils');

dotenv.config();

let tbName = process.env.TABLE1;
let dbName = process.env.DB;

sqliteUtils.makeConn(dbName);

async function perform(){

		let num = await sqliteUtils.getRowCount(tbName);


	if(num > 0){
			let r = await sqliteUtils.getRowIdList(tbName);

		for(j = 0 ; j<num ; j++){

			let i = r[j].uid;

			let usrEmail = await sqliteUtils.getEmail(i,tbName);
			
			let url = await sqliteUtils.getUrl(i,tbName);	
		
			let remaining = await sqliteUtils.getRemaining(i,tbName);
		
			let price = await pup.fetchPrice(url);
			
			sqliteUtils.updatePrice(i,tbName,price);
			
			let hPrice = await sqliteUtils.getHighPrice(i,tbName);
		
			let cPrice = await sqliteUtils.getCheapPrice(i,tbName);

			if(hPrice  == null)
							await sqliteUtils.updateHighPrice(i,tbName,price);
							
			if( hPrice != null && price > hPrice )
				await sqliteUtils.updateHighPrice(i,tbName,price);

			if(cPrice == null)
				await sqliteUtils.updateCheapPrice(i,tbName,price);
			if(cPrice != null && price<cPrice)
				await sqliteUtils.updateCheapPrice(i,tbName,price);

			hPrice = await sqliteUtils.getHighPrice(i,tbName);
		
			cPrice = await sqliteUtils.getCheapPrice(i,tbName);

			await mailer.send(usrEmail , 'Your Amazon.in product price update' , 'Product URL : '+url+'\n The current price of your product is ₹'+price+'\nThe highest price of your procuct is ₹'+hPrice+' and cheapest price is ₹'+cPrice);

			await sqliteUtils.decrementRemaining(i,tbName);
			
			let newRemaining = await sqliteUtils.getRemaining(i,tbName);
			if(newRemaining == 0){
			await sqliteUtils.deleteIfZero(i,tbName);
			
			mailer.send(usrEmail , 'Tracking Period Over' , 'Your tracking period is over and you will not recieve any more updates . To continue , please use the Lets Track It app again. ' );	
			}
			
		}
	}
	else
		console.log('Table is empty');
}




//cron.schedule('0 4,12,20 * * *', () => {
cron.schedule('*/3 * * * *', () => {

console.log("The task has started at "+dateTime.t());
perform();
});

//sqliteUtils.closeDB();