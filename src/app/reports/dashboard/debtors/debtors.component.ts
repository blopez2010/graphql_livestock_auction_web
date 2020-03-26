import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DataReportService } from 'src/app/services/data-report.service';
import { ReportsService } from 'src/app/services/reports.service';

import { FormatReportService } from '../format-report.service';

@Component({
  selector: 'lsa-debtors-report',
  templateUrl: './debtors.component.html',
  styleUrls: ['./debtors.component.scss']
})
export class DebtorsComponent implements OnInit {
  public global: WebDataRocks.Report;
  public searchForm: FormGroup;
  public events: Event[];


  private readonly reportSchema = {
    'dataSource': {},
    'slice': {
      'rows': [
        {
          'caption': 'Deudor',
          'uniqueName': 'buyerName',
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
          'caption': 'Monto',
          'uniqueName': 'amount',
          'aggregation': 'sum',
          'format': 'currency'
        },
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
        'name': 'currency',
        'thousandsSeparator': ',',
        'decimalSeparator': '.',
        'decimalPlaces': 2,
        'maxSymbols': 20,
        'currencySymbol': '¢',
        'currencySymbolAlign': 'left',
        'nullValue': ' ',
        'infinityValue': 'Infinity',
        'divideByZeroValue': 'Infinity'
      },
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
    private dataReportService: DataReportService,
    private formatReportService: FormatReportService
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
  public selectedEventChange(eventId) {
    this.reportService.getDebtorsReport(eventId).subscribe((result) => {
      this.dataReportService.updateData({
        ...this.reportSchema,
        dataSource: this.formatReportService.formatData(result)
      });
    });
  }
}
