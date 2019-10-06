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

export const allPeoplePaginated = gql`
	query allPeoplePaginated($input: PeoplePaginationInput!) {
		allPeoplePaginated(input: $input) {
			people {
				id
				name
				nickname
			}
			totalCount
			offset
			limit
		}
	}
`;
