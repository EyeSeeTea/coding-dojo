import { TimeTracking } from "../TimeTracking";

export function givenATimeTracking(approved: boolean): TimeTracking {
    const timeTracking = new TimeTracking({
        id: `id`,
        managerId: `manager-id`,
        day: new Date(),
        hours: 1,
        description: `description`,
        approved: approved,
    });

    return timeTracking;
}

export function givenTimeTrackings(total: number, approved: boolean): TimeTracking[] {
    return Array.from({ length: total }, (_, index) => {
        return new TimeTracking({
            id: `id-${index}`,
            managerId: `manager-id-${index}`,
            day: new Date(),
            hours: index,
            description: `description-${index}`,
            approved: approved,
        });
    });
}
