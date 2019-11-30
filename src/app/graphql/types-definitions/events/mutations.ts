import gql from 'graphql-tag';

export const createEvent = gql`
  mutation createEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      data {
        id
        name
        description
        startDate
        endDate
      }
      error {
        message
        status
      }
    }
  }
`;

export const updateEvent = gql`
  mutation updateEvent($id: String!, $input: UpdateEventInput!) {
    updateEvent(id: $id, input: $input) {
      id
      name
      description
      startDate
      endDate
      updatedAt
    }
  }
`;

export const updateEventById = gql`
  fragment updateEventById on Event {
    name
    description
    startDate
    endDate
  }
`;

export const deleteEvent = gql`
  mutation deleteEvent($id: String!) {
    deleteEvent(id: $id) {
      data {
        id
        name
        startDate
        endDate
      }
      error {
        message
        status
      }
    }
  }
`;
