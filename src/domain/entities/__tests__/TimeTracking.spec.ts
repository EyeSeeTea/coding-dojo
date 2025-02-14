import { describe, expect, it } from "vitest";
import { TimeTracking } from "../TimeTracking";
import { createManager, createNonAdminUser } from "./userFixtures";
import { generateUid } from "../../../utils/uid";

describe("TimeTracking", () => {
    it("should be true if Time Tracking is valid", () => {
        const validTimeTracking = TimeTracking.create({
            id: generateUid(),
            name: "Test 1",
            date: new Date(),
            hours: 5,
            description: "description",
            approvalStatus: "APPROVED",
            managerId: "M1",
            manager: createManager(),
        });

        expect(validTimeTracking.validate().length).toBe(0);
    });
    it("should be false if Time Tracking has negative hours", () => {
        const validTimeTracking = TimeTracking.create({
            id: generateUid(),
            name: "Test 1",
            date: new Date(),
            hours: -1,
            description: "description",
            approvalStatus: "APPROVED",
            managerId: "M1",
            manager: createManager(),
        });

        expect(validTimeTracking.validate().length).toBeGreaterThan(0);
    });
    it("should be false if Time Tracking has more than 24 hours", () => {
        const validTimeTracking = TimeTracking.create({
            id: generateUid(),
            name: "Test 1",
            date: new Date(),
            hours: 35,
            description: "description",
            approvalStatus: "APPROVED",
            managerId: "M1",
            manager: createManager(),
        });

        expect(validTimeTracking.validate().length).toBeGreaterThan(0);
    });
    it("should be false if Time Tracking has non manager assigned", () => {
        const validTimeTracking = TimeTracking.create({
            id: generateUid(),
            name: "Test 1",
            date: new Date(),
            hours: 5,
            description: "description",
            approvalStatus: "APPROVED",
            managerId: "M1",
            manager: createNonAdminUser(),
        });

        expect(validTimeTracking.validate().length).toBeGreaterThan(0);
    });

    it("should be false if Time Tracking has non manager assigned and more than 24 hours logged", () => {
        const validTimeTracking = TimeTracking.create({
            id: generateUid(),
            name: "Test 1",
            date: new Date(),
            hours: 35,
            description: "description",
            approvalStatus: "APPROVED",
            managerId: "M1",
            manager: createNonAdminUser(),
        });

        expect(validTimeTracking.validate().length).toBeGreaterThan(0);
    });
});
