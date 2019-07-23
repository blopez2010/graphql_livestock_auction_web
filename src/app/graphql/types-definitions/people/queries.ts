import gql from 'graphql-tag';

export const allPeople = gql`
  query allPeople {
    allPeople {
      id
      name
      nickname
      phoneNumber
      externalIdentifier
      address
      isBanned
      bannedDescription
    }
  }
`;

export const getPeopleById = gql`
  fragment getPeopleById on People {
    id
    name
    nickname
    phoneNumber
    externalIdentifier
    address
    isBanned
    bannedDescription
  }
`;
