import {
    ConfirmationDialog,
    ObjectsList,
    TableConfig,
    TablePagination,
    TableSorting,
    useObjectsTable,
    useSnackbar,
} from "@eyeseetea/d2-ui-components";
import React, { ChangeEvent, useCallback, useMemo, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import { useReload } from "../../hooks/use-reload";
import i18n from "../../../utils/i18n";
import SystemUpdateAltIcon from "@material-ui/icons/SystemUpdateAlt";
import { TextField, Typography } from "@material-ui/core";
import styled from "styled-components";
import { Product, ProductStatus } from "../../../domain/entities/Product";
import { Pager } from "@eyeseetea/d2-api/2.36";

export const ProductsPage: React.FC = React.memo(() => {
    const { compositionRoot, currentUser } = useAppContext();
    const [reloadKey, reload] = useReload();
    const snackbar = useSnackbar();
    const [showEditQuantityDialog, setShowEditQuantityDialog] = useState(false);
    const [productBeingEdited, setProductBeingEdited] = useState<Product | undefined>(undefined);
    const [editedQuantity, setEditedQuantity] = useState<string | undefined>(undefined);
    const [quantityError, setQuantityError] = useState<string | undefined>(undefined);

    const updateQuantity = useCallback(
        async (productId: string) => {
            if (productId) {
                if (!currentUser.isAdmin()) {
                    snackbar.error(i18n.t("Only admin users can edit quantity of a product"));
                    return;
                }
                compositionRoot.products.getProduct.execute(productId).run(
                    product => {
                        setProductBeingEdited(product);
                        setShowEditQuantityDialog(true);
                    },
                    err => {
                        snackbar.error(err.message);
                    }
                );
            }
        },
        [currentUser, snackbar, compositionRoot.products.getProduct]
    );

    const baseConfig: TableConfig<Product> = useMemo(
        () => ({
            columns: [
                {
                    name: "title",
                    text: i18n.t("Title"),
                    sortable: false,
                },
                {
                    name: "image",
                    text: i18n.t("Image"),
                    sortable: false,
                    getValue: event => {
                        return <img src={event.image} alt={event.title} width={100} />;
                    },
                },

                {
                    name: "quantity",
                    text: i18n.t("Quantity"),
                    sortable: false,
                },
                {
                    name: "status",
                    text: i18n.t("Status"),
                    sortable: false,
                    getValue: event => {
                        const status = event.quantity === 0 ? "inactive" : "active";

                        return (
                            <StatusContainer status={status}>
                                <Typography variant="body1">{status}</Typography>
                            </StatusContainer>
                        );
                    },
                },
            ],
            actions: [
                {
                    name: "updateQuantity",
                    text: i18n.t("Update Quantity"),
                    icon: <SystemUpdateAltIcon />,
                    onClick: (selectedIds: string[]) => {
                        updateQuantity(selectedIds[0] || "");
                    },
                },
            ],
            initialSorting: {
                field: "title" as const,
                order: "asc" as const,
            },
            paginationOptions: {
                pageSizeOptions: [10, 20, 50],
                pageSizeInitialValue: 10,
            },
        }),
        [updateQuantity]
    );

    const getProductRows = useCallback(
        (
            _search: string,
            paging: TablePagination,
            sorting: TableSorting<Product>
        ): Promise<{ objects: Product[]; pager: Pager }> => {
            console.debug("Reloading", reloadKey);

            return compositionRoot.products.getProducts
                .execute(paging.page, paging.pageSize, sorting.field, sorting.order)
                .toPromise();
        },
        [compositionRoot, reloadKey]
    );

    const tableProps = useObjectsTable(baseConfig, getProductRows);

    function cancelEditQuantity(): void {
        setShowEditQuantityDialog(false);
        setEditedQuantity(undefined);
        setProductBeingEdited(undefined);
        setQuantityError(undefined);
    }

    function saveEditQuantity(): void {
        if (productBeingEdited) {
            const updatedQuantity = +(editedQuantity || "0");
            const updatedProduct: Product = {
                ...productBeingEdited,
                quantity: updatedQuantity,
                status: updatedQuantity === 0 ? "inactive" : "active",
            };

            compositionRoot.products.saveProduct.execute(updatedProduct).run(
                () => {
                    snackbar.info(`Quantity ${editedQuantity} for ${updatedProduct.title} saved`);
                    setShowEditQuantityDialog(false);
                    setProductBeingEdited(undefined);
                    setEditedQuantity(undefined);
                    reload();
                },
                err => {
                    snackbar.error(
                        `An error has ocurred saving quantity ${editedQuantity} for ${updatedProduct.title} : ${err.message}`
                    );
                    setShowEditQuantityDialog(false);
                    setProductBeingEdited(undefined);
                    setEditedQuantity(undefined);
                    reload();
                }
            );
        }
    }

    function handleChangeQuantity(
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void {
        const isValidNumber = !isNaN(+event.target.value);

        if (!isValidNumber) {
            setQuantityError("Only numbers are allowed");
            setEditedQuantity(event.target.value);
        } else {
            const value = Number(event.target.value);

            if (value < 0) {
                setQuantityError("Only positive numbers are allowed");
            } else {
                setQuantityError(undefined);
            }

            setEditedQuantity(event.target.value);
        }
    }

    return (
        <Container>
            <Typography variant="h4">{i18n.t("Products")}</Typography>

            <ObjectsList<Product>
                {...tableProps}
                columns={tableProps.columns}
                onChangeSearch={undefined}
            />
            <ConfirmationDialog
                isOpen={showEditQuantityDialog}
                title={i18n.t("Update Quantity")}
                onCancel={cancelEditQuantity}
                cancelText={i18n.t("Cancel")}
                onSave={saveEditQuantity}
                saveText={i18n.t("Save")}
                maxWidth="xs"
                fullWidth
                disableSave={quantityError !== undefined}
            >
                <TextField
                    label={i18n.t("Quantity")}
                    value={editedQuantity}
                    onChange={handleChangeQuantity}
                    error={quantityError !== undefined}
                    helperText={quantityError}
                />
            </ConfirmationDialog>
        </Container>
    );
});

const Container = styled.div`
    padding: 32px;
`;

const StatusContainer = styled.div<{ status: ProductStatus }>`
    background: ${props => (props.status === "inactive" ? "red" : "green")};
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
    padding: 8px;
    border-radius: 20px;
    width: 100px;
`;
