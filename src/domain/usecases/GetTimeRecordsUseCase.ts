import { GetTimeRecordOptions, TimeRecordRepository } from "../entities/TimeRecord";

export class GetTimeRecordsUseCase {
    constructor(private timeRecordRepository: TimeRecordRepository) {}

    execute(options: GetTimeRecordOptions) {
        return this.timeRecordRepository.get(options);
    }
}
