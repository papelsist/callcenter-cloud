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
import { formatCurrency, formatNumber } from '@angular/common';

import { spAgGridText } from '@papx/utils';

import { timer } from 'rxjs';
import { differenceInMinutes } from 'date-fns';
import { formatDistanceToNow } from 'date-fns';
import { differenceInHours } from 'date-fns';
import { es } from 'date-fns/locale';

import { Pedido } from '@papx/models';

import { VentaAcumulada } from '../../models/venta-acumuladas';

@Component({
  selector: 'papx-ventas-acumuladas-grid',
  template: `
    <ag-grid-angular
      #agGrid
      class="ag-theme-alpine"
      style="width: 100%; height: 450px;"
      [rowData]="ventas"
      [gridOptions]="gridOptions"
      [defaultColDef]="defaultColDef"
      [localeText]="localeText"
      (gridReady)="onGridReady($event)"
      (modelUpdated)="onModelUpdated($event)"
      (rowDoubleClicked)="onDoubleClick($event)"
      (firstDataRendered)="onFirstDataRendered($event)"
      rowSelection="single"
    >
    </ag-grid-angular>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VentasAcumuladasGridComponent implements OnInit {
  @Input() ventas: VentaAcumulada[] = [];
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
    this.gridOptions.getRowStyle = this.buildRowStyle;
    this.gridOptions.rowHeight = 35;
  }

  buildRowStyle(params: any) {
    if (params.node.rowPinned) {
      return { 'font-weight': 'bold' };
    }
    return {};
  }

  onDoubleClick(event: RowDoubleClickedEvent) {
    this.selected.emit(event.data);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onFirstDataRendered(params) {
    this.gridApi.sizeColumnsToFit();
    this.actualizarTotales();
  }

  onModelUpdated(event) {
    if (this.gridApi) {
      this.actualizarTotales();
      // this.actualizarSeleccion();
    }
  }

  exportToCsv() {
    this.gridOptions.api.exportDataAsCsv({
      fileName: `AcumuladoMensual_${new Date().getMinutes()}.csv`,
      skipColumnGroupHeaders: false,
    });
  }

  actualizarTotales() {
    const totales = {
      total: 0.0,
      kilos: 0.0,
    };
    if (this.gridApi) {
      this.gridApi.forEachNodeAfterFilter(({ data }, index) => {
        Object.keys(totales).forEach((key) => {
          const v = data[key];
          if (v && typeof v === 'number') {
            totales[key] += v;
          }
        });
      });
    }
    const res = [
      {
        ...totales,
      },
    ];
    if (this.gridApi) {
      this.gridApi.setPinnedBottomRowData(res);
    }
  }

  private buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'Eje',
        field: 'ejercicio',
        width: 100,
        pinned: 'left',
        wrapText: true,
      },
      {
        headerName: 'Mes',
        field: 'mes',
        width: 100,
        pinned: 'left',
        wrapText: true,
      },
      {
        headerName: 'Sucursal',
        field: 'sucursal',
        width: 110,
        pinned: 'left',
        wrapText: true,
      },
      {
        headerName: 'Vendedor',
        field: 'vendedor',
        width: 130,
        wrapText: true,
      },
      {
        headerName: 'Tipo',
        field: 'tipo',
      },
      {
        headerName: 'Facturas',
        field: 'facturas',
      },
      {
        headerName: 'Total',
        field: 'total',
        width: 140,
        valueFormatter: ({ value }) => this.transformCurrency(value),
      },
      {
        headerName: 'Kilos',
        field: 'kilos',
        valueFormatter: ({ value }) => this.transformNumber(value),
      },
    ];
  }

  transformCurrency(data: any) {
    return formatCurrency(data, this.locale, '$');
  }
  transformNumber(data: any) {
    return formatNumber(data, this.locale, '1.1-3');
  }
}
