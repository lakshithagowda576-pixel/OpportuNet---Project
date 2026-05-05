const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export interface AnalyticsEventPayload {
  eventType: string;
  eventCategory?: string;
  eventAction: string;
  eventLabel?: string;
  eventValue?: number;
  page?: string;
  route?: string;
  metadata?: Record<string, unknown>;
}

export async function trackEvent(payload: AnalyticsEventPayload) {
  try {
    await fetch(`${BASE}/api/analytics/events`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.warn("Analytics trackEvent failed:", error);
  }
}
