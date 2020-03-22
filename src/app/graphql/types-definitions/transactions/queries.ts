import gql from 'graphql-tag';

export const getTotalAmountByEvent = gql`
  query getTotalAmountByEvent($eventId: String!) {
    getTotalsByEvent(eventId: $eventId) {
      total
    }
  }
`;

export const getTransactionsPaginated = gql`
  query allTransactionsPaginated($input: TransactionPaginationInput!) {
    allTransactionsPaginated(input: $input) {
      transactions {
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
      totalCount
    }
  }
`;

export const getTransactionsPaginatedById = gql`
  fragment allTransactionsPaginated on TransactionPaginationResultPayload {
    transactions {
      paymentMethod
      paymentReference
      paymentDate
    }
  }
`;

export const getTransactionsBuyersReport = gql`
	query getTransactionsBuyersReport($eventId:String!) {
		getTransactionsBuyersReport(eventId:$eventId) {
			id
			eventId
			eventName
			eventDate
			itemOrdinal
			ownerId
			ownerName
			ownerNickname
			buyerId
			buyerName
			buyerNickname
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
	}
`

export const getDonorsReport = gql`
	query getDonorsReport($eventId:String!) {
    getDonorsReport(eventId:$eventId){
      id
      itemOrdinal
      itemDescription
      ownerName
      ownerNickname
      ownerPhoneNumber
      ownerAddress
    }
  }
`