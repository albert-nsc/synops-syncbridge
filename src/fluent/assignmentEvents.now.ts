import { BusinessRule, Record, ScriptAction } from "@servicenow/sdk/core";
import { onWorkOrderTaskAssigned } from "../server/onWorkOrderTaskAssigned.ts";
import { sendEngineerAssignmentUpdate } from "../server/scriptActions/sendEngineerAssignmentUpdate.ts";

export const engineersAssignedEvent = Record({
    $id: Now.ID["event-wo-eng-assigned"],
    table: "sysevent_register",
    data: {
        name: "x_nscgg_syncbridge.wo.eng_assigned",
        table: "wm_order",
        fired_by: "SynOps - Work Order Task Engineer Assignment",
        description:
            "Fired once when the required field engineers have been assigned to a work order.",
    },
});

export const workOrderTaskAssignmentRule = BusinessRule({
    $id: Now.ID["br-wot-engineer-assignment"],
    name: "SynOps - Work Order Task Engineer Assignment",
    table: "wm_task",
    when: "after",
    action: ["insert", "update"],
    active: true,
    order: 100,
    script: onWorkOrderTaskAssigned,
});

export const engineerAssignmentScriptAction = ScriptAction({
    $id: Now.ID["sa-send-wo-eng-assigned"],
    name: "SynOpsSendEngineerAssignmentUpdate",
    active: true,
    eventName: "x_nscgg_syncbridge.wo.eng_assigned",
    order: 100,
    description:
        "Sends engineer assignment update to the external integration party.",
    script: sendEngineerAssignmentUpdate,
});