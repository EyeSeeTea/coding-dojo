import { Id } from "../../../domain/entities/Ref";
import { Attribute, DataValue } from "../../../types/d2-api";
import { Maybe } from "../../../utils/ts-utils";

// QUESTION: It's ok to add this here??
export const MANAGERS_TIME_TRACKING_PROGRAM_ID = "MANAGERS_TIME_TRACKING_PROGRAM_ID";

export const TIME_TRACKING_PROGRAM_STAGE_ID = "TIME_TRACKING_PROGRAM_STAGE_ID";
export const TIME_TRACKING_HOURS_DATA_ELEMENT_ID = "TIME_TRACKING_HOURS_DATA_ELEMENT_ID";
export const TIME_TRACKING_DESCRIPTION_DATA_ELEMENT_ID =
    "TIME_TRACKING_DESCRIPTION_DATA_ELEMENT_ID";

export const MANAGER_ATTRIBUTE_NAME_ID = "MANAGER_ATTRIBUTE_NAME";
export const MANAGER_ATTRIBUTE_EMAIL_ID = "MANAGER_ATTRIBUTE_EMAIL";
export const MANAGER_ATTRIBUTE_USER_ID = "MANAGER_ATTRIBUTE_USER_ID";

export function getValueByDataElementIdFromDataValues(
    dataValues: DataValue[],
    dataElement: Id
): Maybe<string> {
    return dataValues.find(dataValue => dataValue.dataElement === dataElement)?.value;
}

export function getValueByAttributeIdFromAttributes(
    attributes: Attribute[],
    attributeId: Id
): Maybe<string> {
    return attributes?.find(a => a.attribute === attributeId)?.value ?? "";
}
