import { Component } from '@angular/core';

@Component({
  selector: 'subproductos',
  templateUrl: './subproductos.component.html',
  styleUrls: ['./subproductos.component.css']
})
export class SubproductosComonent {

  constructor() { }

  ngOnInit() {
    history.pushState(null, '', location.href);
    window.onpopstate = () => {
      history.pushState(null, '', location.href);
    };
  }
  
}
