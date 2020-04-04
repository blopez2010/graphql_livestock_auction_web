import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataReportService } from 'src/app/services/data-report.service';
import { ReportsService } from 'src/app/services/reports.service';
import { ValidateDateRange } from 'src/app/transactions/transactions/filters/validators';

@Component({
  selector: 'lsa-totals-report',
  templateUrl: './totals.component.html',
  styleUrls: ['./totals.component.scss']
})
export class TotalsComponent implements OnInit {
  public global: WebDataRocks.Report;
  public form: FormGroup;

  private readonly reportSchema = {
    dataSource: {},
    slice: {
      rows: [
        {
          caption: 'Año',
          uniqueName: 'eventDate.Year'
        },
        {
          caption: 'Monto total:',
          uniqueName: 'Measures'
        }
      ],
      columns: [
        {
          caption: 'Descripción',
          uniqueName: 'description'
        }
      ],
      measures: [
        {
          caption: 'Monto',
          uniqueName: 'total',
          format: 'currency'
        }
      ]
    },
    formats: [
      {
        name: 'currency',
        thousandsSeparator: ',',
        decimalSeparator: '',
        decimalPlaces: 0,
        maxSymbols: 20,
        currencySymbol: '¢',
        currencySymbolAlign: 'left',
        nullValue: ' ',
        infinityValue: 'Infinity',
        divideByZeroValue: 'Infinity'
      }
    ]
  };

  constructor(
    private formBuilder: FormBuilder,
    private reportService: ReportsService,
    private dataReportService: DataReportService
  ) {}

  //#region Public methods

  public toDateRangeFilter = (date: Date): boolean => {
    const fromDate = this.form.get('createdDateFrom').value;
    if (fromDate) {
      return date > (fromDate as Date);
    }

    return false;
  };

  public ngOnInit() {
    this.initForm();
    this.global = {
      localization: 'https://cdn.webdatarocks.com/loc/es.json'
    };
  }

  /**
   * search
   */
  public search() {
    this.reportService
      .getTotalsReport(
        new Date(this.form.get('createdDateFrom').value),
        new Date(this.form.get('createdDateTo').value)
      )
      .subscribe((result) => {
        const data = {
          ...this.reportSchema,
          dataSource: {
            data: result.data
          }
        };
        this.dataReportService.updateData(data);
      });
  }

  public reset() {}

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
    };
  }

  //#endregion

  //#region Private methods

  private initForm() {
    this.form = this.formBuilder.group({
      createdDateFrom: [{ value: undefined, disabled: true }, ValidateDateRange],
      createdDateTo: [{ value: undefined, disabled: true }, ValidateDateRange]
    });
  }

  //#endregion
}
