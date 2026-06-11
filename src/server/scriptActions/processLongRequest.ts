// src/server/scriptActions/processLongRequest.ts
import { GlideRecord, GlideDateTime, gs } from "@servicenow/glide";
import { RESTMessageV2 } from "@servicenow/glide/sn_ws";

declare const event: any;
declare const current: any;

type RESTMessageV2NamedConstructor = new (
    name: string,
    methodName: string
) => RESTMessageV2;

const NamedRESTMessageV2 =
    RESTMessageV2 as unknown as RESTMessageV2NamedConstructor;

export function processLongRequest() {
    const jobSysId = String(event.parm1 || "");
    const target = String(event.parm2 || "");

    const job = new GlideRecord("x_synops_async_job");

    if (!job.get(jobSysId)) {
        gs.error(`[AsyncJob] Job not found: ${jobSysId}`);
        return;
    }

    try {
        job.setValue("u_state", "processing");
        job.setValue("u_started_at", new GlideDateTime());
        job.update();

        const payload = JSON.parse(String(job.u_payload || "{}"));

        if (target === "request_1") {
            callFirstLongRunningEndpoint(payload);
        } else if (target === "request_2") {
            callSecondLongRunningEndpoint(payload);
        } else {
            throw new Error(`Unknown async target: ${target}`);
        }

        job.setValue("u_state", "completed");
        job.setValue("u_completed_at", new GlideDateTime());
        job.setValue("u_error", "");
        job.update();
    } catch (e: any) {
        job.setValue("u_state", "failed");
        job.setValue("u_error", e.message || String(e));
        job.setValue("u_attempts", parseInt(String(job.u_attempts || "0"), 10) + 1);
        job.update();

        gs.error(`[AsyncJob][${jobSysId}] ${e.message || e}`);
    }
}

function callFirstLongRunningEndpoint(payload: any) {
    const rm = new NamedRESTMessageV2("My REST Message", "first_request");
    rm.setRequestBody(JSON.stringify(payload));

    const res = rm.execute();
    const status = res.getStatusCode();

    if (status < 200 || status >= 300) {
        throw new Error(`First request failed: ${status} ${res.getBody()}`);
    }
}

function callSecondLongRunningEndpoint(payload: any) {
    const rm = new NamedRESTMessageV2("My REST Message", "second_request");
    rm.setRequestBody(JSON.stringify(payload));

    const res = rm.execute();
    const status = res.getStatusCode();

    if (status < 200 || status >= 300) {
        throw new Error(`Second request failed: ${status} ${res.getBody()}`);
    }
}