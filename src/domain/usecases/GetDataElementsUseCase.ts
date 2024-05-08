import { FutureData } from "../../data/api-futures";
import { DataElement } from "../entities/DataElement";
import { Future } from "../entities/generic/Future";
import { DataElementRepository } from "../repositories/DataElementRepository";
import { UserRepository } from "../repositories/UserRepository";

export class GetDataElementsUseCase {
    constructor(
        private dataElementRepository: DataElementRepository,
        private usersRepository: UserRepository
    ) {}

    public execute(): FutureData<DataElement[] | undefined> {
        return this.usersRepository.getCurrent().flatMap(user => {
            if (user.isAdmin()) {
                return this.dataElementRepository.get();
            }
            return Future.success(undefined);
        });
    }
}
