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
