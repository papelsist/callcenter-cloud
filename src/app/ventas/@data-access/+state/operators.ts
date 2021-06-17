import { Pedido } from '@papx/models';

import { combineLatest, Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';

import pick from 'lodash-es/pick';

export const mapPedidoToSearchItem = (item: Pedido): string => {
  const target = pick(item, [
    'nombre',
    'rfc',
    'sucursal',
    'createUser',
    'updateUser',
    'formaDePago',
  ]);

  return Object.values(target)
    .map((i: string) => i.toLowerCase())
    .join('');
};

export const filtrarPedidos = (
  source: Observable<Pedido[]>,
  filter: Observable<string>
): Observable<Pedido[]> => {
  return combineLatest([source, filter]).pipe(
    map(([rows, term]) =>
      term.length === 0
        ? rows
        : rows.filter((item) => {
            const template = mapPedidoToSearchItem(item);
            return template.includes(term.toLowerCase());
          })
    )
  );
};

export const filtrarPedidos2 = () =>
  pipe(
    map(([rows, term]) =>
      term.length === 0
        ? rows
        : rows.filter((item) => {
            const template = mapPedidoToSearchItem(item);
            return template.includes(term.toLowerCase());
          })
    )
  );
