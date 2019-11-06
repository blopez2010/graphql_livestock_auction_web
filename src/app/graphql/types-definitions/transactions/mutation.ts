import gql from 'graphql-tag';

export const createTransaction = gql`
  mutation createTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      data {
        id
      }
      error {
        message
        status
      }
    }
  }
`;

export const payTransaction = gql`
  mutation payTransaction(
    $id: String!
    $paymentDate: Date!
    $paymentMethod: PaymentMethods!
    $paymentReference: String
  ) {
    payTransaction(
      id: $id
      input: {
        paymentDate: $paymentDate
        paymentMethod: $paymentMethod
        paymentReference: $paymentReference
      }
    ) {
      id
      paymentMethod
      paymentReference
      paymentDate
    }
  }
`;

export const updatePaymentInfo = gql`
  fragment updatePaymentInfo on Transaction {
    id
    eventId
    eventName
    eventDate
    itemOrdinal
    ownerId
    ownerName
    buyerId
    buyerName
    description
    amount
    isDonated
    isPayed
    isLastBuyer
    paymentMethod
    paymentReference
    paymentDate
    transactionCreatedAt
  }
`;
