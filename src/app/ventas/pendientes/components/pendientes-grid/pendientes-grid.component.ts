import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { IconRendererComponent } from '@papx/common/ui-core/renderes/icon-renderer.component';
import { FormatService } from '@papx/core';
import { Pedido } from '@papx/models';
import { spAgGridText } from '@papx/utils';
import {
  CellClickedEvent,
  ColDef,
  FirstDataRenderedEvent,
  GridOptions,
  RowClickedEvent,
  RowDoubleClickedEvent,
} from 'ag-grid-community';

@Component({
  selector: 'papx-pendientes-grid',
  template: `
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      class="ag-theme-alpine"
      [rowData]="pedidos"
      [columnDefs]="columnDefs"
      [gridOptions]="gridOptions"
      (rowDoubleClicked)="rowDoubleClicked($event)"
      (cellClicked)="cellClicked($event)"
      (rowClicked)="rowClicked($event)"
      [localeText]="localeText"
      (firstDataRendered)="onFirstDataRendered($event)"
    >
    </ag-grid-angular>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendientesGridComponent implements OnInit {
  @Input() pedidos: Partial<Pedido>[] = [];
  @Output() editar = new EventEmitter<any>();
  @Output() consultar = new EventEmitter<any>();
  @Output() print = new EventEmitter<any>();
  @Output() cerrar = new EventEmitter<any>();
  @Output() copiar = new EventEmitter<any>();
  @Output() regresar = new EventEmitter<any>();

  columnDefs = this.buildColsDef();
  gridOptions: GridOptions;
  localeText = spAgGridText;

  frameworkComponents = {
    iconRenderer: IconRendererComponent,
  };

  constructor(private format: FormatService) {
    this.buildGridOptions();
  }

  ngOnInit() {}
  buildGridOptions() {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.getRowStyle = this.buildRowStyle.bind(this);
    this.gridOptions.onFirstDataRendered;
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    // console.log('Data: ', this.cotizaciones);
    // params.columnApi.autoSizeAllColumns();
  }

  rowClicked(event: RowClickedEvent) {}

  rowDoubleClicked(evt: RowDoubleClickedEvent) {}

  cellClicked(evt: CellClickedEvent) {
    this.consultar.emit(evt.data);
  }

  buildRowStyle(params: any) {
    if (params.node.rowPinned) {
      return { 'font-weight': 'bold' };
    }
    if (['EN_SUCURSAL'].includes(params.data.status)) {
      return {
        'font-weight': 'bold',
        color: 'var(--ion-color-tertiary)',
      };
    }

    return {};
  }

  private buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'No',
        field: 'folio',
        width: 90,
        pinned: 'left',
        sortable: true,
        filter: true,
      },
      {
        headerName: 'Sucursal',
        field: 'sucursal',
        pinned: 'left',
        maxWidth: 120,
        resizable: true,
        sortable: true,
        filter: true,
      },
      {
        headerName: 'Fecha',
        field: 'fecha',
        maxWidth: 120,
        valueFormatter: (params) =>
          this.format.formatDate(params.value.toDate()),
        sortable: true,
        filter: true,
      },
      {
        headerName: 'Nombre',
        field: 'nombre',
        sortable: true,
        filter: true,
        resizable: true,
      },
      {
        headerName: 'Tipo',
        field: 'tipo',
        width: 100,
        sortable: true,
        filter: true,
        valueGetter: (params) => params.data.tipo,
      },
      {
        headerName: 'Envio',
        field: 'envio',
        width: 100,
        sortable: true,
        filter: true,
        valueGetter: (params) => (params.data.envio ? 'ENVIO' : 'PASAN'),
      },
      {
        headerName: 'F.Pago',
        field: 'formaDePago',
        sortable: true,
        filter: true,
        valueGetter: (params) => params.data.formaDePago,
      },
      {
        headerName: 'Estatus',
        field: 'status',
        width: 140,
        sortable: true,
        filter: true,
        valueGetter: (params) => {
          if (params.data.autorizacionesRequeridas) {
            return `${params.data.status.substr(
              0,
              3
            )} (A${params.data.autorizacionesRequeridas.substr(0, 1)})`;
          } else {
            return params.data.status;
          }
        },
        onCellClicked: (params) => this.regresar.emit(params.data),
      },
      {
        headerName: 'Comentario',
        field: 'comentario',
        width: 200,
      },
      {
        headerName: 'Puesto',
        field: 'puesto',
        width: 120,
        valueGetter: (params) =>
          params.data.puesto
            ? this.format.formatDate(params.data.puesto.fecha.toDate())
            : '',
      },
      {
        headerName: 'Modificado',
        field: 'lastUpdated',
        valueFormatter: (params) =>
          this.format.formatDate(params.value.toDate(), 'dd/MM/yyyy hh:mm'),
      },
      {
        headerName: 'Creado Por:',
        field: 'vendedor',
        valueGetter: (params) => params.data.createUser,
      },
      {
        headerName: 'Modificado Por:',
        field: 'vendedor',

        valueGetter: (params) => params.data.updateUser,
      },
      {
        headerName: 'Total',
        field: 'total',
        sortable: true,
        filter: true,
        pinned: 'right',
        width: 130,
        valueFormatter: (params) => this.format.formatCurrency(params.value),
      },
      {
        headerName: 'Autorizar',
        colId: 'cerrar',
        pinned: 'right',
        width: 110,
        cellRenderer: (params) => {
          return params.data.status === 'POR_AUTORIZAR'
            ? `<ion-button fill="clear" expand="full"><ion-label>Autorizar</ion-label></ion-button>`
            : '';
        },
      },
    ];
  }
}
