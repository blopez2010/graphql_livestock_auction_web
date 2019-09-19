import gql from 'graphql-tag';

export const getTotalAmountByEvent = gql`
  query getTotalAmountByEvent($eventId: String!) {
    getTotalsByEvent(eventId: $eventId) {
      total
    }
  }
`;
