import { FutureData } from "../../data/api-futures";
import { DataElement } from "../entities/DataElement";
import { Future } from "../entities/generic/Future";
import { DataElementRepository } from "../repositories/DataElementRepository";
import { UserRepository } from "../repositories/UserRepository";

export class GetDataElements {
    constructor(
        private dataElementRepository: DataElementRepository,
        private userRepository: UserRepository
    ) {}

    public execute(): FutureData<DataElement[]> {
        return this.userRepository.getCurrent().flatMap(user => {
            if (user.isAdmin()) {
                return this.dataElementRepository.get();
            } else {
                return Future.error(new Error("User is not an admin"));
            }
        });
    }
}
