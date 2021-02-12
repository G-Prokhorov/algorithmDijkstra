const express = require("express");
const path = require('path');
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.post("/post", (req, res) => {
      const size = req.body.size;
      const start = req.body.start;
      let array = new Array(size);
      let info = new Array(size);


      for (let i = 0; i < size; i++) {
            array[i] = new Array(size);
            array[i][i] = 0; // distance between one point = 0
            info[i] = {
                  distance: 10000,
                  visit: 1,
            }
      }

      const body = req.body.data;
      for (let key in body) {
            let int = parseInt(key);
            array[Math.floor(int / 10) - 1][int % 10 - 1] = parseInt(body[key]);
            array[int % 10 - 1][Math.floor(int / 10) - 1] = parseInt(body[key]);
      }
      let str = "";
      for (let i = 0; i < size; i++) {
            for (let n = 0; n < size; n++) {
                  str += array[i][n] + " ";
            }
            str += "\n";

      }
      res.write(str);

      info[start - 1].distance = 0; //the first vertex has no weight, since we are looking for relative to it

      let min = {
            index: 0,
            weight: 0
      };

      do {
            min.index = Infinity;
            min.weight = Infinity;

            for (let i = 0; i < size; i++) {
                  if ((info[i].visit === 1) && (info[i].distance < min.weight)) {
                        min.weight = info[i].distance;
                        min.index = i;
                  }
            }

            if (min.index != Infinity) {
                  let tmp;
                  for (let i = 0; i < size; i++) {
                        if (array[min.index][i] > 0) {
                              tmp = min.weight + array[min.index][i];
                              if (tmp < info[i].distance) {
                                    info[i].distance = tmp;
                              }
                        }
                  }
                  info[min.index].visit = 0;
            }
      } while (min.index < Infinity);

      res.write("Кратчайшие расстояния до вершин: \n");
      str = "";
      for (let i = 0; i < size; i++) {
            str += "до " + (i + 1) + ":" + info[i].distance + ";\n";
      }
      res.write(str);

      let ver = new Array(size); // array of way
      let end = req.body.finish - 1;
      ver[0] = end + 1; //first element is finish
      let k = 1;
      let weight = info[end].distance;

      while (end != 0) { // find way
            for (let i = 0; i < size; i++) {
                  if (array[i][end] != 0) { // check connection
                        let tmp = weight - array[i][end];
                        if (tmp === info[i].distance) { // compare smallest distances
                              weight = tmp;
                              end = i;
                              ver[k] = i + 1;
                              k++;
                        }
                  }
            }
      }
      str = "";
      str += "Путь от вершины " + start + " до вершины " + req.body.finish + ":\n"
      for (let i = k - 1; i >= 0; i--) {
            str += ver[i] + " ";
      }
      res.write(str);


      res.sendStatus(200);
})

app.listen(3000, () => {
      console.log("Server started");
})