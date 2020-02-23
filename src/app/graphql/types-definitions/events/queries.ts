import gql from 'graphql-tag';

export const allEvents = gql`
  query allEvents {
    allEvents {
      id
      name
      description
      startDate
      endDate
      createdAt
    }
  }
`;

export const getActiveEvent = gql`
  query getActiveEvent {
    getActiveEvent {
      id
      name
      description
      createdAt
    }
  }
`;
