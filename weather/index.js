const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");


const replaceval = (tempVal, orgval) => {

  let temperature = tempVal.replace("{%temval%}", orgval.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgval.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgval.main.temp_max);
  temperature = temperature.replace("{%location%}", orgval.name);
  temperature = temperature.replace("{%country%}", orgval.sys.country);

  return temperature;
};

const server = http.createServer((req, res) => {

  if (req.url == "/") {
    requests("https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=784935e1330d16bd690feea1086ea59f"
    )

      .on('data', (chunk) => {

        // console.log(chunk)

        const objectdata = JSON.parse(chunk);
        const arrydata = [objectdata];

        //  console.log(arrydata[0].main.temp)

        const reatTimedata = arrydata
          .map((val) => replaceval(homeFile, val))
          .join("");
        //  console.log(reatTimedata)


        res.write(reatTimedata);

      })
      .on('end', (err) => {
        if (err) return console.log("connection closed due to erroe", err);
        res.end();
      });
  }

});

server.listen(4000, "127.0.0.1");