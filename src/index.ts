import { NotaFuvest } from "core/src/NotaFuvest";
import { saveDatabaseZipped, readDatabaseZipped, parseDataset } from "./util";

let notas: {
  fuvest: Array<NotaFuvest>;
} | null = null;

// Singleton
export const getNotas = async (
  path: string = "/tmp/data_manualdovestibulando.zip"
) => {
  if (notas != null) {
    return notas;
  }
  await saveDatabaseZipped(path);
  const dataset = await readDatabaseZipped(path);
  notas = parseDataset(dataset);
  return notas;
};

(async function () {
  const notas = await getNotas();
  console.log(notas);
})();
