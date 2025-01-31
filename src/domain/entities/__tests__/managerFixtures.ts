import { Manager } from "../Manager";

export function givenAManager(): Manager {
    const manager: Manager = {
        id: `manager-id`,
        name: `Manager`,
        userId: `user-id`,
        email: `manager@email.com`,
    };

    return manager;
}

export function givenManagers(total: number): Manager[] {
    return Array.from({ length: total }, (_, index) => {
        const manager: Manager = {
            id: `manager-id-${index}`,
            name: `Manager ${index}`,
            userId: `user-id-${index}`,
            email: `manager${index}@email.com`,
        };

        return manager;
    });
}
