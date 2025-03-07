import { NotificationService } from "../../domain/services/NotificationService";

export class NotificationD2Service implements NotificationService {
    send(email: string, message: string): void {
        // Send email using D2 API
    }
}
