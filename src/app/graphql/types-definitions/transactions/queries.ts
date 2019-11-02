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
