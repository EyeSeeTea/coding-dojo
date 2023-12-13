import { ProductExportRepository } from "../entities/ProductExportRepository";
import { ProductRepository } from "../repositories/ProductRepository";

export class ExportProductsToSpreadsheetUseCase {
    constructor(
        private productExportRepository: ProductExportRepository,
        private productReposiory: ProductRepository
    ) {}

    async execute(options: { fileName: string }): Promise<void> {
        const products = await this.productReposiory.getAllProducts().toPromise();

        return this.productExportRepository.export(options.fileName, products);
    }
}
