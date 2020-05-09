import gql from 'graphql-tag';

export const itemAdded = gql`
  subscription itemAdded {
    itemAdded {
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
