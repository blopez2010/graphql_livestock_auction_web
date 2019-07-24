import gql from 'graphql-tag';

export const allItems = gql`
  query allItems {
    allItems {
      id
      description
      event {
        id
        name
        description
        createdAt
      }
      owner {
        id
        name
      }
    }
  }
`;

export const getItemsByEvent = gql`
  query getItemsByEvent($year: Int!) {
    getItemsByEvent(year: $year) {
      id
      ordinal
      description
      event {
        id
        name
        description
        createdAt
      }
      owner {
        id
        name
      }
    }
  }
`;

export const getItemById = gql`
  fragment getItemById on Item {
    id
    name
    event {
      id
      name
      createdAt
    }
    owner {
      id
      name
    }
  }
`;
