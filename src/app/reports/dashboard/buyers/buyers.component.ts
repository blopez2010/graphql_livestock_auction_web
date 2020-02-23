import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { DataReportService } from 'src/app/services/data-report.service';
import { ReportsService } from 'src/app/services/reports.service';

import { Event, PaymentMethods } from '../../../models';

@Component({
  selector: 'lsa-buyers-report',
  templateUrl: './buyers.component.html',
  styleUrls: ['./buyers.component.scss']
})
export class BuyersComponent implements OnInit {
  public global: WebDataRocks.Report;
  public searchForm: FormGroup;
  public events: Event[];


  private readonly reportSchema = {
    'dataSource': {},
    'slice': {
      'rows': [
        {
          'caption': 'Comprador',
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
  public selectedEventChange(eventId) {
    this.reportService.getBuyersReport(eventId).subscribe((result) => {
      this.dataReportService.updateData({
        ...this.reportSchema,
        dataSource: this.formatData(result)
      });
    });
  }

  private formatData(data: any) {
    const reportData = {
      data: data.data.map((d) => {
        const itemOrdinalDescriptions = [d.itemOrdinal];
        let buyerName = d.buyerName;
        if (d.buyerNickname) {
          buyerName = `${d.buyerName} (${d.buyerNickname})`;
        }
        if (d.isDonated) {
          itemOrdinalDescriptions.push('Fue donado');
        }
        if (d.isLastBuyer) {
          itemOrdinalDescriptions.push('Ultimo comprador');
        }
        if (d.isPayed) {
          itemOrdinalDescriptions.push('Está pago');
          if (d.paymentMethod) {
            switch (d.paymentMethod) {
              case PaymentMethods.CASH:
                itemOrdinalDescriptions.push('Método de pago: Efectivo');
                break;
              case PaymentMethods.DEPOSIT:
                itemOrdinalDescriptions.push('Método de pago: Depósito');
                break;
              default:
                itemOrdinalDescriptions.push('Método de pago: Cheque');
                break;
            }
          }
          if (d.paymentReference) {
            itemOrdinalDescriptions.push(`Referencia : ${d.paymentReference}`);
          }
          if (d.paymentDate) {
            itemOrdinalDescriptions.push(`Fecha de pago: ${moment(d.paymentDate).format('DD-MM-YYYY HH:MM')}`);
          }
        }
        if (d.description) {
          itemOrdinalDescriptions.push(d.description);
        }

        d.itemOrdinal = itemOrdinalDescriptions.join(' - ');

        return {
          ...d
        };
      })
    }
    return reportData;
  }
}
