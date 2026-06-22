// src/server/scriptActions/sendEngineerAssignmentUpdate.ts
import { GlideRecord, gs } from "@servicenow/glide";

declare const current: any;

function getValue(gr: any, field: string): string {
    return String(gr.getValue(field) || "");
}

function getUserPayload(sysId: string) {
    const user = new GlideRecord("sys_user");

    if (!sysId || !user.get(sysId)) {
        return null;
    }

    return {
        sysId,
        name: getValue(user, "name"),
        email: getValue(user, "email"),
        userName: getValue(user, "user_name"),
    };
}

export function sendEngineerAssignmentUpdate() {
    const engineerIds = [
        getValue(current, "u_primary_field_engineer"),
        getValue(current, "u_secondary_field_engineer"),
    ].filter(Boolean);

    const payload = {
        workOrderNumber: getValue(current, "number"),
        correlationId: getValue(current, "correlation_id"),
        engineersAssignedAt: getValue(current, "u_engineers_assigned_at"),
        fieldEngineers: engineerIds
            .map((id) => getUserPayload(id))
            .filter(Boolean),
    };



    gs.info(
        `[SynOps] Engineer assignment REST call sent for work order ${payload.workOrderNumber}. Status=${status}`
    );
}