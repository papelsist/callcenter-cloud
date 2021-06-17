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
  RowDataUpdatedEvent,
  RowDoubleClickedEvent,
} from 'ag-grid-community';

@Component({
  selector: 'papx-cotizaciones-grid',
  template: `
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      class="ag-theme-alpine"
      [rowData]="cotizaciones"
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
export class CotizacionesGridComponent implements OnInit {
  @Input() cotizaciones: Partial<Pedido>[] = [];
  @Output() editar = new EventEmitter<any>();
  @Output() consultar = new EventEmitter<any>();
  @Output() print = new EventEmitter<any>();
  @Output() cerrar = new EventEmitter<any>();
  @Output() copiar = new EventEmitter<any>();
  @Output() showOptions = new EventEmitter<any>();

  columnDefs = this.buildColsDef();
  gridOptions: GridOptions;
  localeText = spAgGridText;
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
    params.columnApi.autoSizeAllColumns();
  }

  rowClicked(event: RowClickedEvent) {}

  rowDoubleClicked(evt: RowDoubleClickedEvent) {}

  cellClicked(evt: CellClickedEvent) {
    if (evt.column.getColId() === 'folio') {
      this.editar.emit(evt.data);
    } else {
      this.consultar.emit(evt.data);
    }
  }

  buildRowStyle(params: any) {
    if (params.node.rowPinned) {
      return { 'font-weight': 'bold' };
    }
    if (params.data.status === 'CERRADO') {
      return { 'font-weight': 'bold', 'font-style': 'italic', color: 'green' };
    }
    if (params.data.autorizacionesRequeridas) {
      if (params.data.autorizacion) {
        return {
          'font-weight': 'bold',
          'font-style': 'italic',
          color: 'var(--ion-color-primary)',
        };
      } else {
        return {
          'font-weight': 'bold',
          'font-style': 'italic',
          color: 'var(--ion-color-warning)',
        };
      }
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
        headerName: 'Total',
        field: 'total',
        sortable: true,
        filter: true,
        valueFormatter: (params) => this.format.formatCurrency(params.value),
      },
      {
        headerName: 'Estatus',
        field: 'status',
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
      },
      {
        headerName: 'Comentario',
        field: 'comentario',
        width: 200,
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
      /*
      {
        headerName: 'Copiar',
        colId: 'copiar',
        minWidth: 80,
        maxWidth: 80,
        cellRendererFramework: IconRendererComponent,
        cellRendererParams: {
          name: 'copy',
          color: 'warning',
          callback: (event: Event, data: any) => {
            this.copiar.emit(data);
          },
        },
      },
      */
      {
        headerName: 'Cerrar',
        colId: 'cerrar',
        pinned: 'right',
        minWidth: 80,
        maxWidth: 80,
        cellRendererFramework: IconRendererComponent,
        cellRendererParams: {
          name: 'download',
          color: 'success',
          callback: (event: Event, data: any) => {
            this.cerrar.emit(data);
          },
        },
      },
      {
        headerName: 'P',
        colId: 'print',
        cellRendererFramework: IconRendererComponent,
        pinned: 'right',
        minWidth: 80,
        maxWidth: 80,
        cellRendererParams: {
          name: 'print',
          color: 'primary',
          callback: (event: Event, data: any) => {
            this.print.emit(data);
          },
        },
      },
    ];
  }
}
