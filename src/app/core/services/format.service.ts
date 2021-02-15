import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { formatCurrency, formatDate, formatPercent } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class FormatService {
  constructor(@Inject(LOCALE_ID) private locale) {}

  formatCurrency(data: any) {
    return formatCurrency(data, this.locale, '$');
  }

  formatDate(data: any, format: string = 'dd/MM/yyyy') {
    if (data) {
      return formatDate(data, format, this.locale);
    } else {
      return '';
    }
  }

  formatPercent(value: any, format: string = '1.2-2') {
    if (value) {
      return formatPercent(value, this.locale, format);
    } else {
      return '';
    }
  }

  capitalize(s: string) {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
