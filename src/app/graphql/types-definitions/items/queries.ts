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

export const getItemByOrdinal = gql`
  query getItemByOrdinal($ordinal: Int!, $eventId: String!) {
    getItemByOrdinal(ordinal: $ordinal, eventId: $eventId) {
      id
      description
      owner {
        name
        nickname
      }
    }
  }
`;

export const getItemsCountDown = gql`
  query getItemsCountDown($eventId: String!) {
    getItemsCountDown(eventId: $eventId) {
      count
    }
  }
`;

export const getTotalItems = gql`
  query getTotalItems($eventId: String!) {
    getTotalItems(eventId: $eventId) {
      count
    }
  }
`;
