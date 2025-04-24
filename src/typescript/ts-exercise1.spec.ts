import { expect, test } from "vitest";
import { Either } from "../domain/entities/generic/Either";
import { Codec, string, exactly, GetType } from "purify-ts";
import { JsonFromString } from "purify-ts-extra-codec";

/*
EXERCISE: Beware of unsafe "as" castings.

Refactor the function `getRequestFromString` so:

1) The tests pass.
2) It's 100% type-safe.
*/

// export type Request = {
//     id: string;
//     status: RequestStatus;
// };

// type RequestStatus = "pending" | "success" | "error";

const requestCodec = Codec.interface({
    id: string,
    status: exactly("pending", "success", "error"),
});

// define the types based on the Codec to avoid duplication and two different sources of thruth
export type Request = GetType<typeof requestCodec>;

function getRequestFromString(value: string): Either<Error, Request> {
    const result = JsonFromString(requestCodec).decode(value);
    // We need to convert the purify-ts Either to our Either
    return result
        .mapLeft(error => Either.error<Error>(new Error(error))) // can use purify parseError but 'DecodeError' is not assignable to parameter of type 'Error'
        .map(data => Either.success<Error, Request>(data))
        .extract();
}

/* Tests */

test("request with invalid status", () => {
    const requestE = getRequestFromString(`{"id": "123", "status": "WRONG"}`);
    expect(requestE.isSuccess()).toBe(false);
});

test("request with valid status", () => {
    const requestE = getRequestFromString(`{"id": "123", "status": "pending"}`);
    expect(requestE.isSuccess()).toBe(true);
    expect(getSuccess(requestE)).toEqual({ id: "123", status: "pending" });
});

// Get the success value from an Either or throw an error
function getSuccess<E, D>(value: Either<E, D>): D {
    return value.match({
        success: data => {
            return data;
        },
        error: () => {
            throw new Error("Expected success");
        },
    });
}
