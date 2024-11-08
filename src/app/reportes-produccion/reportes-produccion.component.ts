import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reportes-produccion',
  templateUrl: './reportes-produccion.component.html',
  styleUrls: ['./reportes-produccion.component.css']
})
export class ReportesProduccionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    history.pushState(null, '', location.href);
    window.onpopstate = () => {
      history.pushState(null, '', location.href);
    };
  }
  

  

}
