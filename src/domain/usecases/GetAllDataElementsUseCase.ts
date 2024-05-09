import { FutureData } from "../../data/api-futures";
import { DataElement } from "../entities/DataElement";
import { Future } from "../entities/generic/Future";
import { DataElementRepository } from "../repositories/DataElementRepository";
import { UserRepository } from "../repositories/UserRepository";

export class GetAllDataElementsUseCase {
    constructor(
        private usersRepository: UserRepository,
        private dataElementRepository: DataElementRepository
    ) {}

    public execute(): FutureData<DataElement[]> {
        return this.usersRepository.getCurrent().flatMap(user => {
            if (user.isAdmin()) {
                return this.dataElementRepository.getAll();
            } else {
                return Future.error(new Error("Non admin users cannot fetch data elements"));
            }
        });
    }
}
