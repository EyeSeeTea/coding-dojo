import { TimeTracking, TimeTrackingAttrs } from "../domain/entities/TimeTracking";

const timeTrackingData: TimeTrackingAttrs[] = [
    {
        id: "1",
        managerId: "101",
        hours: 8,
        date: "2023-10-01T00:00:00Z",
        status: "approval",
    },
    {
        id: "2",
        managerId: "102",
        hours: 7.5,
        date: "2023-10-02T00:00:00Z",
        status: "pending",
    },
    {
        id: "3",
        managerId: "103",
        hours: 6,
        date: "2023-10-03T00:00:00Z",
        status: "approval",
    },
    {
        id: "4",
        managerId: "104",
        hours: 8.5,
        date: "2023-10-04T00:00:00Z",
        status: "pending",
    },
    {
        id: "5",
        managerId: "105",
        hours: 9,
        date: "2023-10-05T00:00:00Z",
        status: "approval",
    },
];

export const timeTrackingsData = timeTrackingData.map(data => TimeTracking.create(data).get());
