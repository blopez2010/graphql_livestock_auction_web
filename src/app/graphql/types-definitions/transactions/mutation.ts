import gql from 'graphql-tag';

export const createTransaction = gql`
  mutation createTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      data {
        id
      }
      error {
        message
        status
      }
    }
  }
`;
