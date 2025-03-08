import { GetTimeRecordOptions, TimeRecordRepository } from "../repositories/TimeRecordRepository";

export class GetTimeRecordsUseCase {
    constructor(private timeRecordRepository: TimeRecordRepository) {}

    execute(options: GetTimeRecordOptions) {
        return this.timeRecordRepository.get(options);
    }
}
