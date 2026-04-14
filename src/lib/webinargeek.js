/**
 * WebinarGeek API Client
 * Docs: https://static.webinargeek.com/api-documentation.html
 */

const BASE_URL = 'https://app.webinargeek.com/api/v2';

function getToken() {
  const token = process.env.WEBINARGEEK_API_TOKEN;
  if (!token) throw new Error('WEBINARGEEK_API_TOKEN nicht gesetzt');
  return token;
}

async function apiCall(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Api-Token': getToken(),
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`[webinargeek] ${options.method || 'GET'} ${path} → ${response.status}:`, text);
    throw new Error(`WebinarGeek API error: ${response.status}`);
  }

  return response.json();
}

/**
 * List all webinars
 */
export async function listWebinars() {
  const data = await apiCall('/webinars?per_page=100');
  return data.webinars || [];
}

/**
 * Get a single webinar by ID
 */
export async function getWebinar(webinarId) {
  return apiCall(`/webinars/${webinarId}`);
}

/**
 * List upcoming broadcasts for a webinar
 */
export async function listBroadcasts(webinarId) {
  const data = await apiCall(`/webinars/${webinarId}/broadcasts?per_page=50`);
  return data.broadcasts || data || [];
}

/**
 * Register a user for a specific broadcast
 * Returns the subscription object with watch_link
 */
export async function registerForBroadcast(broadcastId, { firstName, lastName, email, phone }) {
  const body = {
    email,
    firstname: firstName || '',
    surname: lastName || '',
    phone: phone || '',
    skip_confirmation_mail: false,
  };

  const subscription = await apiCall(`/broadcasts/${broadcastId}/subscriptions`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return subscription;
}

/**
 * Register a user for a webinar (finds the next available broadcast automatically)
 * Returns { subscription, watchLink }
 */
export async function registerForWebinar(webinarId, { firstName, lastName, email, phone }) {
  // Get upcoming broadcasts
  const broadcasts = await listBroadcasts(webinarId);

  if (!broadcasts || broadcasts.length === 0) {
    throw new Error('Keine anstehenden Termine für dieses Webinar');
  }

  // Pick the next upcoming broadcast
  const nextBroadcast = broadcasts[0];
  const broadcastId = nextBroadcast.id;

  const subscription = await registerForBroadcast(broadcastId, {
    firstName, lastName, email, phone,
  });

  return {
    subscription,
    watchLink: subscription.watch_link || subscription.watchLink,
    broadcastId,
  };
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId) {
  return apiCall(`/subscriptions/${subscriptionId}`);
}

export default {
  listWebinars,
  getWebinar,
  listBroadcasts,
  registerForBroadcast,
  registerForWebinar,
  getSubscription,
};
