import React, { ChangeEvent, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import { TablePagination, TableSorting, useSnackbar } from "@eyeseetea/d2-ui-components";
import { ProgramEvent, buildProgramEvent, dataElements, eventsFields } from "./ProductsPage";
import { useReload } from "../../hooks/use-reload";
import i18n from "../../../utils/i18n";

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
    const [productsList, setProductsList] = useState<ProgramEvent[] | undefined>(undefined);
    const [pager, setPager] = useState<Record<string, any>>(emptyPager);

    const [showEditQuantityDialog, setShowEditQuantityDialog] = useState(false);
    const [editingProgramEvent, setEditingProgramEvent] = useState<ProgramEvent | undefined>(
        undefined
    );
    const [editingEventId, setEditingEventId] = useState<string | undefined>(undefined);
    const [editedQuantity, setEditedQuantity] = useState<string | undefined>(undefined);
    const [quantityError, setQuantityError] = useState<string | undefined>(undefined);

    const getRows = React.useMemo(
        () =>
            async (
                _search: string,
                paging: TablePagination,
                sorting: TableSorting<ProgramEvent>
            ) => {
                const api = compositionRoot.api.get;

                const data = await api?.events
                    .get({
                        fields: eventsFields,
                        program: "x7s8Yurmj7Q",
                        page: paging.page,
                        pageSize: paging.pageSize,
                        order: `${sorting.field}:${sorting.order}`,
                    })
                    .getData();

                const events = data?.events.map(buildProgramEvent);

                console.debug("Reloading", reloadKey);

                setProductsList(events || []);
                setPager(data?.pager || emptyPager);

                return {
                    pager: data?.pager || emptyPager,
                    objects: events || [],
                };
            },
        [compositionRoot.api.get, reloadKey]
    );

    const updatingQuantity = React.useCallback(
        async (id: string) => {
            if (id) {
                if (!currentUser.isAdmin()) {
                    snackbar.error(i18n.t("Only admin users can edit quantity od a product"));
                    return;
                }

                const api = compositionRoot.api.get;

                const data = await api?.events
                    .getAll({
                        fields: eventsFields,
                        program: "x7s8Yurmj7Q",
                        event: id,
                    })
                    .getData();

                const event = data?.events[0];

                if (event) {
                    const events = data?.events.map(buildProgramEvent);
                    const event = events[0];

                    setEditingEventId(data?.events[0]?.event);
                    setEditingProgramEvent(event);
                    setEditedQuantity(event?.quantity.toString() || "");
                    setShowEditQuantityDialog(true);
                } else {
                    snackbar.error(`Event with id ${id} not found`);
                }
            }
        },
        [compositionRoot.api.get, currentUser, snackbar]
    );

    const cancelEditQuantity = React.useCallback(() => {
        setShowEditQuantityDialog(false);
        setEditingEventId(undefined);
        setEditedQuantity(undefined);
        setEditingProgramEvent(undefined);
        setQuantityError(undefined);
    }, []);

    const saveEditQuantity = React.useCallback(async () => {
        const api = compositionRoot.api.get;

        if (editingProgramEvent && api) {
            const quantity = +(editedQuantity || "0");

            const editedEvent: ProgramEvent = {
                ...editingProgramEvent,
                quantity,
                status: quantity === 0 ? 0 : 1,
            };

            const data = await api?.events
                .getAll({
                    fields: { $all: true },
                    program: "x7s8Yurmj7Q",
                    event: editingEventId,
                })
                .getData();

            const editingD2Event = data.events[0];

            if (!editingD2Event) return;

            const d2Event = {
                ...editingD2Event,
                dataValues: editingD2Event?.dataValues.map(dv => {
                    if (dv.dataElement === dataElements.quantity) {
                        return { ...dv, value: editedEvent.quantity };
                    } else if (dv.dataElement === dataElements.status) {
                        return { ...dv, value: editedEvent.status };
                    } else {
                        return dv;
                    }
                }),
            };

            const response = await api.events.post({}, { events: [d2Event] }).getData();

            if (response.status === "OK") {
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
    }, [
        compositionRoot.api.get,
        editedQuantity,
        editingEventId,
        editingProgramEvent,
        reload,
        snackbar,
    ]);

    const handleChangeQuantity = React.useCallback(
        (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        },
        []
    );

    return {
        getRows,
        updatingQuantity,
        setShowEditQuantityDialog,
        setEditingEventId,
        setEditedQuantity,
        setEditingProgramEvent,
        setQuantityError,
        editingEventId,
        editingProgramEvent,
        editedQuantity,
        showEditQuantityDialog,
        quantityError,
        cancelEditQuantity,
        saveEditQuantity,
        handleChangeQuantity,
    };
}
