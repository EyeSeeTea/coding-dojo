import { Product } from "../entities/Product";

export interface ProductExportRepository {
    export(name: string, products: Product[]): Promise<void>;
}
