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
      externalIdentifier
      event {
        id
        name
        description
        createdAt
      }
      owner {
        id
        name
        nickname
        phoneNumber
        externalIdentifier
        address
        isBanned
        bannedDescription
        createdAt
      }
    }
  }
`;

export const getItemById = gql`
  fragment getItemById on Item {
    id
    event {
      id
      name
      description
      createdAt
    }
    ordinal
    description
    externalIdentifier
    owner {
      id
      name
      nickname
      phoneNumber
      externalIdentifier
      address
      isBanned
      bannedDescription
      createdAt
    }
  }
`;
