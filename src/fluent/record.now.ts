import { Record } from "@servicenow/sdk/core";

Record({
    $id: Now.ID["long-request-process-event"],
    table: "sysevent_register",
    data: {
        name: "x_nscgg_syncbridge.long_request.process",
        table: "x_nscgg_syncbridge_async_job",
        description: "Processes long-running outbound requests queued by Scripted REST API",
    },
});