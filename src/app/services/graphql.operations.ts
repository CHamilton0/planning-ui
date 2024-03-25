import { gql } from 'apollo-angular';

const GET_DAY = gql`
  query Day($day: DateTime) {
    day(day: $day) {
      day
      items {
        name
        hours
      }
    }
  }
`;

const GET_GOALS = gql`
  query Goals {
    goals {
      hours
      name
    }
  }
`;

const SET_DAY_ITEMS = gql`
  mutation SetDayItems($day: DateTime, $items: [ItemInput!]!) {
    setDayItems(day: $day, items: $items) {
      day
      items {
        hours
        name
      }
    }
  }
`;

export { GET_DAY, GET_GOALS, SET_DAY_ITEMS };
