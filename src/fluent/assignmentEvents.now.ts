import { BusinessRule } from "@servicenow/sdk/core";
import { onWorkOrderTaskAssigned } from "../server/workOrderAssignment.ts";

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
