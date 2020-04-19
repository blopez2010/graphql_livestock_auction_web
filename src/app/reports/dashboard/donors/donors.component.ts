import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { PaymentMethods } from 'src/app/models';
import { DataReportService } from 'src/app/services/data-report.service';
import { ReportsService } from 'src/app/services/reports.service';
import { WebDataRocksPivot } from 'src/app/webdatarocks/webdatarocks.angular4';

@Component({
  selector: 'lsa-donors-report',
  templateUrl: './donors.component.html',
  styleUrls: ['./donors.component.scss']
})
export class DonorsComponent implements OnInit {
  public global: WebDataRocks.Report;
  public searchForm: FormGroup;
  public events: Event[];

  @ViewChild('pivot1', { static: false }) public child: WebDataRocksPivot;

  private readonly reportSchema = {
    'dataSource': {},
    'slice': {
      'rows': [
        {
          'caption': 'Donador',
          'uniqueName': 'ownerName',
          'sort': 'asc'
        },
        {
          'caption': '# ítem',
          'uniqueName': 'itemOrdinal',
          'sort': 'asc'
        }
      ],
      'measures': [
        {
          'caption': 'ítem',
          'uniqueName': 'itemOrdinal',
          'aggregation': 'count',
          'format': 'quantity'
        }
      ],
      'expands': {
        'expandAll': true,
      },
      'options': {
        'grid': {
          'type': 'compact',
          'title': '',
          'showFilter': true,
          'showHeaders': true,
          'showTotals': true,
          'showGrandTotals': 'on',
          'showHierarchies': true,
          'showHierarchyCaptions': true,
          'showReportFiltersArea': true
        },
        'configuratorActive': false,
        'configuratorButton': true,
        'showAggregations': true,
        'showCalculatedValuesButton': true,
        'showDrillThroughConfigurator': true,
        'sorting': 'on',
        'datePattern': 'dd/MM/yyyy',
        'dateTimePattern': 'dd/MM/yyyy HH:mm:ss',
        'saveAllFormats': false,
        'showDefaultSlice': true,
        'defaultHierarchySortName': 'asc'
      }
    },
    'formats': [
      {
        'name': 'quantity',
        'thousandsSeparator': ',',
        'decimalSeparator': '',
        'decimalPlaces': 0,
        'maxSymbols': 20,
        'currencySymbol': '',
        'currencySymbolAlign': 'left',
        'nullValue': ' ',
        'infinityValue': 'Infinity',
        'divideByZeroValue': 'Infinity'
      }
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private reportService: ReportsService,
    private dataReportService: DataReportService
  ) { }

  public ngOnInit() {
    this.searchForm = this.formBuilder.group({
      eventId: '',
      event: '',
      filter: ''
    });
    this.events = this.route.data['value']['events'];
    this.global = {
      localization: 'https://cdn.webdatarocks.com/loc/es.json'
    };
  }

  /**
  * customizeToolbar
  */
  // TODO: Do this in the respective component
  public customizeToolbar(toolbar) {
    const tabs = toolbar.getTabs();
    toolbar.getTabs = () => {
      delete tabs[0];
      delete tabs[1];
      delete tabs[2];
      // delete tabs[5];
      delete tabs[6];
      return tabs;
    }
  }

  /**
   * selectedEventChange
   */
  public selectedEventChange(event) {
    this.reportService.getDonorsReport(event.id).subscribe((result) => {
      const data = {
        ...this.reportSchema,
        dataSource: {
          data: result.data.map((r) => {
            const donors = [r.ownerName];

            if (r.ownerNickname) {
              donors.push(r.ownerNickname);
            }

            if (r.ownerPhoneNumber) {
              donors.push(r.ownerPhoneNumber);
            }

            if (r.ownerAddress) {
              donors.push(r.ownerAddress);
            }

            if (r.itemDescription) {
              r.itemOrdinal = `${r.itemOrdinal} - ${r.itemDescription}`
            }

            return {
              ...r,
              ownerName: donors.join(' - ')
            }
          })
        },

      };
      this.dataReportService.updateData(data);
    });
  }
}
