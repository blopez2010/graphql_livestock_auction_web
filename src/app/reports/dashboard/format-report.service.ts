import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { PaymentMethods } from 'src/app/models';

@Injectable({
  providedIn: 'root'
})
export class FormatReportService {

constructor() { }

public formatData(data: any) {
  const reportData = {
    data: data.data.map((d) => {
      let newData = {...d};
      newData = {
        ...newData,
        itemOrdinal: this.appendOrdinalData(d),
        buyerName: this.appendBuyersData(d)
      };

      return {
        ...newData
      };
    })
  }
  return reportData;
}

private appendBuyersData(d: any) {
  const buyers = [d.buyerName];
  if (d.buyerNickname) {
    buyers.push(d.buyerNickname);
  }

  if (d.buyerPhoneNumber) {
    buyers.push(d.buyerPhoneNumber);
  }

  if (d.buyerAddress) {
    buyers.push(d.buyerAddress);
  }

  return buyers.join(' - ');
}

private appendOrdinalData(d: any) {
  const itemOrdinalDescriptions = [d.itemOrdinal];
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

  return itemOrdinalDescriptions.join(' - ');
}

}
