import gql from 'graphql-tag';

export const createItem = gql`
  mutation createItem($input: CreateItemInput!) {
    createItem(input: $input) {
      data {
        id
        event {
          id
          name
          description
          createdAt
          updatedAt
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
          updatedAt
        }
        createdAt
        updatedAt
      }
      error {
        message
        status
      }
    }
  }
`;

export const updateItemById = gql`
  fragment updateItemById on Item {
    id
    event {
      id
      name
      description
      createdAt
      updatedAt
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
      updatedAt
    }
    createdAt
    updatedAt
  }
`;

export const updateItem = gql`
  mutation updateItem($id: String!, $input: UpdateItemInput!) {
    updateItem(id: $id, input: $input) {
      id
      event {
        id
        name
        description
        createdAt
        updatedAt
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
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
