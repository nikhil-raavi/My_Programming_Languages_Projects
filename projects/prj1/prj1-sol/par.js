const fs = require('fs');

function parse(inp) {
  let tokens = inp.match(/\b\w+\b|[{};:^#]/g);
  let pos = 0;
  let result = [];

  function parseDeclaration() {
    if (tokens[pos] === 'var') {
      pos += 1;
      let varName = tokens[pos];
      if (varName === 'number' || varName === 'string' || varName === 'record') {
        throw new Error(`Error: expecting 'id' but got '${varName}'`);
      } 
      pos += 1;
      if (tokens[pos] === ':') {
        pos += 1;
        varType = parse_type();
        result.push([varName, varType]);
      } else {
        throw new Error("Error: Either Missing colon ':' or TypeId in the input");
      }
    } else if (tokens[pos] === ';') {
      pos += 1;
      if (pos < tokens.length - 1) {
        parseDeclaration();
      }
    } else {
      throw new Error("Error: missing 'var");
    }
  }

  function parse_type() {
    if (tokens[pos] === 'number') {
        pos++;
        if (pos >= tokens.length || tokens[pos] !== ';') {
            throw new Error("Error: field is missing semi-colon ';'");
        }
        return 'number';
    } else if (tokens[pos] === 'string') {
        pos++;
        if (pos >= tokens.length || tokens[pos] !== ';') {
            throw new Error("Error: field is missing semi-colon ';'");
        }
        return 'string';
    } else if (tokens[pos] === 'record') {
        pos++;
        let record = [];
        while (tokens[pos] !== 'end') {
            if (tokens[pos] === ';') {
                pos++;
            }
            if (tokens[pos] === 'end') {
                break;
            }
            if (pos < tokens.length - 1) {
                let var_name = tokens[pos];
                if (['number', 'string', 'record'].includes(var_name)) {
                    throw new Error(`Error: expecting 'id' but got '${var_name}'`);
                }
                pos++;
                if (tokens[pos] === ':') {
                    pos++;
                    let var_type = parse_type();
                    record.push([var_name, var_type]);
                } else {
                    throw new Error("Error: field Missing colon ':'");
                }
            }
        }
        pos++;
        if (record.length === 0) {
            throw new Error("Error: Empty record in the Input");
        } else {
            return record;
        }
    } else {
        throw new Error('Error: Invalid type, Input has no type');
        }
    }
  while (pos < tokens.length - 1) {
    parseDeclaration();
  }
    
    return result;
}
var lines = [];
var d = [];

fs.readFile('input.txt', 'utf-8', (err, data) => {
  if (err) throw err;
  console.log(data,)
  const b = data.split('\n');
  console.log(b)
  for (var i = 0; i < b.length; i++) {
  if (b[i].includes("\n")) {
  b[i] = b[i].split("\n")[0];
  }
  if (b[i].includes("\t")) {
  b[i] = b[i].split("\t")[1];
  }
  var f = b[i].split("#");
  b[i] = f[0];
  if (b[i].includes(".")) {
  throw new Error("Error: Bad character");
  }
  }
  var res1 = parse(b.toString());
  console.log(JSON.stringify(res1, null, 4));  // Do your processing here
});






