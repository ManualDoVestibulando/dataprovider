"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabase = exports.parseDatabase = exports.extractDatabase = exports.downloadDatabaseZipped = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const node_stream_zip_1 = __importDefault(require("node-stream-zip"));
const path_1 = require("path");
const util_1 = require("util");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const url = "https://github.com/ManualDoVestibulando/data/archive/main.zip";
const downloadDatabaseZipped = async (filepath) => {
    if (fs_1.default.existsSync(filepath)) {
        return;
    }
    console.log("> Baixando banco de dados em ", filepath);
    const response = await axios_1.default.get(url, {
        responseType: "stream",
    });
    const writer = fs_1.default.createWriteStream(filepath);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
    });
};
exports.downloadDatabaseZipped = downloadDatabaseZipped;
const extractDatabase = async (filepath) => {
    if (fs_1.default.existsSync(filepath)) {
        return;
    }
    console.log("> Extrandido banco de dados em ", filepath);
    fs_1.default.mkdirSync(filepath);
    const zip = new node_stream_zip_1.default.async({ file: filepath + ".zip" });
    await zip.extract("data-main/filetree/", filepath);
    await zip.close();
};
exports.extractDatabase = extractDatabase;
const readFile = util_1.promisify(fs_1.default.readFile);
const readFileAndParse = async (filepath) => readFile(filepath)
    .then((c) => c.toString())
    .then(JSON.parse);
const pathIsDir = (filepath) => fs_1.default.lstatSync(filepath).isDirectory();
const pathList = (filepath) => {
    if (!fs_1.default.existsSync(filepath)) {
        return [];
    }
    return fs_1.default.readdirSync(filepath).map((f) => path_1.join(filepath, f));
};
const pathListDirs = (filepath) => pathList(filepath).filter(pathIsDir);
const readFileAndParseIndex = (filepath) => readFileAndParse(path_1.join(filepath, "index.json"));
Array.prototype.mapAwait = function (c) {
    return Promise.all(this.map(c));
};
// Se você precisa mexer nisso aqui, primeiro desculpa, depois dá uma olhada na estrutura de diretorios do data
const parseDatabase = async (filepath) => {
    return {
        ...(await readFileAndParseIndex(filepath)),
        campus: await pathListDirs(filepath).mapAwait(async (campuspath) => ({
            ...(await readFileAndParseIndex(campuspath)),
            institutos: await pathListDirs(campuspath).mapAwait(async (institutopath) => ({
                ...(await readFileAndParseIndex(institutopath)),
                cursos: await pathListDirs(institutopath).mapAwait(async (cursopath) => ({
                    ...(await readFileAndParseIndex(cursopath)),
                    notas: {
                        fuvest: await pathList(path_1.join(cursopath, "notas", "fuvest")).mapAwait((fuvestpath) => readFileAndParse(fuvestpath)),
                    },
                })),
            })),
        })),
    };
};
exports.parseDatabase = parseDatabase;
const getDatabase = async (filepath) => {
    await exports.downloadDatabaseZipped(filepath + ".zip");
    await exports.extractDatabase(filepath);
    await sleep(2000);
    return await exports.parseDatabase(filepath);
};
exports.getDatabase = getDatabase;
