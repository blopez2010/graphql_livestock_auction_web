import gql from 'graphql-tag';

export const allEvents = gql`
  query allEvents {
    allEvents {
      id
      name
      description
      createdAt
    }
  }
`;
