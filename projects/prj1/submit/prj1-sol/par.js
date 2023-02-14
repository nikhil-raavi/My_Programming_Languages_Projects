const fs = require("fs");

function main(inp) {
  let d = 0;
  let final = [];
  let token_stream = inp.match(/\b\w+\b|[{};:^#]/g);

  function declare() {
    if (token_stream[d] === "var") {
      d += 1;
      let varName = token_stream[d];
      if (
        varName === "number" ||
        varName === "string" ||
        varName === "record"
      ) {
        throw new Error(`Error! No 'id' is read`);
      }
      d += 1;
      if (token_stream[d] === ":") {
        d += 1;
        varType = check_types();
        final.push([varName, varType]);
      } else {
        throw new Error("Error! ':' or 'Typeid' is missing");
      }
    } else if (token_stream[d] === ";") {
      d += 1;
      if (d < token_stream.length - 1) {
        declare();
      }
    } else {
      throw new Error("Error!");
    }
  }

  function check_types() {
    if (token_stream[d] === "number") {
      d++;
      if (d >= token_stream.length || token_stream[d] !== ";") {
        throw new Error("Error! ';' is missing");
      }
      return "number";
    } else if (token_stream[d] === "string") {
      d++;
      if (d >= token_stream.length || token_stream[d] !== ";") {
        throw new Error("Error! ';' is missing");
      }
      return "string";
    } else if (token_stream[d] === "record") {
      d++;
      let record = [];
      while (token_stream[d] !== "end") {
        if (token_stream[d] === ";") {
          d++;
        }
        if (token_stream[d] === "end") {
          break;
        }
        if (d < token_stream.length - 1) {
          let var_name = token_stream[d];
          if (["number", "string", "record"].includes(var_name)) {
            throw new Error(`Error! No 'id' is read`);
          }
          d++;
          if (token_stream[d] === ":") {
            d++;
            let var_type = check_types();
            record.push([var_name, var_type]);
          } else {
            throw new Error("Error! ':' is missing");
          }
        }
      }
      d++;
      if (record.length === 0) {
        throw new Error("Error! No Input");
      } else {
        return record;
      }
    } else {
      throw new Error("Error !Input has no type");
    }
  }
  while (d < token_stream.length - 1) {
    declare();
  }
  return final;
}

fs.readFile("input.txt", "utf-8", (err, data) => {
  if (err) throw err;
  const inp_tx = data.split("\n");
  for (var i = 0; i < inp_tx.length; i++) {
    if (inp_tx[i].includes("\n")) {
      inp_tx[i] = inp_tx[i].split("\n")[0];
    }
    if (inp_tx[i].includes("\t")) {
      inp_tx[i] = inp_tx[i].split("\t")[1];
    }
    var inp1 = inp_tx[i].split("#");
    inp_tx[i] = inp1[0];
    if (inp_tx[i].includes(".")) {
      throw new Error("Error! Invalid stream");
    }
  }
  var conv_res = main(inp_tx.toString());
  console.log(JSON.stringify(conv_res, null, 4)); // Do your processing here
});
