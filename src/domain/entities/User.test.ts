import _ from "lodash";
import { User } from "./User";

const testUsers = [
    {
        id: 1,
        name: "Joellen de Banke",
        username: "jde0",
        userRoles: [{ id: "", name: "", authorities: ["Account Representative I"] }],
        userGroups: [],
        disabled: true,
        dateWhenDisabled: 1240130673000,
    },
    {
        id: 2,
        name: "Brigit Brewitt",
        username: "bbrewitt1",
        userRoles: [{ id: "", name: "", authorities: ["ALL"] }],
        userGroups: [],
        disabled: false,
        dateWhenDisabled: undefined,
    },
    {
        id: 3,
        name: "Barrie Bulleyn",
        username: "bbulleyn2",
        userRoles: [{ id: "", name: "", authorities: ["Software Engineer IV"] }],
        userGroups: [],
        disabled: true,
        dateWhenDisabled: 1467969102000,
    },
    {
        id: 4,
        name: "Horatio Upson",
        username: "hupson3",
        userRoles: [{ id: "", name: "", authorities: ["Mechanical Systems Engineer"] }],
        userGroups: [],
        disabled: true,
        dateWhenDisabled: 1001526760000,
    },
    {
        id: 5,
        name: "Ivar Blucher",
        username: "iblucher4",
        userRoles: [{ id: "", name: "", authorities: ["Professor"] }],
        userGroups: [],
        disabled: true,
        dateWhenDisabled: 995828860000,
    },
    {
        id: 6,
        name: "Coralyn Holligan",
        username: "cholligan5",
        userRoles: [{ id: "", name: "", authorities: ["ALL"] }],
        userGroups: [],
        disabled: false,
        dateWhenDisabled: undefined,
    },
    {
        id: 7,
        name: "Augustine Titterrell",
        username: "atitterrell6",
        userRoles: [{ id: "", name: "", authorities: ["ALL"] }],
        userGroups: [],
        disabled: false,
        dateWhenDisabled: undefined,
    },
    {
        id: 8,
        name: "Morgan Drillingcourt",
        username: "mdrillingcourt7",
        userRoles: [{ id: "", name: "", authorities: ["ALL"] }],
        userGroups: [],
        disabled: false,
        dateWhenDisabled: undefined,
    },
    {
        id: 9,
        name: "Artus Loweth",
        username: "aloweth8",
        userRoles: [{ id: "", name: "", authorities: ["Paralegal"] }],
        userGroups: [],
        disabled: true,
        dateWhenDisabled: 1382126194000,
    },
    {
        id: 10,
        name: "Jeanne Yurygyn",
        username: "jyurygyn9",
        userRoles: [{ id: "", name: "", authorities: ["Junior Executive"] }],
        userGroups: [],
        disabled: true,
        dateWhenDisabled: 1023199651000,
    },
    {
        id: 11,
        name: "Tabina Cartmale",
        username: "tcartmalea",
        userRoles: [{ id: "", name: "", authorities: ["Account Representative II"] }],
        userGroups: [],
        disabled: false,
        dateWhenDisabled: undefined,
    },
    {
        id: 12,
        name: "Paige Perillio",
        username: "pperilliob",
        userRoles: [{ id: "", name: "", authorities: ["Executive Secretary"] }],
        userGroups: [],
        disabled: true,
        dateWhenDisabled: 1026221335000,
    },
    {
        id: 13,
        name: "Davis Filson",
        username: "dfilsonc",
        userRoles: [{ id: "", name: "", authorities: ["Computer Systems Analyst IV"] }],
        userGroups: [],
        disabled: true,
        dateWhenDisabled: 1385750448000,
    },
    {
        id: 14,
        name: "Annecorinne Costain",
        username: "acostaind",
        userRoles: [{ id: "", name: "", authorities: ["Accountant IV"] }],
        userGroups: [],
        disabled: false,
        dateWhenDisabled: undefined,
    },
    {
        id: 15,
        name: "Cyndy Burdikin",
        username: "cburdikine",
        userRoles: [{ id: "", name: "", authorities: ["Recruiting Manager"] }],
        userGroups: [],
        disabled: true,
        dateWhenDisabled: 958725414000,
    },
];

const users = testUsers.map(
    user =>
        new User(
            user.id,
            user.name,
            user.username,
            user.userRoles,
            user.userGroups,
            user.disabled,
            user.dateWhenDisabled ? new Date(user.dateWhenDisabled) : undefined
        )
);

function usersCanBeAdmin() {
    return _.some(users, user => user.isAdmin());
}

function userCanBeDisabled() {
    const usersThatCanBeDisabled = users.filter(user => !user.isDisabled() && !user.isAdmin());
    return usersThatCanBeDisabled.every(user => user.disable());
}

function userAdminsCannotBeDisabled() {
    const usersAdmins = users.filter(user => user.isAdmin());
    return usersAdmins.every(user => !user.disable());
}

function canGetIfUserIsDisabledAndDaysCount() {
    const disabledUsers = users.filter(user => user.isDisabled());
    return disabledUsers.every(user => {
        const days = user.daysDisabled();
        return user.isDisabled() && days && days >= 0;
    });
}

export function tests() {
    console.log("Test: users can be admin", usersCanBeAdmin());
    console.log("Test: user can be disabled", userCanBeDisabled());
    console.log("Test: users admins cannot be disabled", userAdminsCannotBeDisabled());
    console.log("Test: get if users are disabled and days count", canGetIfUserIsDisabledAndDaysCount());
}
