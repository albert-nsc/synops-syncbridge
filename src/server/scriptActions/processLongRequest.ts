import { GlideRecord, gs } from "@servicenow/glide";
import { RESTMessageV2 } from "@servicenow/glide/sn_ws";

declare const current: any;
declare const event: any;

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
    gs.info(`[AsyncJobTest] SCRIPT ACTION HIT`);
    gs.info(`[AsyncJobTest] event.name=${event.name}`);
    gs.info(`[AsyncJobTest] event.parm1=${event.parm1}`);
    gs.info(`[AsyncJobTest] event.parm2=${event.parm2}`);

    const jobSysId = String(event.parm1 || "");
    const job = new GlideRecord("x_nscgg_syncbridge_async_job");

    if (!job.get(jobSysId)) {
        gs.error(`[AsyncJobTest] Could not find job from parm1: ${jobSysId}`);
        return;
    }

    job.setValue("state", "processing");
    job.setValue("error", "Script Action fired successfully");
    job.update();

    gs.info(`[AsyncJobTest] Updated job ${jobSysId} to processing`);
}

// export function processLongRequest() {
//     // In a Script Action, current is the record passed to gs.eventQueue(...)
//     const job = current as GlideRecord;

//     const jobSysId = job.getUniqueValue();
//     const target = job.getValue("target") || "";

//     try {
//         job.setValue("state", "processing");
//         job.update();

//         const payloadRaw = job.getValue("payload") || "{}";
//         const payload = JSON.parse(payloadRaw);

//         if (target === "request_1") {
//             callFirstLongRunningEndpoint(payload);
//         } else if (target === "request_2") {
//             callSecondLongRunningEndpoint(payload);
//         } else {
//             throw new Error(`Unknown async target: ${target}`);
//         }

//         job.setValue("state", "completed");
//         job.setValue("error", "");
//         job.update();
//     } catch (e: any) {
//         const attempts = parseInt(job.getValue("attempts") || "0", 10);

//         job.setValue("state", "failed");
//         job.setValue("error", e.message || String(e));
//         job.setValue("attempts", String(attempts + 1));
//         job.update();

//         gs.error(`[AsyncJob][${jobSysId}] ${e.message || e}`);
//     }
// }

function callFirstLongRunningEndpoint(payload: unknown) {
    const rm = createRestMessage("NSC-SynOps Update API", "POST");

    rm.setRequestHeader("Content-Type", "application/json");
    rm.setRequestBody(JSON.stringify(payload));

    const res = rm.execute();
    const status = res.getStatusCode();

    if (status < 200 || status >= 300) {
        throw new Error(`First request failed: ${status} ${res.getBody()}`);
    }
}

function callSecondLongRunningEndpoint(payload: unknown) {
    const rm = createRestMessage("NSC-SynOps Update API", "POST");

    rm.setRequestHeader("Content-Type", "application/json");
    rm.setRequestBody(JSON.stringify(payload));

    const res = rm.execute();
    const status = res.getStatusCode();

    if (status < 200 || status >= 300) {
        throw new Error(`Second request failed: ${status} ${res.getBody()}`);
    }
}