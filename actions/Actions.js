/*
 * action types
 */

export const Update = {
  FILTER: 'UPDATE_FILTER',
  NOTIFICATIONS: 'UPDATE_NOTIFICATIONS'
}

/*
 * other constants
 */

export const NotificationFrequency = {
  NONE: 0,
  DAILY: 1,
  WEEKLY: 2,
  MONTHLY: 3
}

export const DEFAULT_FILTER = { 
  price: Array(4).fill(false), 
  stars: 1, 
  reviews: 0, 
  distance: 40000
}

export const DEFAULT_OPTIONS = {
  filter: DEFAULT_FILTER,
  notifications: NotificationFrequency.NONE
}
/*
 * action creators
 */

export function updateFilter(price, stars, reviews, distance) {
  return { type: Update.FILTER, filter: { price, stars, reviews, distance } }
}

export function updateNotifications(frequency) {
  return { type: Update.NOTIFICATIONS, notifications: frequency }
}