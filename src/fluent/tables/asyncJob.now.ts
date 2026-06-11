// src/fluent/tables/asyncJob.now.ts

import {
    Table,
    StringColumn,
    IntegerColumn,
    ChoiceColumn,
    DateTimeColumn,
    JsonColumn,
    MultiLineTextColumn,
} from "@servicenow/sdk/core";

export const x_nscgg_syncbridge_async_job = Table({
    name: "x_nscgg_syncbridge_async_job",
    label: "Async Job",
    schema: {
        request_id: StringColumn({
            label: "Request ID",
            maxLength: 64,
        }),

        target: StringColumn({
            label: "Target",
            maxLength: 100,
        }),

        state: ChoiceColumn({
            label: "State",
            choices: {
                queued: { label: "Queued" },
                processing: { label: "Processing" },
                completed: { label: "Completed" },
                failed: { label: "Failed" },
            },
            default: "queued",
        }),

        payload: JsonColumn({
            label: "Payload",
        }),

        attempts: IntegerColumn({
            label: "Attempts",
            default: 0,
        }),

        error: MultiLineTextColumn({
            label: "Error",
            maxLength: 4000,
        }),

        started_at: DateTimeColumn({
            label: "Started At",
        }),

        completed_at: DateTimeColumn({
            label: "Completed At",
        }),
    },
    display: "request_id",
    actions: ["create", "read", "update", "delete"],
    accessibleFrom: "public",
});