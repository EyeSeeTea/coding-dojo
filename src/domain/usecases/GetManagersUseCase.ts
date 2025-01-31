import { GetManagerOptions, ManagerRepository } from "../repositories/ManagerRepository";

export class GetManagersUseCase {
    constructor(private managerRepository: ManagerRepository) {}

    execute(options: GetManagerOptions) {
        return this.managerRepository.get(options);
    }
}
