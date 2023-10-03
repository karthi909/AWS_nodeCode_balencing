const express = require('express');

const port = 3001;
const app = express();
const { exec } = require('child_process');
const { default: axios } = require('axios');

const routeUsage = {};

app.use((req, res, next) => {
  const { url, method } = req;
  const routeKey = `${method} ${url}`;

  if (!routeUsage[routeKey]) {
    routeUsage[routeKey] = 0;
  }

  routeUsage[routeKey]++;
  console.log('routeUsage ->', routeUsage);
  next();
});

app.get('/lite', (req, res) =>{
  console.log(req.url);
  return res.send({msg:"ok done"})
});

// Later, you can access the `routeUsage` object to see the usage counts for different routes.
app.get("/heavy", (req, res)=>{
    exec(`ifconfig | grep "inet "`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error}`);
          return;
        }
        console.log(`Output: ${stdout.slice(13,28)}`);
      });
    let total = 0;
    for(let i=0; i< 50_000_000; i++){
        total++
    };

    res.send(`The result of the CPU intensive task is ${total}`)
});


app.get('/userInfo', async (req, res) =>{
  try {
   let data = await axios.get('https://reqres.in/api/users');

    return res.status(200).send({status:200, data:data.data, message:"Data fetched successfullly"});

  } catch (error) {
    
    return res.status(500).send({status:500,message:error.stack})
  }
})

app.listen(port, ()=>{
    console.log(`App running on port ${port}`);
    console.log(`wroekr PID - ${process.pid}`);
})