import { Id } from "../entities/Ref";
import { FutureData } from "../../data/api-futures";
import { TimeRecord, TimeRecordStatus } from "../entities/TimeRecord";

export type GetTimeRecordOptions = {
    managerId?: Id;
    Ids?: Id[];
    startDate?: Date;
    endDate?: Date;
    status?: TimeRecordStatus;
};

export interface TimeRecordRepository {
    get(options: GetTimeRecordOptions): FutureData<TimeRecord[]>;
    getById(Id: string): FutureData<TimeRecord>;
    save(timeRecord: TimeRecord): FutureData<TimeRecord>;
}
