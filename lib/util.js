"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDataset = exports.readDatabaseZipped = exports.saveDatabaseZipped = void 0;
var axios_1 = __importDefault(require("axios"));
var fs_1 = __importDefault(require("fs"));
var node_stream_zip_1 = __importDefault(require("node-stream-zip"));
var path_1 = require("path");
var url = "https://github.com/ManualDoVestibulando/data/archive/main.zip";
var saveDatabaseZipped = function (filepath) { return __awaiter(void 0, void 0, void 0, function () {
    var response, writer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (fs_1.default.existsSync(filepath)) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, axios_1.default.get(url, {
                        responseType: "stream",
                    })];
            case 1:
                response = _a.sent();
                writer = fs_1.default.createWriteStream(filepath);
                response.data.pipe(writer);
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        writer.on("finish", resolve);
                        writer.on("error", reject);
                    })];
        }
    });
}); };
exports.saveDatabaseZipped = saveDatabaseZipped;
var readDatabaseZipped = function (filepath) { return __awaiter(void 0, void 0, void 0, function () {
    var acc, zip, entries, _i, _a, entry, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                acc = {};
                zip = new node_stream_zip_1.default.async({ file: filepath });
                return [4 /*yield*/, zip.entries("")];
            case 1:
                entries = _d.sent();
                _i = 0, _a = Object.values(entries);
                _d.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                entry = _a[_i];
                if (entry.isDirectory)
                    return [3 /*break*/, 4];
                if (path_1.extname(entry.name) != ".json")
                    return [3 /*break*/, 4];
                _b = acc;
                _c = entry.name;
                return [4 /*yield*/, zip.entryData(entry)];
            case 3:
                _b[_c] = _d.sent();
                _d.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [4 /*yield*/, zip.close()];
            case 6:
                _d.sent();
                return [2 /*return*/, acc];
        }
    });
}); };
exports.readDatabaseZipped = readDatabaseZipped;
var parseDataset = function (dataset) {
    var accFuvest = [];
    for (var key in dataset) {
        var nota = JSON.parse(dataset[key]);
        if (key.includes("/fuvest/")) {
            accFuvest.push(nota);
        }
    }
    return {
        fuvest: accFuvest,
    };
};
exports.parseDataset = parseDataset;
