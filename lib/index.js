"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getData = void 0;
const repository_1 = require("./repository");
let notas = null;
// Singleton
const getData = async (path = "/tmp/data_manualdovestibulando") => {
    if (notas != null) {
        return notas;
    }
    notas = await repository_1.getDatabase(path);
    return notas;
};
exports.getData = getData;
/*
(async () => {
  const data = await getData();
  console.log(JSON.stringify(data));
})();
*/
