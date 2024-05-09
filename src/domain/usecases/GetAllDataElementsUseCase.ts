import { FutureData } from "../../data/api-futures";
import { DataElement } from "../entities/DataElement";
import { UserRepository } from "../repositories/UserRepository";
import { DataElementRepository } from "../repositories/DataElementRepository";

export class GetAllDataElementsUseCase {
    constructor(
        private usersRepository: UserRepository,
        private dataElementRepository: DataElementRepository
    ) {}

    public execute(): FutureData<DataElement[]> {
        return this.usersRepository.getCurrent().flatMap(currentUser => {
            if (currentUser.isAdmin()) {
                return this.dataElementRepository.getAll();
            } else {
                throw new NonAdminError("User is not admin");
            }
        });
    }
}

export class NonAdminError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NonAdminError";
    }
}
