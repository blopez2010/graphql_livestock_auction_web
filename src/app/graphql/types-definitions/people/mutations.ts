import gql from 'graphql-tag';

export const createPeople = gql`
  mutation createPeople($input: CreatePeopleInput!) {
    createPeople(input: $input) {
      data {
        id
        name
        nickname
        phoneNumber
        externalIdentifier
        address
        isBanned
        bannedDescription
      }
      error {
        message
        status
      }
    }
  }
`;

export const updatePeople = gql`
  mutation updatePeople($id: String!, $input: UpdatePeopleInput!) {
    updatePeople(id: $id, input: $input) {
      id
      name
      nickname
      phoneNumber
      externalIdentifier
      address
      isBanned
      bannedDescription
      updatedAt
    }
  }
`;

export const updatePeopleById = gql`
  fragment updatePeopleById on People {
    name
    nickname
    phoneNumber
    externalIdentifier
    address
    isBanned
    bannedDescription
  }
`;
