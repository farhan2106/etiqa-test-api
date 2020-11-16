import { Component, Input, OnInit } from '@angular/core';
import * as queryString from 'query-string';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.styl']
})
export class DataTableComponent implements OnInit {

  @Input() rows: any[] = [];
  @Input() currentPage = 1;
  @Input() totalPage: number | undefined = 0;
  @Input() handleEdit: any
  @Input() handleRemove: any
  @Input() handleNavigate: any

  constructor() { }

  ngOnInit(): void {
  }

}
