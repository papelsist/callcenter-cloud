/** */
/* eslint-disable no-unused-vars */
/* eslint-disable valid-jsdoc */
import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';

/**
 * Interfaz para representar los parametros requreidos para la generacion
 * de folios por entidad y sucursal
 */
export interface FolioCommand {
  transaction: firestore.Transaction;
  sucursal: string;
  entidad: string;
  db: firestore.Firestore;
}

/**
 * Genera un nuevo folio para una entidad/sucursal en el entorno de una
 * transaccion de Firestore
 *
 * @param {FolioCommand}  FolioCommand config la generacion del folio
 */
export async function getFolio(params: FolioCommand): Promise<number> {
  let folio = 1;
  const folioRef = params.db.doc(`folios/${params.entidad}`);

  const folioDoc = await params.transaction.get<any>(folioRef);

  if (folioDoc.exists) {
    const folioData = folioDoc.data();

    if (!folioData[params.sucursal]) {
      folioData[params.sucursal] = 0; // Init value
    }
    folio = folioData[params.sucursal] + 1;

    folioData[params.sucursal] = folio;
    params.transaction.update(folioRef, folioData);
  } else {
    functions.logger.log(
      `Generando NUEVO folio para ${params.entidad} / ${params.sucursal} `
    );
    const folioData: { [key: string]: number } = {};
    folioData[params.sucursal] = folio;
    params.transaction.set(folioRef, folioData);
  }
  return folio;
}
