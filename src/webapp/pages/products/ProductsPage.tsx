import {
    ConfirmationDialog,
    ObjectsList,
    TableConfig,
    useObjectsTable,
} from "@eyeseetea/d2-ui-components";

import React, { useMemo } from "react";
import { useAppContext } from "../../contexts/app-context";
import i18n from "../../../utils/i18n";
import SystemUpdateAltIcon from "@material-ui/icons/SystemUpdateAlt";
import { TextField, Typography } from "@material-ui/core";
import styled from "styled-components";
import { useProductsPage } from "./useProductsPage";

export const dataElements = {
    title: "qkvNoqnBdPk",
    image: "m1yv8j2av5I",
    quantity: "PZ7qxiDlYZ8",
    status: "AUsNzRGzRuC",
};

// TODO: cambiar por Product
export interface ProgramEvent {
    id: string;
    title: string;
    image: string;
    quantity: number;
    status: number;
}

type ProductStatus = "active" | "inactive";

export const ProductsPage: React.FC = React.memo(() => {
    const {
        editedQuantity,
        showEditQuantityDialog,
        quantityError,
        getRows,
        updatingQuantity,
        cancelEditQuantity,
        saveEditQuantity,
        handleChangeQuantity,
    } = useProductsPage();

    const { compositionRoot } = useAppContext();

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

    const tableProps = useObjectsTable(baseConfig, getRows);

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

export function buildProgramEvent(event: Event): ProgramEvent {
    return {
        id: event.event,
        title: event.dataValues.find(dv => dv.dataElement === dataElements.title)?.value || "",
        image: event.dataValues.find(dv => dv.dataElement === dataElements.image)?.value || "",
        quantity: +(
            event.dataValues.find(dv => dv.dataElement === dataElements.quantity)?.value || 0
        ),
        status: +(event.dataValues.find(dv => dv.dataElement === dataElements.status)?.value || 0),
    };
}

export const eventsFields = {
    event: true,
    dataValues: { dataElement: true, value: true },
    eventDate: true,
} as const;

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

export interface Event {
    event: string;
    dataValues: DataValue[];
    eventDate: string;
}

export interface DataValue {
    dataElement: string;
    value: string;
}
