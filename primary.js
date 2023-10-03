const cluster = require('cluster');
const os = require('os');
const path = require('path');
// let {dirname} =require('path');
// let {fileURLToPath} = require('url');

var _dirname = path.join(__dirname,'app.js')
console.log(_dirname)
//console.log(import.meta.url);
const cpuCount = os.cpus().length;

console.log(`The total number of CPUs is ${cpuCount}`);
console.log(`primary pid= ${process.pid}`);

//setting up primary process that will run when cluster starts running
cluster.setupPrimary({
    exec: _dirname
});

//based on the number of cores we are forking the cluster 
for(let i=0; i < cpuCount; i++){
    cluster.fork();
}

//if any one of the cluster dies imediatley it will be fork another cluster
cluster.on('exit', (worker, code, signal)=>{
    console.log(`worker ${worker.process.pid} has been killed`);
    console.log("Starting another worker");
    cluster.fork();
});

//to test -> npx loadtest -n 1200 -c 400 -k http://localhost:3001/heavy