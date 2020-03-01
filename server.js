const http = require('http');

const fs = require('fs');
const pug = require('pug');
let restaurants=[];
let names =[];
let orders=[];
let renderHome = pug.compileFile('./pug_files/index.pug');
let renderStats = pug.compileFile('./pug_files/stats.pug');
//read all the json files 
fs.readdirSync('./assignment2-basecode/restaurants/').forEach((file)=>{
	let rest = JSON.parse(fs.readFileSync(`./assignment2-basecode/restaurants/${file}`));
	//store the objects into restaurants array
	restaurants.push(rest);
	names.push(rest.name);
});
restaurants.forEach((res)=>{
	let order={};
	order['name'] = res.name;
	order['total'] = 0;
	order['number'] = 0;
	order['popular'] = 'None';
	orders.push(order);

});

const server = http.createServer((req,res)=>{

	if(req.method === 'GET'){
		if(req.url ==='/' || req.url ==='/index.html'){
			let content = renderHome({restaurants:restaurants});
			res.setHeader("Content-Type", "text/html");
			res.statusCode =200;
			res.end(content);
		}
		else if(req.url.toUpperCase() == '/ORDER'){
			fs.readFile("./assignment2-basecode/orderform.html",(err,data)=>{
				if(err){
					send404(res);
					return;
				}
				res.setHeader("Content-Type", "text/html");
				res.statusCode =200;
				res.end(data);
			});
		}
		else if(req.url ==='/stats'){
			let content = renderStats({orders:orders});
			res.setHeader("Content-Type", "text/html");
			res.statusCode =200;
			res.end(content);
		}
		else if(req.url === '/restaurants'){
			let res_names = JSON.stringify(names);
			res.statusCode =200;
			res.setHeader("Access-Control-Allow-Origin", "*");
			res.setHeader("Content-type","application/JSON");
			res.end(res_names);

		}
		else if(Number(req.url.substr(1)) >= 0 && Number(req.url.substr(1)) < restaurants.length){
			let restaurant = JSON.stringify(restaurants[Number(req.url.substr(1))]);
			res.statusCode =200;
			res.setHeader("Access-Control-Allow-Origin", "*");
			res.setHeader("Content-type","application/JSON");
			res.end(restaurant);
		}
		else if(req.url === '/client.js'){
			fs.readFile('./assignment2-basecode/client.js',(err,data)=>{
				if(err){
					send404(res);
					return;
				}
				res.setHeader("Content-Type", "application/javascript");
				res.statusCode =200;
				res.end(data);
			});
		}
		else if(req.url === '/add.jpg'){
			fs.readFile('./assignment2-basecode/add.jpg',(err,data)=>{
				if(err){
					send404(res);
					return;
				}
				res.setHeader("Content-Type", "image/jpeg");
				res.statusCode =200;
				res.end(data);
			});

		}
		else if(req.url ==='/remove.jpg'){
			fs.readFile('./assignment2-basecode/remove.jpg',(err,data)=>{
				if(err){
					send404(res);
					return;
				}
				res.setHeader("Content-Type", "image/jpeg");
				res.statusCode =200;
				res.end(data);
			});

		}
		else{
			send404(res);
		}
	}
	else if(req.method == 'POST'){
		if(req.url === '/submit'){
			let body = ""
			req.on('data', (chunk) => {
				body += chunk;
			})
			req.on('end', () => {
				let order = JSON.parse(body);
			//	console.log(order);
				updateOrderstats(order);
				res.setHeader("Access-Control-Allow-Origin", "*");
				res.statusCode = 200;
				res.end('ok');
			});

		}
		else{
			send404();
		}
		
	}
	else{
		send404(res);
		
	}
	
	
});
server.listen(3000);
console.log('Server running at http://127.0.0.1:3000/');

function send404(response){
	response.statusCode = 404;
	response.write("Unknown resource.");
	response.end();
}
function updateOrderstats(or){
	for(let i=0;i<orders.length;i++){
		if(orders[i].name == or.name){
			
			orders[i]["number"] +=1;
			orders[i]["total"] += or.total;
			orders[i]["popular"] = or.popular;
			break;
		}

	}

}