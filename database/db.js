const fs = require("fs");

const file = "./database/data.json";

// create file if not exists
if (!fs.existsSync(file)) {
  fs.writeFileSync(file, "{}");
}

function read() {
  return JSON.parse(fs.readFileSync(file));
}

function write(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = {
  get: (key) => {
    const data = read();
    return data[key];
  },

  set: (key, value) => {
    const data = read();
    data[key] = value;
    write(data);
  },

  add: (key, value) => {
    const data = read();
    data[key] = (data[key] || 0) + value;
    write(data);
  },

  delete: (key) => {
    const data = read();
    delete data[key];
    write(data);
  },
};
