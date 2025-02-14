import { givenManagers, givenAManager } from "../../domain/entities/__tests__/managerFixtures";
import { Future } from "../../domain/entities/generic/Future";
import { Manager } from "../../domain/entities/Manager";
import { ManagerRepository, ManagerFilters } from "../../domain/repositories/ManagerRepository";
import { FutureData } from "../api-futures";

export class ManagerTestRepository implements ManagerRepository {
    get(filters?: ManagerFilters): FutureData<Manager[]> {
        return Future.success(givenManagers(filters?.managerIds?.length ?? 5));
    }

    getById(): FutureData<Manager> {
        const manager = givenAManager();
        return Future.success(manager);
    }
}
