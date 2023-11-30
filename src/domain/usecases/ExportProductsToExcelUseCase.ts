import { Product } from "../entities/Product";
import { ProductExportRepository } from "../entities/ProductExportRepository";

export class ExportProductsToExcelUseCase {
    constructor(private productReposiory: ProductExportRepository) {}

    public execute(products: Product[]): void {
        this.productReposiory.export("Products.xlsx", products);
    }
}
