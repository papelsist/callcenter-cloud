import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  Inject,
  LOCALE_ID,
} from '@angular/core';

import {
  GridOptions,
  GridApi,
  ColDef,
  GridReadyEvent,
  RowDoubleClickedEvent,
  ColumnApi,
  ColGroupDef,
} from 'ag-grid-community';
import { formatCurrency, formatDate } from '@angular/common';

import { spAgGridText } from '@papx/utils';

import { timer } from 'rxjs';
import { differenceInMinutes } from 'date-fns';
import { formatDistanceToNow } from 'date-fns';
import { differenceInHours } from 'date-fns';
import { es } from 'date-fns/locale';

import { Pedido } from '@papx/models';
import firebase from 'firebase/app';

@Component({
  selector: 'papx-pedidos-log-grid',
  template: `
    <ag-grid-angular
      #agGrid
      class="ag-theme-alpine"
      style="width: 100%; height: 100%;"
      [rowData]="pedidos"
      [gridOptions]="gridOptions"
      [defaultColDef]="defaultColDef"
      [localeText]="localeText"
      (gridReady)="onGridReady($event)"
      (rowDoubleClicked)="onDoubleClick($event)"
      (firstDataRendered)="onFirstDataRendered($event)"
      rowSelection="single"
    >
    </ag-grid-angular>
  `,
  styles: [
    `
      .panel {
        height: 65vh;
        width: 100%;
      }
      .facturacion-header {
        font-style: bold;
        background-color: #5b9bd5;
      }
      .danger-cell {
        background-color: red;
        color: white;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendientesLogTableComponent implements OnInit {
  @Input() pedidos: Pedido[] = [];
  @Output() selected = new EventEmitter();

  gridOptions: GridOptions;
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  defaultColDef: any;
  localeText = spAgGridText;

  constructor(@Inject(LOCALE_ID) private locale: string) {}

  ngOnInit() {
    this.buildGridOptions();
  }

  buildGridOptions() {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.columnDefs = this.buildColsDef();
    this.defaultColDef = {
      editable: false,
      filter: 'agTextColumnFilter',
      width: 80,
      sortable: true,
      resizable: true,
    };
    this.gridOptions.onCellMouseOver = (event) => {};
    this.gridOptions.onCellDoubleClicked = (event) => {};
    this.gridOptions.rowHeight = 35;
  }

  onDoubleClick(event: RowDoubleClickedEvent) {
    this.selected.emit(event.data);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onFirstDataRendered(params) {
    // params.api.sizeColumnsToFit();
    this.updateView();
  }

  exportToCsv() {
    this.gridOptions.api.exportDataAsCsv({
      fileName: `PedidosLog_${new Date().getMinutes()}.csv`,
      processCellCallback: ({ value }) =>
        value instanceof firebase.firestore.Timestamp
          ? this.transformDate(value.toDate(), 'dd/MM/yyyy HH:mm')
          : value,
      skipColumnGroupHeaders: true,
    });
  }

  private buildColsDef(): ColGroupDef[] {
    return [
      {
        headerName: 'Pedido',
        children: [
          {
            headerName: 'Cliente',
            field: 'nombre',
            pinned: 'left',
            minWidth: 230,
            wrapText: true,
          },
          {
            headerName: 'Pedido',
            field: 'folio',
            width: 100,
            pinned: 'left',
          },
          {
            headerName: 'Status',
            field: 'status',
            width: 120,
            pinned: 'left',
          },
          {
            headerName: 'Modificado',
            field: 'lastUpdated',
            width: 120,
            pinned: 'left',
            valueFormatter: ({ value }) =>
              this.transformDate(value.toDate(), 'dd/MM/yy HH:mm'),
          },
          {
            headerName: 'Vendedor',
            field: 'createUser',
            width: 120,
            wrapText: true,
          },
        ],
      },
      {
        headerName: 'Cierre',
        children: [
          {
            headerName: 'Usuario:',
            field: 'cerradoUser',
            width: 120,
            pinned: 'left',
            valueGetter: ({ data }) =>
              data.cierre ? data.cierre.userName : 'ND',
          },
          {
            headerName: 'Cerrado',
            field: 'cerrado',
            width: 130,
            pinned: 'left',
            valueGetter: ({ data }) =>
              data.cierre ? data.cierre.cerrado : null,
            valueFormatter: ({ value }) =>
              value
                ? this.transformDate(value.toDate(), 'dd/MM/yy HH:mm')
                : 'ND',
          },
        ],
      },
      // Second section ---------
      {
        headerName: 'Atención en Sucursal',
        children: [
          {
            headerName: 'Sucursal',
            field: 'sucursal',
            width: 120,
          },
          {
            headerName: 'Atiende',
            field: 'atiende',
            width: 110,
            valueGetter: ({ data: { atencion } }) =>
              atencion ? atencion.atiende : 'PENDIENTE',
          },
          {
            headerName: 'Atendido',
            field: 'atendido',
            width: 130,
            valueGetter: ({ data }) =>
              data.atencion ? data.atencion.atendio : null,
            valueFormatter: ({ value }) =>
              value
                ? this.transformDate(value.toDate(), 'dd-MMM (HH:mm)')
                : 'PENDIENTE',
          },
          {
            headerName: 'Retraso 1',
            colId: 'retrasoAtencion',
            field: 'atendido',
            width: 110,
            filter: 'agNumberColumnFilter',
            valueGetter: ({ data: pedidoLog }) => {
              const { atencion, cierre, lastUpdated } = pedidoLog;

              if (!cierre) {
                // El pedido no esta cerrado
                return this.minutesFromNow(lastUpdated);
              }

              if (!atencion) {
                return this.minutesFromNow(
                  cierre.cerrado ? cierre.cerrado : lastUpdated
                );
              }

              const { atendido } = atencion;
              const { cerrado, replicado } = cierre;

              if (!atendido) {
                return this.minutesFromNow(cerrado);
              } else {
                let ret =
                  (atendido.toMillis() - cerrado.toMillis()) / (1000 * 60);
                if (ret < 0) {
                  ret = 0;
                }
                return Math.round(ret);
              }
            },
            cellStyle: (params) => {
              if (params.data.atencion) {
                return { color: 'green' };
              }
              const atraso = params.value;
              if (atraso > 5 && atraso <= 10) {
                return { backgroundColor: 'rgb(255, 230, 0)', color: 'black' };
              } else if (atraso > 10) {
                return { backgroundColor: '#c24949f6', color: '#fff' };
              } else {
                return null;
              }
            },
          },
        ],
      },
      {
        headerName: 'Puesto',
        openByDefault: true,
        children: [
          {
            headerName: 'Horario',
            colId: 'puesto',
            width: 130,
            filter: false,
            columnGroupShow: 'closed',
            valueGetter: (params) => {
              const pedidoLog = params.data;
              const puesto = pedidoLog.puesto;
              if (puesto && puesto.fecha) {
                return puesto.fecha.toDate();
              }
              return null;
            },
            valueFormatter: ({ value }) =>
              value ? this.transformDate(value, 'dd-MMM (HH:mm)') : null,
          },
          {
            headerName: 'Usuario',
            colId: 'puestoUsuario',
            width: 110,
            columnGroupShow: 'closed',
            filter: false,
            valueGetter: (params) => {
              const pedidoLog = params.data;
              const puesto = pedidoLog.puesto;
              return puesto ? puesto.usuario : '';
            },
          },
        ],
      },
      // Facturacion -------------
      {
        headerName: 'Facturación',
        headerClass: 'facturacion-header',
        children: [
          {
            headerName: 'Folio',
            field: 'facturacion',
            width: 110,
            valueGetter: ({ data: { factura } }) => {
              if (factura) {
                return factura.folio;
              } else {
                return null;
              }
            },
          },
          {
            headerName: 'Fecha',
            colId: 'facturacionHora',
            width: 130,
            valueGetter: ({ data: { facturacion } }) => {
              if (facturacion) {
                return facturacion.creado.toDate();
              } else {
                return null;
              }
            },
            valueFormatter: ({ value }) =>
              this.transformDate(value, 'dd-MMM (HH:mm)'),
          },
          {
            headerName: 'Retraso',
            colId: 'retrasoFacturacion',
            field: 'facturacion',
            width: 100,
            filter: 'agNumberColumnFilter',
            valueGetter: ({
              data: { facturacion, atencion, cierre, lastUpdated },
            }) => {
              if (facturacion) {
                return 0;
              } else {
                const tm = atencion
                  ? atencion.facturable
                  : cierre && cierre.cerrado
                  ? cierre.cerrado
                  : lastUpdated;
                return this.minutesFromNow(tm);
              }
            },
            cellStyle: ({ value: atraso }) => {
              // const atraso = params.value;
              if (atraso > 15 && atraso <= 30) {
                return { backgroundColor: 'rgb(255, 230, 0)', color: 'black' };
              } else if (atraso > 30) {
                return { backgroundColor: '#c24949f6', color: '#fff' };
              } else {
                return {};
              }
            },
          },
        ],
      },
      // --- Embarque
      {
        headerName: 'Embarque',
        openByDefault: true,
        children: [
          {
            headerName: '#',
            colId: 'embarqueFolio',
            filter: false,
            valueGetter: ({ data: { embarqueLog } }) =>
              embarqueLog ? embarqueLog.embarque : '',
          },
          {
            headerName: 'Chofer',
            colId: 'embarqueChofer',
            width: 200,
            columnGroupShow: 'closed',
            valueGetter: ({ data: { embarqueLog } }) =>
              embarqueLog ? embarqueLog.chofer : '',
            filter: false,
          },
          {
            headerName: 'Asignación',
            colId: 'embarqueAsignado',
            width: 110,
            columnGroupShow: 'closed',
            filter: false,
            valueGetter: ({ data: { embarqueLog } }) =>
              embarqueLog ? embarqueLog.asignado.toDate() : '',
            valueFormatter: (params) =>
              this.transformDate(params.value, 'HH:mm'),
          },
          {
            headerName: 'Salida',
            colId: 'embarqueSalida',
            width: 130,
            columnGroupShow: 'open',
            filter: false,
            valueGetter: ({ data: { embarqueLog: embarque } }) => {
              return embarque && embarque.embarque
                ? //? embarque.salida.toDate()
                  embarque.asignado.toDate()
                : null;
            },
            valueFormatter: ({ value }) =>
              this.transformDate(value, 'dd-MMM (HH:mm)'),
          },
          {
            headerName: 'Entrega',
            colId: 'embarqueEntrega',
            columnGroupShow: 'open',
            filter: false,
            width: 130,
            valueGetter: ({ data: { embarqueLog: embarque } }) => {
              if (embarque && embarque.recepcion) {
                return embarque.recepcion.arribo.toDate();
              } else {
                return null;
              }
            },
            valueFormatter: ({ value }) =>
              this.transformDate(value, 'dd-MMM (HH:mm)'),
          },
          {
            headerName: 'Ret Entrega',
            colId: 'retrasoEntrega',
            field: 'embarqueLog',
            columnGroupShow: 'open',
            width: 120,
            filter: 'agNumberColumnFilter',
            valueGetter: ({ data: { embarqueLog: embarque, lastUpdated } }) => {
              if (!embarque) {
                return null;
              } else if (embarque.recepcion) {
                return 0;
              } else {
                return this.hoursFromNow(embarque.asignado);
              }
            },
            cellStyle: ({ value: atraso }) => {
              if (atraso > 4 && atraso < 10) {
                return { backgroundColor: 'rgb(255, 230, 0)', color: 'black' };
              } else if (atraso > 10) {
                return { backgroundColor: '#c24949f6', color: '#fff' };
              } else {
                return {};
              }
            },
          },
        ],
      },
    ];
  }

  transformCurrency(data: any) {
    return formatCurrency(data, this.locale, '$');
  }

  transformDate(data: any, format: string = 'dd/MM/yyyy') {
    if (data) {
      return formatDate(data, format, this.locale);
    } else {
      return '';
    }
  }

  fromNow(time: any) {
    // return moment(time).fromNow(false);
    return formatDistanceToNow(time.toDate(), { locale: es });
  }

  minutesFromNow(time: any): number {
    return differenceInMinutes(new Date(), time.toDate());
  }

  hoursFromNow(time: any): number {
    return differenceInHours(new Date(), time.toDate());
  }

  updateView() {
    /*
    timer(100, 60000).subscribe(() => {
      this.gridApi.redrawRows();
    });
    */
  }
}
