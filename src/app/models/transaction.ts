export interface Transaction {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  itemOrdinal: number;
  ownerId: string;
  ownerName: string;
  buyerId: string;
  buyerName: string;
  description: string;
  amount: number;
  isDonated: boolean;
  isPayed: boolean;
  isLastBuyer: boolean;
  paymentMethod: null;
  paymentReference: null;
  paymentDate: Date;
  transactionCreatedAt: Date;
}
