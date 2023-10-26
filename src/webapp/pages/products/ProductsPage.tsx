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
import { ProductStatus, ProgramEvent } from "../../../domain/entities/Product";
import { buildProgramEvent } from "./ProductViewModel";

const dataElements = {
    title: "qkvNoqnBdPk",
    image: "m1yv8j2av5I",
    quantity: "PZ7qxiDlYZ8",
    status: "AUsNzRGzRuC",
};

export const ProductsPage: React.FC = React.memo(() => {
    const { compositionRoot, currentUser } = useAppContext();
    const [reloadKey, reload] = useReload();
    const snackbar = useSnackbar();

    const [showEditQuantityDialog, setShowEditQuantityDialog] = useState(false);
    const [editingProgramEvent, setEditingProgramEvent] = useState<ProgramEvent | undefined>(
        undefined
    );
    const [editingEventId, setEditingEventId] = useState<string | undefined>(undefined);
    const [editedQuantity, setEditedQuantity] = useState<string | undefined>(undefined);
    const [quantityError, setQuantityError] = useState<string | undefined>(undefined);

    const updatingQuantity = useCallback(
        async (id: string) => {
            if (id) {
                if (!currentUser.isAdmin()) {
                    snackbar.error(i18n.t("Only admin users can edit quantity od a product"));
                    return;
                }

                const events = await compositionRoot.products.getAllEvents.execute(id).toPromise();
                const event = events[0];

                if (event) {
                    const programEvents = events.map(event =>
                        buildProgramEvent(event, dataElements)
                    );
                    const programEvent = programEvents[0];

                    setEditingEventId(event.event);
                    setEditingProgramEvent(programEvent);
                    setEditedQuantity(programEvent?.quantity.toString() || "");
                    setShowEditQuantityDialog(true);
                } else {
                    snackbar.error(`Event with id ${id} not found`);
                }
            }
        },
        [compositionRoot.products.getAllEvents, currentUser, snackbar]
    );

    const baseConfig: TableConfig<ProgramEvent> = useMemo(
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
                        const url = `${compositionRoot.api.get?.baseUrl}/api/events/files?dataElementUid=${dataElements.image}&eventUid=${event.id}`;
                        return <img src={url} alt={event.title} width={100} />;
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
                        const status = event.status === 0 ? "inactive" : "active";

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
                    onClick: async (selectedIds: string[]) => {
                        updatingQuantity(selectedIds[0] || "");
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
        [compositionRoot.api.get?.baseUrl, updatingQuantity]
    );

    const getRows = useMemo(
        () =>
            async (
                _search: string,
                paging: TablePagination,
                sorting: TableSorting<ProgramEvent>
            ) => {
                const { pager, objects } = await compositionRoot.products.getProductList
                    .execute({
                        paging,
                        sorting: { field: sorting.field, direction: sorting.order },
                    })
                    .toPromise();

                console.debug("Reloading", reloadKey);

                return {
                    pager,
                    objects: objects.map(object => buildProgramEvent(object, dataElements)),
                };
            },
        [compositionRoot.products.getProductList, reloadKey]
    );

    const tableProps = useObjectsTable(baseConfig, getRows);

    function cancelEditQuantity(): void {
        setShowEditQuantityDialog(false);
        setEditingEventId(undefined);
        setEditedQuantity(undefined);
        setEditingProgramEvent(undefined);
        setQuantityError(undefined);
    }

    async function saveEditQuantity(): Promise<void> {
        if (editingProgramEvent) {
            const quantity = +(editedQuantity || "0");
            const editedEvent: ProgramEvent = {
                ...editingProgramEvent,
                quantity,
                status: quantity === 0 ? 0 : 1,
            };

            const d2Events = await compositionRoot.products.getAllEvents
                .execute(editingEventId)
                .toPromise();
            const editingD2Event = d2Events[0];
            if (!editingD2Event) return;

            const d2Event = {
                ...editingD2Event,
                dataValues: editingD2Event.dataValues.map(dv => {
                    if (dv.dataElement === dataElements.quantity) {
                        return { ...dv, value: editedEvent.quantity };
                    } else if (dv.dataElement === dataElements.status) {
                        return { ...dv, value: editedEvent.status };
                    } else {
                        return dv;
                    }
                }),
            };

            const response = await compositionRoot.products.save.execute(d2Event).toPromise();

            if (response === true) {
                snackbar.success(`Quantity ${editedQuantity} for ${editedEvent.title} saved`);
            } else {
                snackbar.error(
                    `An error has ocurred saving quantity ${editedQuantity} for ${editedEvent.title}`
                );
            }

            setShowEditQuantityDialog(false);
            setEditingEventId(undefined);
            setEditingProgramEvent(undefined);
            setEditedQuantity(undefined);
            reload();
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

            <ObjectsList<ProgramEvent>
                {...tableProps}
                columns={tableProps.columns}
                onChangeSearch={undefined}
            />
            <ConfirmationDialog
                isOpen={showEditQuantityDialog}
                title={i18n.t("Update Quantity")}
                onCancel={cancelEditQuantity}
                cancelText={i18n.t("Cancel")}
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
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
