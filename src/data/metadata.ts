import { D2Api } from "../types/d2-api";
import { FutureData, apiToFuture } from "./api-futures";

export const metadataCodes = {
    program: {
        managers: "CD_MANAGERS",
    },
    programStage: {
        timeTrackingStage: "Time Trackings",
    },
    dataElements: {
        timeTrackingDate: "CD_TIME_TRACKING_DATE",
        timeTrackingHours: "CD_TIME_TRACKING_HOURS",
        timeTrackingStatus: "CD_TIME_TRACKING_MANAGER_STATUS",
    },
};

export function getBaseMetadata(api: D2Api): FutureData<Metadata> {
    return apiToFuture(
        api.metadata.get({
            programStages: {
                filter: {
                    name: { eq: metadataCodes.programStage.timeTrackingStage },
                },
                fields: { id: true },
            },
            programs: {
                filter: {
                    identifiable: { eq: metadataCodes.program.managers },
                },
                fields: { id: true },
            },
            dataElements: {
                filter: {
                    identifiable: {
                        in: [
                            metadataCodes.dataElements.timeTrackingDate,
                            metadataCodes.dataElements.timeTrackingHours,
                            metadataCodes.dataElements.timeTrackingStatus,
                        ],
                    },
                },
                fields: { id: true },
            },
        })
    ).map(response => {
        const result = {
            program: {
                timeTracking: { id: response.programs[0]?.id ?? "" },
            },
            dataElements: {
                timeTrackingDate: { id: response.dataElements[0]?.id ?? "" },
                timeTrackingHours: { id: response.dataElements[1]?.id ?? "" },
                timeTrackingStatus: { id: response.dataElements[2]?.id ?? "" },
            },
            programStage: {
                timeTrackingStage: { id: response.programStages[0]?.id ?? "" },
            },
        };
        return result;
    });
}

// create a type from result variable
export type Metadata = {
    program: {
        timeTracking: { id: string };
    };
    dataElements: {
        timeTrackingDate: { id: string };
        timeTrackingHours: { id: string };
        timeTrackingStatus: { id: string };
    };
    programStage: {
        timeTrackingStage: { id: string };
    };
};
