import { FutureData } from "../../data/api-futures";
import { ProductExportRepository } from "../entities/ProductExportRepository";
import { ProductRepository } from "../repositories/ProductRepository";
import _ from "./../entities/generic/Collection";

export class ExportProductsToSpreadsheetUseCase {
    constructor(
        private productExportRepository: ProductExportRepository,
        private productRepository: ProductRepository
    ) {}

    execute(filePath: string): FutureData<void> {
        return this.productRepository
            .getProducts(
                {
                    page: 1,
                    pageSize: 1000,
                    total: 1000,
                },
                {
                    field: "title",
                    order: "asc",
                }
            )
            .flatMap(response => {
                return this.productExportRepository.export(filePath, response.objects);
            });
    }
}
