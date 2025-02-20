export const timeTrackingStatus = ["approval", "pending"] as const;
export type TimeTrackingStatus = (typeof timeTrackingStatus)[number];
