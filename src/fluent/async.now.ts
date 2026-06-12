// src/fluent/async.now.ts
import { ScriptAction } from "@servicenow/sdk/core";
import { processLongRequest } from "../server/scriptActions/processLongRequest";

ScriptAction({
    $id: Now.ID["process-long-request-action"],
    name: "ProcessLongRequestAction",
    active: true,
    description: "Processes queued long-running outbound requests",
    eventName: "x_nscgg_syncbridge.long_request.process",
    order: 100,
    script: `
        gs.info("[AsyncJobTest] INLINE SCRIPT ACTION HIT");

        if (current) {
            gs.info("[AsyncJobTest] current table = " + current.getTableName());
            gs.info("[AsyncJobTest] current sys_id = " + current.getUniqueValue());

            current.setValue("state", "processing");
            current.setValue("error", "Inline Script Action fired");
            current.update();
        } else {
            gs.error("[AsyncJobTest] current is not available");
        }
    `,
});