// src/server/scriptActions/processLongRequest.ts

declare const event: any;
declare const current: any;

export function processLongRequest() {
    const jobSysId = String(event.parm1 || "");
    const target = String(event.parm2 || "");

    const job = new GlideRecord("x_synops_async_job");

    if (!job.get(jobSysId)) {
        gs.error(`[AsyncJob] Job not found: ${jobSysId}`);
        return;
    }

    try {
        job.u_state = "processing";
        job.u_started_at = new GlideDateTime();
        job.update();

        const payload = JSON.parse(String(job.u_payload || "{}"));

        if (target === "request_1") {
            callFirstLongRunningEndpoint(payload);
        } else if (target === "request_2") {
            callSecondLongRunningEndpoint(payload);
        } else {
            throw new Error(`Unknown async target: ${target}`);
        }

        job.u_state = "completed";
        job.u_completed_at = new GlideDateTime();
        job.u_error = "";
        job.update();
    } catch (e: any) {
        job.u_state = "failed";
        job.u_error = e.message || String(e);
        job.u_attempts = parseInt(String(job.u_attempts || "0"), 10) + 1;
        job.update();

        gs.error(`[AsyncJob][${jobSysId}] ${e.message || e}`);
    }
}

function callFirstLongRunningEndpoint(payload: any) {
    const rm = new sn_ws.RESTMessageV2("My REST Message", "first_request");
    rm.setRequestBody(JSON.stringify(payload));

    const res = rm.execute();
    const status = res.getStatusCode();

    if (status < 200 || status >= 300) {
        throw new Error(`First request failed: ${status} ${res.getBody()}`);
    }
}

function callSecondLongRunningEndpoint(payload: any) {
    const rm = new sn_ws.RESTMessageV2("My REST Message", "second_request");
    rm.setRequestBody(JSON.stringify(payload));

    const res = rm.execute();
    const status = res.getStatusCode();

    if (status < 200 || status >= 300) {
        throw new Error(`Second request failed: ${status} ${res.getBody()}`);
    }
}