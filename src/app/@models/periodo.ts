import { addDays } from 'date-fns';

export class Periodo {
  static parse(json: string) {
    const pJson = JSON.parse(json);
    const f1 = new Date(pJson.fechaInicial);
    const f2 = new Date(pJson.fechaFinal);
    return new Periodo(f1, f2);
  }

  static fromNow(days: number): Periodo {
    const today = new Date();
    // const today = addDays(new Date(), 1);
    const f1 = addDays(today, days * -1);
    return new Periodo(f1, today);
  }

  /*
  static mesActual(): Periodo {
    const now = moment();
    const f1 = moment(now).startOf('month');
    const f2 = moment(now).endOf('month');
    return new Periodo(f1.toDate(), f2.toDate());
  }

  static fromJson(jsonString: string) {
    try {
      const data = JSON.parse(jsonString);
      const f1 = moment(data.fechaInicial).toDate();
      const f2 = moment(data.fechaFinal).toDate();
      return new Periodo(f1, f2);
    } catch (error) {
      // console.log(error);
      return null;
    }
  }



  static monthToDay(): Periodo {
    const now = moment();
    const f1 = moment(now).startOf('month');
    const f2 = moment(now);
    return new Periodo(f1.toDate(), f2.toDate());
  }

  static monthsAgo(months: number): Periodo {
    const f1 = moment().subtract(months, 'months');
    const f2 = moment();
    return new Periodo(f1.toDate(), f2.toDate());
  }

  static fromStorage(key: string, notFound: Periodo = Periodo.monthToDay()) {
    return this.fromJson(localStorage.getItem(key)) || notFound;
  }
  static saveOnStorage(key: string, periodo: Periodo) {
    return localStorage.setItem(key, periodo.toJson());
  }
  */

  constructor(
    public fechaInicial: Date = new Date(),
    public fechaFinal: Date = new Date()
  ) {}

  /*
  toString() {
    return `${moment(this.fechaInicial).format('DD/MM/YYYY')} - ${moment(
      this.fechaFinal
    ).format('DD/MM/YYYY')}`;
  }
  */
  toString() {
    return `${this.fechaInicial.toISOString()} al ${this.fechaFinal.toISOString()}`;
  }

  toJson() {
    return JSON.stringify(this);
  }

  toApiJSON() {
    return {
      fechaInicial: this.fechaInicial.toISOString(),
      fechaFinal: this.fechaFinal.toISOString(),
    };
  }
}

export interface PeriodoSearchCriteria {
  fechaInicial: string;
  fechaFinal: string;
  registros: number;
}

export const buildPeriodoCriteria = (
  dias: number = 3,
  registros = 20
): PeriodoSearchCriteria => {
  const { fechaInicial, fechaFinal } = Periodo.fromNow(dias).toApiJSON();
  return {
    fechaInicial,
    fechaFinal,
    registros,
  };
};
