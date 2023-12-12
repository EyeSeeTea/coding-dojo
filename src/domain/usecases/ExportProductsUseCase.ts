import { Product } from "../entities/Product";
import { ProductExportRepository } from "../repositories/ProductExportRepository";

export class ExportProductsUseCase {
    constructor(private productExportRepository: ProductExportRepository) {}

    public execute(name: string, products: Product[]): Promise<void> {
        return this.productExportRepository.export(name, products);
    }
}
