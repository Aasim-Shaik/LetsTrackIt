const sqlite3 = require('sqlite3').verbose();
let db ;



async function makeConn(dbname) {

db = new sqlite3.Database('./'+dbname+'.db',sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    return console.error(err.message);}
console.log('Connected to '+dbname+'.db');
});
}

async function isEmpty(tb){
	return new Promise((resolve,reject)=>{
	db.get('SELECT COUNT(*) as count from '+tb , function(err , row){
		if(err)reject(err);
		if(row.count == 0)
		resolve(true);
		else
			resolve(false);


	});
});
}

async function getRowCount(tb){
	return new Promise((resolve,reject)=>{
	db.get('SELECT COUNT(*) as count from '+tb , function(err , row){
		if(err)reject(err);
		resolve(row.count);

	});
});
}

async function getEmail(id,tb){
	return new Promise((resolve,reject)=>{
	db.get('SELECT email from '+tb+' where uid = '+id , function(err , row){
		if(err)reject(err);
		resolve(row.email);

	});
});
}

async function getUrl(id , tb){
	return new Promise((resolve,reject)=>{
	db.get('SELECT url from '+tb+' where uid = '+id , function(err , row){
		if(err)reject(err);
		resolve(row.url);

	});
});
}

async function getRemaining(id,tb){
	return new Promise((resolve,reject)=>{
	db.get('SELECT remaining from '+tb+' where uid = '+id , function(err , row){
		if(err)reject(err);
		resolve(row.remaining);

	});
});
}

async function getPrice(id,tb){
	return new Promise((resolve,reject)=>{
	db.get('SELECT currentPrice from '+tb+' where uid = '+id , function(err , row){
		if(err)reject(err);
		resolve(row.currentPrice);


});
});
}

async function getCheapPrice(id,tb){
	return new Promise((resolve,reject)=>{
	db.get('SELECT cheapestPrice from '+tb+' where uid = '+id , function(err , row){
		if(err)reject(err);
		resolve(row.cheapestPrice);

	});
});
}

async function getHighPrice(id,tb){
	return new Promise((resolve,reject)=>{
	db.get('SELECT highestPrice from '+tb+' where uid = '+id , function(err , row){
		if(err)reject(err);
		resolve(row.highestPrice);

	});
});
}

async function updateRemaining(id ,tb, val){

	db.run('UPDATE '+tb+' SET remaining ='+val+' WHERE uid = '+id, function(err){
		if(err)console.log(err);
		console.log(this.changes +' row(s) updated (remaining)');

	});

}

async function updatePrice(id ,tb, val){

	db.run('UPDATE '+tb+' SET currentPrice ='+val+' WHERE uid = '+id, function(err){
		if(err)console.log(err);
		console.log(this.changes +' row(s) updated (currentPrice) id : '+id);

	});

}

async function updateCheapPrice(id ,tb, val){

	db.run('UPDATE '+tb+' SET cheapestPrice ='+val+' WHERE uid = '+id, function(err){
		if(err)console.log(err);
		console.log(this.changes +' row(s) updated (cheapestPrice)');

	});

}

async function updateHighPrice(id ,tb, val){

	db.run('UPDATE '+tb+' SET highestPrice ='+val+' WHERE uid = '+id, function(err){
		if(err)console.log(err);
		console.log(this.changes +' row(s) updated (highestPrice)');

	});

}

async function updateUrl(id ,tb, val){

	db.run('UPDATE '+tb+' SET url ="'+val+'" WHERE uid = '+id, function(err){
		if(err)console.log(err);
		console.log(this.changes +' row(s) updated (url)');

	});

}

async function insert(sql){
	
	db.run(sql, function(err){
		if(err)console.log(err);
		console.log(this.changes +' row(s) inserted');

	});

}

async function deleteRow(id,tb){

	db.run('DELETE from '+tb+' where uid = '+id, function(err){
		if(err)reject(err);
		console.log('Deleted row with id '+id);

	});

}
async function deleteIfZero(id,tb){
	if(await getRemaining(id,tb)==0){
		await deleteRow(id,tb);
	}
}

async function decrementRemaining(id,tb){
	let value = await getRemaining(id,tb);
	if(!(value == 0 || value < 0)){
	--value;
	updateRemaining(id,tb,value);
	}
	else{
		console.log('ERROR -> value already 0');
	}

}
async function incrementRemaining(id,tb){
	let value = await getRemaining(id,tb);
	value = value+1;
	updateRemaining(id,tb,value);

}
async function closeDB(){
	db.close()
}
async function getRowIdList(tb){
	return new Promise((resolve,reject)=>{
	db.all('select uid from '+tb , function(err , rows){
		if(err)reject(err);
		resolve(rows);
	});
});

}

module.exports = {getRowIdList , updateUrl, getCheapPrice , getHighPrice , updateHighPrice , getPrice , updatePrice ,updateCheapPrice ,  closeDB , makeConn , isEmpty , insert , getRowCount , getUrl , getRemaining , getEmail , updateRemaining , deleteRow , deleteIfZero , decrementRemaining  ,incrementRemaining};

