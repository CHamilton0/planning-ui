import { gql } from 'apollo-angular';

export const GET_DAY = gql`
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

export const GET_GOALS = gql`
  query Goals {
    goals {
      name
      minHours
      maxHours
    }
  }
`;

export const SET_DAY_ITEMS = gql`
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

export const SET_GOALS = gql`
  mutation SetGoals($items: [GoalInput!]!) {
    setGoals(items: $items) {
      name
      minHours
      maxHours
    }
  }
`
