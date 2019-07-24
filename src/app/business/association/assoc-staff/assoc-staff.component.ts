import { Component, OnInit } from '@angular/core';
import {AssocStaffService} from '../../../common/services/assoc-staff.service';

@Component({
  selector: 'rbi-assoc-staff',
  templateUrl: './assoc-staff.component.html',
  styleUrls: ['./assoc-staff.component.less']
})
export class AssocStaffComponent implements OnInit {

  constructor(
    private assocStaffSrv: AssocStaffService
  ) { }

  ngOnInit() {
  }

}
