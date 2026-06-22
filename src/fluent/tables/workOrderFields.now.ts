import {
    Table,
    IntegerColumn,
    DateTimeColumn,
    BooleanColumn,
    ReferenceColumn,
} from "@servicenow/sdk/core";

export const wm_order = Table({
    name: "wm_order" as any,
    schema: {
        u_required_engineer_count: IntegerColumn({
            label: "Required Engineer Count",
            default: 1,
        }),

        u_primary_field_engineer: ReferenceColumn({
            label: "Primary Field Engineer",
            referenceTable: "sys_user",
        }),

        u_secondary_field_engineer: ReferenceColumn({
            label: "Secondary Field Engineer",
            referenceTable: "sys_user",
        }),

        u_engineers_assigned_at: DateTimeColumn({
            label: "Engineers Assigned At",
            read_only: true,
        }),

        u_engineers_assignment_sent: BooleanColumn({
            label: "Engineers Assignment Sent",
            default: false,
            read_only: true,
        }),
    },
});