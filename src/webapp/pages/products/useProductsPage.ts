import React, { ChangeEvent, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import { TablePagination, TableSorting, useSnackbar } from "@eyeseetea/d2-ui-components";
import { useReload } from "../../hooks/use-reload";
import i18n from "../../../utils/i18n";
import { Product, getProductStatus, isQuantityValid } from "../../../domain/entities/Product";

const emptyPager = {
    page: 1,
    pageCount: 1,
    total: 0,
    pageSize: 10,
};

export function useProductsPage() {
    // Hooks
    const { compositionRoot, currentUser } = useAppContext();
    const [reloadKey, reload] = useReload();
    const snackbar = useSnackbar();

    // State
    const [productsList, setProductsList] = useState<Product[] | undefined>(undefined);
    const [pager, setPager] = useState<Record<string, any>>(emptyPager);

    const [showEditQuantityDialog, setShowEditQuantityDialog] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
    const [editingProductId, setEditingProductId] = useState<string | undefined>(undefined);
    const [editedQuantity, setEditedQuantity] = useState<number | undefined>(undefined);
    const [quantityError, setQuantityError] = useState<string | undefined>(undefined);

    const getRows = React.useMemo(
        () => async (_search: string, paging: TablePagination, sorting: TableSorting<Product>) => {
            const response = await compositionRoot.product.getList
                .execute(paging, sorting)
                .toPromise();

            console.debug("Reloading", reloadKey);

            setProductsList(response.objects);
            setPager(response.pager);

            return response;
        },
        [compositionRoot.product.getList, reloadKey]
    );

    const updatingQuantity = React.useCallback(
        async (id: string) => {
            if (id) {
                if (!currentUser.isAdmin()) {
                    snackbar.error(i18n.t("Only admin users can edit quantity od a product"));
                    return;
                }
                const product = await compositionRoot.product.get.execute(id).toPromise();

                if (product) {
                    setEditingProductId(product.id);
                    setEditingProduct(product);
                    setEditedQuantity(product?.quantity || 0);
                    setShowEditQuantityDialog(true);
                } else {
                    snackbar.error(`Product with id ${id} not found`);
                }
            }
        },
        [compositionRoot.product.get, currentUser, snackbar]
    );

    const cancelEditQuantity = React.useCallback(() => {
        setShowEditQuantityDialog(false);
        setEditingProductId(undefined);
        setEditedQuantity(undefined);
        setEditingProduct(undefined);
        setQuantityError(undefined);
    }, []);

    const saveEditQuantity = React.useCallback(async () => {
        if (editingProduct && editedQuantity !== undefined) {
            const editedProduct: Product = {
                ...editingProduct,
                quantity: editedQuantity,
                status: getProductStatus(editedQuantity),
            };

            const response = await compositionRoot.product.update
                .execute(editedProduct)
                .toPromise();

            if (response === "OK") {
                snackbar.success(`Quantity ${editedQuantity} for ${editedProduct.title} saved`);
            } else {
                snackbar.error(
                    `An error has ocurred saving quantity ${editedQuantity} for ${editedProduct.title}`
                );
            }

            setShowEditQuantityDialog(false);
            setEditingProductId(undefined);
            setEditingProduct(undefined);
            setEditedQuantity(undefined);
            reload();
        }
    }, [compositionRoot.product.update, editedQuantity, editingProduct, reload, snackbar]);

    const handleChangeQuantity = React.useCallback(
        (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const newQuantity = +event.target.value;
            if (!isQuantityValid(newQuantity)) {
                setQuantityError("Only positive numbers are allowed");
                setEditedQuantity(editingProduct?.quantity);
            } else {
                setQuantityError(undefined);
                setEditedQuantity(newQuantity);
            }
        },
        [editingProduct?.quantity]
    );

    return {
        productsList,
        pager,
        getRows,
        updatingQuantity,
        setShowEditQuantityDialog,
        setEditingProductId,
        setEditedQuantity,
        setEditingProduct,
        setQuantityError,
        editingProductId,
        editingProduct,
        editedQuantity,
        showEditQuantityDialog,
        quantityError,
        cancelEditQuantity,
        saveEditQuantity,
        handleChangeQuantity,
    };
}
