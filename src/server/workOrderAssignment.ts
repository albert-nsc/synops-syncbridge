import { GlideRecord, gs } from "@servicenow/glide";

const EVENT_NAME = "x_nscgg_syncbridge.wo.eng_assigned";
const WORK_ORDER_TABLE = "wm_order";
const WORK_ORDER_TASK_TABLE = "wm_task";
const PARENT_FIELD = "parent"; // Work Order Task -> Work Order

function getValue(gr: any, field: string): string {
    return String(gr.getValue(field) || "");
}

function boolValue(gr: any, field: string): boolean {
    const value = getValue(gr, field);
    return value === "true" || value === "1";
}

function assignedToChanged(current: any, previous: any): boolean {
    if (!previous) {
        return !!getValue(current, "assigned_to");
    }

    return getValue(current, "assigned_to") !== getValue(previous, "assigned_to");
}

function getAssignedEngineerIds(workOrderSysId: string): string[] {
    const seen: Record<string, boolean> = {};
    const engineers: string[] = [];

    const task = new GlideRecord(WORK_ORDER_TASK_TABLE);
    task.addQuery(PARENT_FIELD, workOrderSysId);
    task.addNotNullQuery("assigned_to");
    task.query();

    while (task.next()) {
        const engineerId = getValue(task, "assigned_to");

        if (engineerId && !seen[engineerId]) {
            seen[engineerId] = true;
            engineers.push(engineerId);
        }
    }

    return engineers;
}

export function onWorkOrderTaskAssigned(current: any, previous: any) {
    if (!assignedToChanged(current, previous)) {
        return;
    }

    const workOrderSysId = getValue(current, PARENT_FIELD);

    if (!workOrderSysId) {
        return;
    }

    const wo = new GlideRecord(WORK_ORDER_TABLE);

    if (!wo.get(workOrderSysId)) {
        gs.error(`[SynOps] Could not find parent work order: ${workOrderSysId}`);
        return;
    }

    if (boolValue(wo, "u_engineers_assignment_sent")) {
        return;
    }

    const requiredCount = parseInt(
        getValue(wo, "u_required_engineer_count") || "1",
        10
    );

    const engineerIds = getAssignedEngineerIds(workOrderSysId);

    if (engineerIds.length < requiredCount) {
        return;
    }

    const assignedAt = gs.nowDateTime();

    wo.setWorkflow(false);
    wo.setValue("u_primary_field_engineer", engineerIds[0]);

    if (engineerIds[1]) {
        wo.setValue("u_secondary_field_engineer", engineerIds[1]);
    }

    wo.setValue("u_engineers_assigned_at", assignedAt);
    wo.setValue("u_engineers_assignment_sent", true);
    wo.update();

    // TODO: Trigger the event to notify the external system about the assignment
}