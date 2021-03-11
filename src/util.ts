import axios from "axios";
import fs from "fs";
import streamZip from "node-stream-zip";
import { extname } from "path";
import { NotaFuvest } from "core/src/NotaFuvest";

const url = "https://github.com/ManualDoVestibulando/data/archive/main.zip";

export const saveDatabaseZipped = async (filepath: string) => {
  if (fs.existsSync(filepath)) {
    return;
  }

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

export const readDatabaseZipped = async (filepath: string) => {
  const acc: any = {};

  const zip = new streamZip.async({ file: filepath });
  const entries = await zip.entries("");
  for (const entry of Object.values(entries)) {
    if (entry.isDirectory) continue;
    if (extname(entry.name) != ".json") continue;
    acc[entry.name] = await zip.entryData(entry);
  }
  await zip.close();

  return acc;
};

export const parseDataset = (dataset: any) => {
  const accFuvest: Array<NotaFuvest> = [];
  for (const key in dataset) {
    const nota = JSON.parse(dataset[key]);
    if (key.includes("/fuvest/")) {
      accFuvest.push(nota);
    }
  }
  return {
    fuvest: accFuvest,
  };
};
