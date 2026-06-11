import { Record } from "@servicenow/sdk/core";

Record({
    $id: Now.ID["long-request-process-event"],
    table: "sysevent_register",
    data: {
        name: "x_synops.long_request.process",
        table: "x_synops_async_job",
        queue: "synops_outbound",
        description: "Processes long-running outbound requests queued by Scripted REST API",
    },
});