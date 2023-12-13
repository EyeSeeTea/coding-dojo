import { ProductExportRepository } from "../entities/ProductExportRepository";
import { ProductRepository } from "../repositories/ProductRepository";

export class ExportProductUseCase {
    constructor(
        private productExportRepository: ProductExportRepository,
        private productRepository: ProductRepository
    ) {}

    async execute(): Promise<void> {
        console.log("ExportProductUseCase");
    }
}
