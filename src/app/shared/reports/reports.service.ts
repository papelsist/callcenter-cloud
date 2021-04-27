import { Injectable } from '@angular/core';
import { FormatService } from '@papx/core';
import { Pedido, User } from '@papx/models';
import firebase from 'firebase/app';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({ providedIn: 'root' })
export class ReportsService {
  constructor(private format: FormatService) {}

  async imprimirPedido(pedido: Partial<Pedido>, user: User) {
    console.log('Imprimiendo pedido: ', pedido);
    const { cliente, fecha } = pedido;
    let sfecha: any = fecha;
    if (sfecha instanceof firebase.firestore.Timestamp) {
      sfecha = (sfecha as firebase.firestore.Timestamp).toDate().toISOString();
    }
    const logo = await this.getPapelLogo();
    const tableHeader = [
      { text: 'Cant', style: 'tableHeader' },
      { text: 'Descripción', style: 'tableHeader' },
      { text: 'Kg', style: 'tableHeader' },
      { text: 'g', style: 'tableHeader' },
      { text: 'Uni', style: 'tableHeader' },
      { text: 'Precio', style: 'tableHeader' },
      { text: 'Importe', style: 'tableHeader' },
      { text: 'Cortes', style: 'tableHeader' },
      { text: 'Instrucción', style: 'tableHeader' },
    ];
    const tableRows = [
      [...tableHeader],
      ...pedido.partidas.map((item) => {
        const {
          cantidad,
          descripcion,
          precio,
          subtotal,
          unidad,
          kilos,
          gramos,
          corte,
          modoVenta,
        } = item;
        let cc = '';
        let ins = '';
        if (corte) {
          cc = `${corte.cantidad} X ${corte.precio}`;
          ins = corte.instruccion;
        }
        const srow = `${
          modoVenta === 'N' ? '*' : ''
        } ${this.format.formatNumber(cantidad)}`;
        return [
          srow,
          descripcion,
          kilos,
          gramos,
          unidad.toUpperCase(),
          this.format.formatCurrency(precio),
          this.format.formatCurrency(subtotal),
          cc,
          ins,
        ];
      }),
    ];
    const docDefinition = {
      footer: (currentPage, pageCount) => {
        return {
          columns: [
            {
              text: `Generado por: ${user.displayName}`,
              alignment: 'left',
              style: 'pageFooter',
              with: '*',
            },
            {
              text: `Página: ${currentPage.toString()} de ${pageCount}`,
              alignment: 'center',
              style: 'pageFooter',
              width: '50%',
            },
            {
              text: `Fecha: ${this.format.formatDate(
                new Date(),
                'dd/MM/yyyy HH:mm'
              )}`,
              alignment: 'right',
              style: 'pageFooter',
              with: '*',
            },
          ],
        };
        // return currentPage.toString() + ' de ' + pageCount;
      },

      pageSize: 'LETTER',
      pageMargins: [20, 20, 20, 20],
      // watermark: { text: 'PapelWS Callcenter', fontSize: 20 },
      background: {
        image: logo,
        width: 110,
        margin: [40, 20, 0, 0],
      },
      content: [
        { text: 'PAPEL S.A. de C.V.', style: 'header' },
        {
          text: 'Solicitud de venta (PEDIDO) CallCenter - BOLIVAR',
          style: 'subheader',
        },
        this.buildParaametrosRow(pedido),
        {
          style: 'tableExample',
          layout: 'lightHorizontalLines',
          // layout: {
          //   fillColor: function (rowIndex, node, columnIndex) {
          //     return rowIndex % 2 === 0 ? '#CCCCCC' : null;
          //   },
          // },
          table: {
            headerRows: 1,
            // heights: 15,
            widths: [
              35,
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              '*',
            ],
            body: tableRows,
          },
        },
        this.buildInfoSection(pedido),
      ],
      pageBreakBefore: function (
        currentNode,
        followingNodesOnPage,
        nodesOnNextPage,
        previousNodesOnPage
      ) {
        return (
          currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0
        );
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 0],
          alignment: 'right',
        },
        subheader: {
          fontSize: 14,
          bold: true,
          italics: true,
          alignment: 'right',
          margin: [0, 5, 0, 5],
        },
        info: {
          fontSize: 14,
        },
        tableExample: {
          margin: [0, 5, 0, 15],
          fontSize: 9,
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: 'black',
        },
        pageFooter: {
          fontSize: 10,
          margin: [10, 5, 10, 5],
        },
      },
      defaultStyle: {
        // alignment: 'justify'
      },
      images: {
        logo: 'assets/images/papel-logo.jpg',
      },
    };

    pdfMake.createPdf(docDefinition).open();
  }

  async getPapelLogo(): Promise<string> {
    const jpgImageBytes = await fetch(
      'assets/images/papel-logo.jpg'
    ).then((res) => res.arrayBuffer());
    const base64 = this.arrayBufferToBase64(jpgImageBytes);
    const res = 'data:image/jpg;base64,' + base64;
    return res;
  }

  arrayBufferToBase64(buffer: ArrayBuffer): string {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  buildParaametrosRow(pedido: Partial<Pedido>) {
    const { cliente, fecha } = pedido;
    let sfecha: any = fecha;
    if (sfecha instanceof firebase.firestore.Timestamp) {
      sfecha = (sfecha as firebase.firestore.Timestamp).toDate().toISOString();
    }
    return [
      {
        columns: [
          {
            width: '50%',
            alignment: 'left',
            columns: [
              { text: 'Clave:', width: '20%', fontSize: 12 },
              {
                text: cliente.clave,
                alignment: 'left',
                fontSize: 12,
                bold: true,
              },
            ],
          },
          {
            width: '50%',
            alignment: 'right',
            columns: [
              { text: 'Documento:', fontSize: 12, alignment: 'right' },
              {
                text: pedido.folio,
                width: '25%',
                alignment: 'right',
                fontSize: 12,
                bold: true,
                decoration: 'underline',
                italics: true,
              },
            ],
          },
        ],
      },
      {
        columns: [
          {
            width: '50%',
            alignment: 'left',
            columns: [
              { text: 'Nombre:', width: '20%', fontSize: 12 },
              {
                text: 'LARA IBARRA FRANCISCO',
                alignment: 'left',
                fontSize: 12,
                bold: true,
              },
            ],
          },
          {
            width: '50%',
            alignment: 'right',
            columns: [
              { text: 'Forma de entrega:', fontSize: 12, alignment: 'right' },
              {
                text: pedido.envio ? 'ENVIO' : 'LOCAL',
                width: '25%',
                alignment: 'right',
                fontSize: 12,
                bold: true,
              },
            ],
          },
        ],
      },
      {
        columns: [
          {
            width: '50%',
            alignment: 'left',
            columns: [
              { text: 'Calle:', width: '20%', fontSize: 12 },
              {
                text: 'NORTE 76 A 5424',
                alignment: 'left',
                fontSize: 12,
                bold: true,
              },
            ],
          },
          {
            width: '50%',
            alignment: 'right',
            columns: [
              { text: 'Tipo:', fontSize: 12, alignment: 'right' },
              {
                text: 'COD',
                width: '25%',
                alignment: 'right',
                fontSize: 12,
                bold: true,
              },
            ],
          },
        ],
      },
      {
        columns: [
          {
            width: '50%',
            alignment: 'left',
            columns: [
              { text: 'Colonia:', width: '20%', fontSize: 12 },
              {
                text: 'AMP. EMILIANO ZAPAT C.P: 07858',
                alignment: 'left',
                fontSize: 12,
                bold: true,
              },
            ],
          },
          {
            width: '50%',
            alignment: 'right',
            columns: [
              { text: 'Fecha:', fontSize: 12, alignment: 'right' },
              {
                text: this.format.formatDate(sfecha),
                width: '25%',
                alignment: 'right',
                fontSize: 12,
                bold: true,
              },
            ],
          },
        ],
      },
      {
        columns: [
          {
            width: '50%',
            alignment: 'left',
            columns: [
              { text: 'Delegación:', width: '25%', fontSize: 12 },
              {
                text: 'Gustavo A. Madero',
                alignment: 'left',
                fontSize: 12,
                bold: true,
              },
            ],
          },
        ],
      },
      {
        columns: [
          {
            width: '50%',
            alignment: 'left',
            columns: [
              { text: 'Teléfonos:', width: '25%', fontSize: 12 },
              {
                text: '[5751-2119]',
                alignment: 'left',
                fontSize: 12,
                bold: true,
              },
            ],
          },
        ],
      },
    ];
  }

  buildInfoSection(pedido: Partial<Pedido>) {
    return [
      {
        // % width
        width: '100%',
        text: 'Comentarios',
        table: {
          widths: ['auto', '*'],
          headerRows: 1,

          body: [['Comentarios:', pedido.comentario]],
        },
      },
      {
        text: `** = Precio neto. Los demas productos tienen el ${pedido.descuento} % en pago: EFECTIVO`,
        margin: [0, 5, 0, 2],
      },
      {
        text: 'Kilos: ' + pedido.kilos,
      },
      {
        text: 'Elaboro: ' + pedido.createUser,
      },
      {
        columns: [
          {
            stack: [
              {
                text: 'Entregar en:',
                alignment: 'start',
                margin: [0, 5],
              },
              this.buildEntregaSection(pedido),
            ],
            fontSize: 12,
            alignment: 'left',
            width: '50%',
          },
          {
            stack: [
              { text: 'Subtotal 1:', margin: [0, 0, 0, 2] },
              { text: 'Descuento :', margin: [0, 0, 0, 2] },
              { text: 'Subtotal  :', margin: [0, 0, 0, 2] },
              { text: 'IVA:', margin: [0, 0, 0, 2] },
              { text: 'Total: ', margin: [0, 0, 0, 2] },
            ],
            fontSize: 12,
            alignment: 'right',
            width: '30%',
          },
          {
            stack: [
              {
                text: this.format.formatCurrency(pedido.importe),
                margin: [0, 0, 0, 2],
              },
              {
                text: this.format.formatCurrency(pedido.descuentoImporte),
                margin: [0, 0, 0, 2],
              },
              {
                text: this.format.formatCurrency(pedido.subtotal),
                margin: [0, 0, 0, 2],
              },
              {
                text: this.format.formatCurrency(pedido.impuesto),
                margin: [0, 0, 0, 2],
              },
              {
                text: this.format.formatCurrency(pedido.total),
                margin: [0, 0, 0, 2],
              },
            ],
            fontSize: 12,
            margin: [0, 0, 0, 2],
            alignment: 'right',
          },
        ],
      },
    ];
  }

  buildEntregaSection(pedido: Partial<Pedido>) {
    const { envio } = pedido;
    if (!envio) return '';
    const text = `${envio.direccion.calle} # ${envio.direccion.numeroExterior},
        ${envio.direccion.colonia},
        ${envio.direccion.municipio}, ${envio.direccion.estado}
        CP: ${envio.direccion.codigoPostal}
      `;
    const { tipo, contacto, horario, telefono } = envio;
    const extras = `Tipo: ${tipo} Contacto: ${contacto ?? 'ND'}
      Horario: ${horario ?? ''} Tel: ${telefono ?? 'ND'}`;

    return [
      { text, fontSize: 10, italics: true, bold: true, margin: [0, 2] },
      {
        text: extras,
        fontSize: 10,
        italics: false,
        bold: false,
        margin: [0, 5],
      },
    ];
  }
}
