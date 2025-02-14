import { FutureData } from "../../data/api-futures";
import { Manager } from "../entities/Manager";
import { Id } from "../entities/Ref";
import { ManagerRepository } from "../repositories/ManagerRepository";

export class GetManagerUseCase {
    constructor(private managerRepository: ManagerRepository) {}

    public execute(managerId: Id): FutureData<Manager> {
        return this.managerRepository.getById(managerId);
    }
}
