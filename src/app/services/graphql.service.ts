import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GET_DAY, GET_GOALS, GET_WEEKLY_SUMMARY, SET_DAY_ITEMS, SET_GOALS } from './graphql.operations';
import { firstValueFrom, map, take } from 'rxjs';
import { Day } from '../interfaces/day';
import { Item } from '../interfaces/item';
import { Goal } from '../interfaces/goal';
import { Summary } from '../interfaces/summary';

@Injectable({
  providedIn: 'root',
})
export class GraphqlService {
  constructor(private apolloProvider: Apollo) { }

  async loadDay(date: Date | null) {
    let newDate = undefined;
    if (date) {
      newDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
    }

    const result = await firstValueFrom(
      this.apolloProvider
        .query<{ day: Day }>({
          query: GET_DAY,
          variables: {
            day: newDate ?? null,
          },
        })
        .pipe(take(1))
    );

    return result.data.day;
  }

  async getGoals() {
    const result = await firstValueFrom(
      this.apolloProvider
        .query<{ goals: Goal[] }>({
          query: GET_GOALS,
        })
        .pipe(take(1))
    );

    return result.data.goals;
  }

  async getWeeklySummary(date: Date | null) {
    let newDate = undefined;
    if (date) {
      newDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
    }

    const result = await firstValueFrom(
      this.apolloProvider
        .query<{ weeklySummary: Summary[] }>({
          query: GET_WEEKLY_SUMMARY,
          variables: {
            day: newDate ?? null,
          },
        })
        .pipe(take(1))
    );

    return result.data.weeklySummary;
  }

  async setDayItems(date: Date | null, items: Item[]) {
    let newDate = undefined;
    if (date) {
      newDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
    }

    const result = await firstValueFrom(
      this.apolloProvider.mutate({
        mutation: SET_DAY_ITEMS,
        variables: {
          day: newDate ?? null,
          items: items.map((item) => ({ name: item.name, hours: item.hours })),
        },
      }).pipe(take(1))
    );

    return result;
  }

  async setGoals(goals: Goal[]) {
    const result = await firstValueFrom(
      this.apolloProvider.mutate({
        mutation: SET_GOALS,
        variables: {
          items: goals.map((goal) => ({ name: goal.name, minHours: goal.minHours, maxHours: goal.maxHours ?? null })),
        }
      }).pipe(take(1))
    );

    return result
  }
}
