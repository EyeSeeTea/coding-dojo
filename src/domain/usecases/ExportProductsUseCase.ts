import { FutureData } from "../../data/api-futures";
import { ProductExportRepository } from "../entities/ProductExportRepository";
import { ProductRepository } from "../repositories/ProductRepository";
import _ from "./../entities/generic/Collection";

export class ExportProductsUseCase {
    constructor(
        private productExportRepository: ProductExportRepository,
        private productRepository: ProductRepository
    ) {}

    execute(spreadSheetPath: string): FutureData<void> {
        console.debug("Fetching Products...");
        return this.productRepository
            .getProducts(
                {
                    page: 1,
                    pageSize: 1e6,
                    total: 1e6,
                },
                { field: "id", order: "asc" }
            )
            .flatMap(productsPaginated => {
                console.debug("Exporting Products...");
                return this.productExportRepository.export(
                    spreadSheetPath,
                    productsPaginated.objects
                );
            });
    }
}
