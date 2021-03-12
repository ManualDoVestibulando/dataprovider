import { ManualDoVestibulandoEntity } from "core/src/Entity";
import { getDatabase } from "./repository";

let notas: ManualDoVestibulandoEntity | null = null;

// Singleton
export const getData = async (
  path: string = "/tmp/data_manualdovestibulando"
) => {
  if (notas != null) {
    return notas;
  }
  notas = await getDatabase(path);
  return notas;
};
