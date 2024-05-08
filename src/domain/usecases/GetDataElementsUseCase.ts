import { FutureData } from "../../data/api-futures";
import { DataElement } from "../entities/DataElement";
import { DataElementRepository } from "../repositories/DataElementRepository";
import { UserRepository } from "../repositories/UserRepository";

export class GetDataElementsUseCase {
    constructor(
        private dataElementRepository: DataElementRepository,
        private usersRepository: UserRepository
    ) {}

    public execute(): FutureData<DataElement[]> {
        return this.usersRepository.getCurrent().flatMap(user => {
            if (!user.isAdmin()) {
                throw new Error("This action is not allowed");
            }
            return this.dataElementRepository.get();
        });
    }
}
