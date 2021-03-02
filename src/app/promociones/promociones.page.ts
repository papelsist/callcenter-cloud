import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promociones',
  templateUrl: './promociones.page.html',
  styleUrls: ['./promociones.page.scss'],
})
export class PromocionesPage implements OnInit {
  promos = [
    {
      id: '82738',
      name: 'Bond Reciclados',
      periodo: 'Todo Mrzo',
      descripcion: 'Todos los productos Bond Reciclados con 30% de descuento',
      link:
        'https://firebasestorage.googleapis.com/v0/b/papx-ws-dev.appspot.com/o/productos-images%2Fbond%20reciclados2.jpg?alt=media&token=e3b963c7-b412-46fc-a270-8f4a0ea58e96',
    },
    {
      id: '827309',
      name: 'Bond Cortados',
      periodo: 'Todo Mrzo',
      descripcion:
        'Todos los productos Bond Cortados 5% adicional en precio de contado',
      link:
        'https://firebasestorage.googleapis.com/v0/b/papx-ws-dev.appspot.com/o/productos-images%2Fbond-cortados.jpg?alt=media&token=94ff114d-c197-465d-84e8-ee1f0a955c05',
    },
    {
      id: '8273011',
      name: 'Bristol',
      periodo: 'Todo Mrzo',
      descripcion:
        'Toda la línea Bristol con el 10% adicional en compras de contado',
      link:
        'https://firebasestorage.googleapis.com/v0/b/papx-ws-dev.appspot.com/o/productos-images%2Fbristol.jpg?alt=media&token=d368d56d-29f8-4b9a-95dd-f18db2a39062',
    },
    {
      id: '8273014',
      name: 'Cajas de cartón',
      periodo: 'Todo Mrzo',
      descripcion:
        'Toda la línea cajas de carton para empaque con precios del 2020',
      link:
        'https://firebasestorage.googleapis.com/v0/b/papx-ws-dev.appspot.com/o/productos-images%2Fcajas-carton.jpg?alt=media&token=9167eeb0-b740-4df8-ab93-29e718e7f9dc',
    },
  ];

  constructor() {}

  ngOnInit() {}
}
