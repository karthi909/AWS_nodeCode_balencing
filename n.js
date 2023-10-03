const { exec } = require('child_process');

exec(`ifconfig | grep "inet "`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error}`);
    return;
  }
  console.log(`Output: ${stdout.slice(13,28)}`);
});
