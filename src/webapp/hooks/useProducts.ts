import React from "react";
import { Product } from "../../domain/entities/Product";
import { useAppContext } from "../contexts/app-context";
import { GetRows, TablePagination, TableSorting, useSnackbar } from "@eyeseetea/d2-ui-components";
import { Id } from "../../domain/entities/Ref";
import { useReload } from "./use-reload";

export function useProducts() {
    const [reloadKey, reload] = useReload();
    const { compositionRoot } = useAppContext();
    const snackbar = useSnackbar();

    const getProducts = React.useCallback<GetRows<Product>>(
        (_: string, paging: TablePagination, sorting: TableSorting<Product>) => {
            return new Promise((resolve, reject) => {
                return compositionRoot.products.getAll
                    .execute({
                        page: paging.page,
                        pageSize: paging.pageSize,
                        sorting,
                    })
                    .run(
                        response => {
                            console.debug("reload", reloadKey);
                            resolve({
                                objects: response.products,
                                pager: response.pager,
                            });
                        },
                        err => {
                            snackbar.error(err.message);
                            reject(new Error(err.message));
                        }
                    );
            });
        },
        [compositionRoot, reloadKey, snackbar]
    );

    const getProductById = React.useCallback(
        (id: Id) => {
            return compositionRoot.products.getById.execute(id);
        },
        [compositionRoot]
    );

    const saveProduct = React.useCallback(
        (product: Product, newQuantity: number) => {
            return compositionRoot.products.save.execute(
                new Product({
                    ...product,
                    quantity: newQuantity,
                })
            );
        },
        [compositionRoot.products.save]
    );

    return { getProductById, getProducts, reload, saveProduct };
}
