// src/fluent/async.now.ts
import { ScriptAction } from "@servicenow/sdk/core";
import { processLongRequest } from "../server/processLongRequest.ts";

ScriptAction({
    $id: Now.ID["process-long-request-action"],
    name: "ProcessLongRequestAction",
    active: true,
    description: "Processes queued long-running outbound requests",
    eventName: "x_nscgg_syncbridge.long_request.process",
    order: 100,
    script: processLongRequest,
});