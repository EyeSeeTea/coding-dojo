import { FutureData } from "../../data/api-futures";
import { DataElement } from "../entities/DataElement";
import { UserRepository } from "../repositories/UserRepository";
import { DataElementsRepository } from "../repositories/DataElementsRepository";

export class GetAllDataElementsUseCase {
    constructor(
        private usersRepository: UserRepository,
        private DataElementsRepository: DataElementsRepository
    ) {}

    public execute(): FutureData<DataElement[]> {
        return this.usersRepository.getCurrent().flatMap(currentUser => {
            if (currentUser.isAdmin()) {
                return this.DataElementsRepository.getAll();
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
