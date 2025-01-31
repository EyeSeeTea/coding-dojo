import { FutureData } from "../../data/api-futures";
import { Manager } from "../entities/Manager";
import { ManagerRepository } from "../repositories/ManagerRepository";

export class GetManagersUseCase {
    constructor(private managerRepository: ManagerRepository) {}

    public execute(): FutureData<Manager[]> {
        return this.managerRepository.get();
    }
}
