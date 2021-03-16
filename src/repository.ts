import axios from "axios";
import fs from "fs";
import streamZip from "node-stream-zip";
import { join as pathjoin } from "path";
import {
  CampusEntity,
  CursoEntity,
  InstitutoEntity,
  ManualDoVestibulandoEntity,
  NotaFuvestEntity,
} from "core/src/Entity";
import { promisify } from "util";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const url = "https://github.com/ManualDoVestibulando/data/archive/main.zip";

export const downloadDatabaseZipped = async (filepath: string) => {
  if (fs.existsSync(filepath)) {
    return;
  }
  console.log("> Baixando banco de dados em ", filepath);
  const response = await axios.get(url, {
    responseType: "stream",
  });
  const writer = fs.createWriteStream(filepath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

export const extractDatabase = async (filepath: string) => {
  if (fs.existsSync(filepath)) {
    return;
  }
  console.log("> Extrandido banco de dados em ", filepath);
  fs.mkdirSync(filepath);
  const zip = new streamZip.async({ file: filepath + ".zip" });
  await zip.extract("data-main/filetree/", filepath);
  await zip.close();
};

const readFile = promisify(fs.readFile);
const readFileAndParse = async (filepath: string) =>
  readFile(filepath)
    .then((c) => c.toString())
    .then(JSON.parse);
const pathIsDir = (filepath: string) => fs.lstatSync(filepath).isDirectory();
const pathList = (filepath: string) => {
  if (!fs.existsSync(filepath)) {
    return [];
  }
  return fs.readdirSync(filepath).map((f) => pathjoin(filepath, f));
};
const pathListDirs = (filepath: string) => pathList(filepath).filter(pathIsDir);
const readFileAndParseIndex = (filepath: string) =>
  readFileAndParse(pathjoin(filepath, "index.json"));

declare global {
  interface Array<T> {
    mapAwait<U>(
      callbackfn: (value: T, index: number, array: T[]) => Promise<U>,
      thisArg?: any
    ): Promise<U[]>;
  }
}
Array.prototype.mapAwait = function (c) {
  return Promise.all(this.map(c));
};

// Se você precisa mexer nisso aqui, primeiro desculpa, depois dá uma olhada na estrutura de diretorios do data
export const parseDatabase = async (
  filepath: string
): Promise<ManualDoVestibulandoEntity> => {
  return {
    ...(await readFileAndParseIndex(filepath)),
    campus: await pathListDirs(filepath).mapAwait<CampusEntity>(
      async (campuspath) => ({
        ...(await readFileAndParseIndex(campuspath)),
        institutos: await pathListDirs(campuspath).mapAwait<InstitutoEntity>(
          async (institutopath) => ({
            ...(await readFileAndParseIndex(institutopath)),
            cursos: await pathListDirs(institutopath).mapAwait<CursoEntity>(
              async (cursopath) => ({
                ...(await readFileAndParseIndex(cursopath)),
                notas: {
                  fuvest: await pathList(
                    pathjoin(cursopath, "notas", "fuvest")
                  ).mapAwait<NotaFuvestEntity>((fuvestpath) =>
                    readFileAndParse(fuvestpath)
                  ),
                  enem: await pathList(
                    pathjoin(cursopath, "notas", "enem")
                  ).mapAwait<NotaFuvestEntity>((fuvestpath) =>
                    readFileAndParse(fuvestpath)
                  ),
                },
              })
            ),
          })
        ),
      })
    ),
  };
};

export const getDatabase = async (filepath: string) => {
  await downloadDatabaseZipped(filepath + ".zip");
  await extractDatabase(filepath);
  await sleep(2000);
  return await parseDatabase(filepath);
};
