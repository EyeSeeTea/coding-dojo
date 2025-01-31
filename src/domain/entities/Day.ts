export class Day {
    constructor(public year: number, public month: number, public day: number) {
        if (!this.isValid()) {
            throw new Error("Invalid date");
        }
    }

    public static fromDate(date: Date): Day {
        return new Day(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
    }

    public toDate(): Date {
        return new Date(Date.UTC(this.year, this.month - 1, this.day));
    }

    public toString(): string {
        return this.toDate().toISOString().slice(0, 10);
    }

    private isValid(): boolean {
        const date = this.toDate();
        return (
            !Number.isNaN(date.getTime()) &&
            date.getUTCFullYear() === this.year &&
            date.getUTCMonth() + 1 === this.month &&
            date.getUTCDate() === this.day
        );
    }
}
