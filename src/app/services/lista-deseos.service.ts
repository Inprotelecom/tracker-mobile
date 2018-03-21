import { Injectable } from '@angular/core';
import {Lista} from '../clases/lista';

@Injectable()
export class ListaDeseosService {
  listas:Lista[]=[];

  constructor() {
    let lista1=new Lista("Compras de supermercado");
    let lista2=new Lista("Lista de videojuego");
    let lista3=new Lista("Lista de Cursos");
    console.log("Servicio Inicializado");

    this.listas.push(lista1);
    this.listas.push(lista2);
    this.listas.push(lista3);

   }
}
