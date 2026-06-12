import { GlideRecord, gs } from "@servicenow/glide";
import { RESTMessageV2 } from "@servicenow/glide/sn_ws";

type NamedRESTMessageV2Ctor = new (
    name: string,
    methodName: string
) => RESTMessageV2;

const NamedRESTMessageV2 =
    RESTMessageV2 as unknown as NamedRESTMessageV2Ctor;

function createRestMessage(name: string, methodName: string): RESTMessageV2 {
    return new NamedRESTMessageV2(name, methodName);
}

export function processLongRequestById(jobSysId: string) {
    gs.info(`[AsyncJob][${jobSysId}] processLongRequestById hit`);

    const job = new GlideRecord("x_nscgg_syncbridge_async_job");

    if (!job.get(jobSysId)) {
        gs.error(`[AsyncJob][${jobSysId}] Job not found`);
        return;
    }

    const target = job.getValue("target") || "";

    try {
        job.setValue("state", "processing");
        job.update();

        const payloadRaw = job.getValue("payload") || "{}";
        const payload = JSON.parse(payloadRaw);

        if (target === "request_1") {
            callLongRunningEndpoint(payload, "First");
        } else if (target === "request_2") {
            callLongRunningEndpoint(payload, "Second");
        } else {
            throw new Error(`Unknown async target: ${target}`);
        }

        job.setValue("state", "completed");
        job.setValue("error", "");
        job.update();
    } catch (e: any) {
        const attempts = parseInt(job.getValue("attempts") || "0", 10);

        job.setValue("state", "failed");
        job.setValue("error", e.message || String(e));
        job.setValue("attempts", String(attempts + 1));
        job.update();

        gs.error(`[AsyncJob][${jobSysId}] ${e.message || String(e)}`);
    }
}

function callLongRunningEndpoint(payload: unknown, label: string) {
    const rm = createRestMessage(
        "NSC-SynOps Update API",
        "POST"
    );

    rm.setRequestHeader("Content-Type", "application/json");
    rm.setRequestBody(JSON.stringify(payload));

    const res = rm.execute();
    const status = res.getStatusCode();

    if (status < 200 || status >= 300) {
        throw new Error(`${label} request failed: ${status} ${res.getBody()}`);
    }
}