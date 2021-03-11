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

export const getCursos = (notas: Pick<NotaFuvest, "unidade" | "curso">[]) => {
  const unidades = new Set(notas.map((n) => n.unidade));
  const acc: Map<string, string[]> = new Map();
  for (const unidade of unidades) {
    const cursos = new Set(
      notas.filter((n) => n.unidade == unidade).map((n) => n.curso)
    );
    acc.set(unidade, Array.from(cursos));
  }
  return acc;
};
