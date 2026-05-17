/**
 * Volatile in-memory store.
 * Resets on server restart.
 */
export interface AppState {
  submissions: any[];
  lastUpdated: Date;
}

export const store: AppState = {
  submissions: [],
  lastUpdated: new Date(),
};

export const updateStore = (newData: Partial<AppState>) => {
  Object.assign(store, newData, { lastUpdated: new Date() });
};
