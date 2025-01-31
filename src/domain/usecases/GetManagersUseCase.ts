import { GetManagerOptions, ManagerRepository } from "../entities/Manager";

export class GetManagersUseCase {
    constructor(private managerRepository: ManagerRepository) {}

    execute(options: GetManagerOptions) {
        return this.managerRepository.get(options);
    }
}
