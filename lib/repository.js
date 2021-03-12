"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.getDatabase = exports.parseDatabase = exports.extractDatabase = exports.downloadDatabaseZipped = void 0;
var axios_1 = __importDefault(require("axios"));
var fs_1 = __importDefault(require("fs"));
var node_stream_zip_1 = __importDefault(require("node-stream-zip"));
var path_1 = require("path");
var util_1 = require("util");
var url = "https://github.com/ManualDoVestibulando/data/archive/main.zip";
var downloadDatabaseZipped = function (filepath) { return __awaiter(void 0, void 0, void 0, function () {
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
exports.downloadDatabaseZipped = downloadDatabaseZipped;
var extractDatabase = function (filepath) { return __awaiter(void 0, void 0, void 0, function () {
    var zip;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (fs_1.default.existsSync(filepath)) {
                    return [2 /*return*/];
                }
                fs_1.default.mkdirSync(filepath);
                zip = new node_stream_zip_1.default.async({ file: filepath + ".zip" });
                return [4 /*yield*/, zip.extract("data-main/", filepath)];
            case 1:
                _a.sent();
                return [4 /*yield*/, zip.close()];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.extractDatabase = extractDatabase;
var readFile = util_1.promisify(fs_1.default.readFile);
var readFileAndParse = function (filepath) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log(filepath);
        return [2 /*return*/, readFile(filepath)
                .then(function (c) { return c.toString(); })
                .then(JSON.parse)];
    });
}); };
var pathIsDir = function (filepath) {
    console.log(filepath);
    return fs_1.default.lstatSync(filepath).isDirectory();
};
var pathList = function (filepath) {
    return fs_1.default.readdirSync(filepath).map(function (f) { return path_1.join(filepath, f); });
};
var pathListDirs = function (filepath) { return pathList(filepath).filter(pathIsDir); };
var readFileAndParseIndex = function (filepath) {
    return readFileAndParse(path_1.join(filepath, "index.json"));
};
Array.prototype.mapAwait = function (c) {
    return Promise.all(this.map(c));
};
// Se você precisa mexer nisso aqui, primeiro desculpa, depois dá uma olhada na estrutura de diretorios do data
var parseDatabase = function (filepath) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = [{}];
                return [4 /*yield*/, readFileAndParseIndex(filepath)];
            case 1:
                _b = [__assign.apply(void 0, _a.concat([(_d.sent())]))];
                _c = {};
                return [4 /*yield*/, pathListDirs(filepath).mapAwait(function (institutopath) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b;
                        var _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    _a = [{}];
                                    return [4 /*yield*/, readFileAndParseIndex(institutopath)];
                                case 1:
                                    _b = [__assign.apply(void 0, _a.concat([(_d.sent())]))];
                                    _c = {};
                                    return [4 /*yield*/, pathListDirs(institutopath).mapAwait(function (cursopath) { return __awaiter(void 0, void 0, void 0, function () {
                                            var _a, _b;
                                            var _c, _d;
                                            return __generator(this, function (_e) {
                                                switch (_e.label) {
                                                    case 0:
                                                        _a = [{}];
                                                        return [4 /*yield*/, readFileAndParseIndex(cursopath)];
                                                    case 1:
                                                        _b = [__assign.apply(void 0, _a.concat([(_e.sent())]))];
                                                        _c = {};
                                                        _d = {};
                                                        return [4 /*yield*/, pathList(path_1.join(cursopath, "notas", "fuvest")).mapAwait(function (fuvestpath) {
                                                                return readFileAndParse(fuvestpath);
                                                            })];
                                                    case 2: return [2 /*return*/, (__assign.apply(void 0, _b.concat([(_c.notas = (_d.fuvest = _e.sent(),
                                                                _d), _c)])))];
                                                }
                                            });
                                        }); })];
                                case 2: return [2 /*return*/, (__assign.apply(void 0, _b.concat([(_c.cursos = _d.sent(), _c)])))];
                            }
                        });
                    }); })];
            case 2: return [2 /*return*/, __assign.apply(void 0, _b.concat([(_c.institutos = _d.sent(), _c)]))];
        }
    });
}); };
exports.parseDatabase = parseDatabase;
var getDatabase = function (filepath) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.downloadDatabaseZipped(filepath + ".zip")];
            case 1:
                _a.sent();
                return [4 /*yield*/, exports.extractDatabase(filepath)];
            case 2:
                _a.sent();
                return [4 /*yield*/, exports.parseDatabase(filepath)];
            case 3: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getDatabase = getDatabase;
