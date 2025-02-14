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

    public static fromString(string: string): Day {
        const result = /^(\d{4})-(\d{2})-(\d{2})$/.exec(string);
        if (!result) {
            throw new Error("Invalid date string");
        }
        const [year, month, day] = result.slice(1).map(section => Number(section));
        if (year === undefined || month === undefined || day === undefined) {
            throw new Error("Invalid date string");
        }
        return new Day(year, month, day);
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
