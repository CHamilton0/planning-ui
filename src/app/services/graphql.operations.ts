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

export { GET_DAY, GET_GOALS };
