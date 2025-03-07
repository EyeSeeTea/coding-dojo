import { apiToFuture, FutureData, Stat } from "../api-futures";
import { TimeRegistryRepository } from "../../domain/repositories/TimeRegistryRepository";
import { TimeRegistry } from "../../domain/entities/TimeRegistry";
import { D2Api } from "../../types/d2-api";
import { D2TrackerEvent } from "@eyeseetea/d2-api/api/trackerEvents";

export class TimeRegistryD2Repository implements TimeRegistryRepository {
    constructor(private api: D2Api) {}

    get(): FutureData<TimeRegistry[]> {
        return apiToFuture(
            this.api.tracker.events.get(
                {
                    fields: {
                        id: true,
                        createdBy: true,
                        createdAt: true,
                        updatedAt: true,
                        dataValues: true,
                    }
                }
                )).map(res=>{
                    return res.instances.map(this.mapEventToTimeRegistry);
            });
    }

    save(timeRegistry: TimeRegistry): FutureData<Stat> {
        const trackerEvent=this.mapTimeRegistryToEvent(timeRegistry);

        return apiToFuture(
            this.api.metadata.post({
                
            });
        );
    }

    private mapEventToTimeRegistry(trackerEvent: D2TrackerEvent): TimeRegistry {
        // get id dataElements from codes
        const day = trackerEvent.dataValues.find(dv => dv.dataElement === 'day')?.value;
        const hours = trackerEvent.dataValues.find(dv => dv.dataElement === 'hours')?.value;
        const description = trackerEvent.dataValues.find(dv => dv.dataElement === 'description')?.value;
        const reviewedBy = trackerEvent.dataValues.find(dv => dv.dataElement === 'reviewedBy')?.value;
        const status = trackerEvent.dataValues.find(dv => dv.dataElement === 'status')?.value;

        return new TimeRegistry({
            id: trackerEvent.event,
            createdBy: trackerEvent.createdBy?.uid,
            createdAt: new Date(trackerEvent.createdAt),
            status,
            day,
            hours,
            description,
            reviewedBy
        });
    }

    private mapTimeRegistryToEvent(timeRegistry: TimeRegistry): D2TrackerEvent {
        // dataelements codes into ids
        return {
            event: timeRegistry.id,
            createdBy: { uid: timeRegistry.createdBy },
            createdAt: timeRegistry.createdAt.toISOString(),
            dataValues: [
                { dataElement: 'day', value: timeRegistry.day },
                { dataElement: 'hours', value: timeRegistry.hours },
                { dataElement: 'description', value: timeRegistry.description },
                { dataElement: 'reviewedBy', value: timeRegistry.reviewedBy },
                { dataElement: 'status', value: timeRegistry.status }
            ]
        };
    }
}
