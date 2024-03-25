import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GET_DAY } from './graphql.operations';
import { firstValueFrom, map, take } from 'rxjs';
import { Day } from '../interfaces/day';

@Injectable({
  providedIn: 'root',
})
export class GraphqlService {
  constructor(private apolloProvider: Apollo) {}

  async loadDay(date: Date | null) {
    const result = await firstValueFrom(
      this.apolloProvider
        .query<{ day: Day }>({
          query: GET_DAY,
          variables: {
            day: date?.toISOString() ?? null,
          },
        })
        .pipe(take(1))
    );

    return result.data.day;
  }
}
