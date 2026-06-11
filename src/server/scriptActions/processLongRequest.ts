import { GlideRecord, gs } from "@servicenow/glide";
import { RESTMessageV2 } from "@servicenow/glide/sn_ws";

declare const current: any;

type NamedRESTMessageV2Ctor = new (
    name: string,
    methodName: string
) => RESTMessageV2;

const NamedRESTMessageV2 =
    RESTMessageV2 as unknown as NamedRESTMessageV2Ctor;

function createRestMessage(name: string, methodName: string): RESTMessageV2 {
    return new NamedRESTMessageV2(name, methodName);
}

export function processLongRequest() {
    // In a Script Action, current is the record passed to gs.eventQueue(...)
    const job = current as GlideRecord;

    const jobSysId = job.getUniqueValue();
    const target = job.getValue("u_target") || "";

    try {
        job.setValue("u_state", "processing");
        job.update();

        const payloadRaw = job.getValue("u_payload") || "{}";
        const payload = JSON.parse(payloadRaw);

        if (target === "request_1") {
            callFirstLongRunningEndpoint(payload);
        } else if (target === "request_2") {
            callSecondLongRunningEndpoint(payload);
        } else {
            throw new Error(`Unknown async target: ${target}`);
        }

        job.setValue("u_state", "completed");
        job.setValue("u_error", "");
        job.update();
    } catch (e: any) {
        const attempts = parseInt(job.getValue("u_attempts") || "0", 10);

        job.setValue("u_state", "failed");
        job.setValue("u_error", e.message || String(e));
        job.setValue("u_attempts", String(attempts + 1));
        job.update();

        gs.error(`[AsyncJob][${jobSysId}] ${e.message || e}`);
    }
}

function callFirstLongRunningEndpoint(payload: unknown) {
    const rm = createRestMessage("SynOps External API", "NSC-SynOps Update API");

    rm.setRequestHeader("Content-Type", "application/json");
    rm.setRequestBody(JSON.stringify(payload));

    const res = rm.execute();
    const status = res.getStatusCode();

    if (status < 200 || status >= 300) {
        throw new Error(`First request failed: ${status} ${res.getBody()}`);
    }
}

function callSecondLongRunningEndpoint(payload: unknown) {
    const rm = createRestMessage("SynOps External API", "NSC-SynOps Update API");

    rm.setRequestHeader("Content-Type", "application/json");
    rm.setRequestBody(JSON.stringify(payload));

    const res = rm.execute();
    const status = res.getStatusCode();

    if (status < 200 || status >= 300) {
        throw new Error(`Second request failed: ${status} ${res.getBody()}`);
    }
}