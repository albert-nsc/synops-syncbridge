import { GlideRecord, gs } from "@servicenow/glide";

export function createServiceRequest(request: any, response: any) {
    const requestId = gs.generateGUID();
    const body = request.body?.data ?? {};

    gs.info(`[SynOpsAPI][${requestId}] Received createServiceRequest with body: ${JSON.stringify(body)}`);

    response.setContentType('application/json');
    response.setStatus(200);
    const writer = response.getStreamWriter();
    const response_body = {
        "requestId": requestId,
        "Hello": "SynOps"
    };
    writer.writeString(JSON.stringify(response_body));
}

export function updateServiceRequest(request: any, response: any) {
    const requestId = gs.generateGUID();
    const body = request.body?.data ?? {};

    gs.info(`[SynOpsAPI][${requestId}] Received updateServiceRequest with body: ${JSON.stringify(body)}`);

    response.setContentType('application/json');
    response.setStatus(200);
    const writer = response.getStreamWriter();
    const response_body = {
        "requestId": requestId,
        "Hello": "SynOps"
    };
    writer.writeString(JSON.stringify(response_body));
}

export function cancelServiceRequest(request: any, response: any) {
    const requestId = gs.generateGUID();
    const body = request.body?.data ?? {};

    gs.info(`[SynOpsAPI][${requestId}] Received cancelServiceRequest with body: ${JSON.stringify(body)}`);

    response.setContentType('application/json');
    response.setStatus(200);
    const writer = response.getStreamWriter();
    const response_body = {
        "requestId": requestId,
        "Hello": "SynOps"
    };
    writer.writeString(JSON.stringify(response_body));
}

/*
export function hello(request: any, response: any) {
    response.setStatus(200);

    return {
        hello: "SynOps",
    };
}

export function echo(request: any, response: any) {
    const body = request.body?.data ?? {};

    response.setStatus(200);

    return {
        received: body,
    };
}

export function getIncident(request: any, response: any) {
    const number = request.pathParams?.number;

    if (!number) {
        response.setStatus(400);
        return {
            error: "Missing incident number",
        };
    }

    const gr = new GlideRecord("incident");
    gr.addQuery("number", number);
    gr.query();

    if (!gr.next()) {
        response.setStatus(404);
        return {
            error: "Incident not found",
            number,
        };
    }

    response.setStatus(200);

    return {
        sys_id: gr.getUniqueValue(),
        number: gr.getValue("number"),
        short_description: gr.getValue("short_description"),
        state: gr.getDisplayValue("state"),
        priority: gr.getDisplayValue("priority"),
    };
}
*/
