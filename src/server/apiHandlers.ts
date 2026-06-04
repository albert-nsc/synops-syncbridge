import { GlideRecord, gs } from "@servicenow/glide";

type JsonPrimitive = string | number | boolean | null;
type JsonArray = JsonValue[];
type JsonObject = { [key: string]: JsonValue };
type JsonValue = JsonPrimitive | JsonArray | JsonObject;

type FlattenedJson = Record<string, JsonPrimitive | JsonArray>;

function isPlainJsonObject(value: JsonValue): value is JsonObject {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

function flattenJson(
    input: JsonObject,
    parentKey = "",
    result: FlattenedJson = {}
): FlattenedJson {
    for (const [key, value] of Object.entries(input)) {
        const newKey = parentKey ? `${parentKey}.${key}` : key;

        if (isPlainJsonObject(value)) {
            flattenJson(value, newKey, result);
        } else {
            result[newKey] = value;
        }
    }

    return result;
}

function setResponse(response: any, status_code: number, body: any) {
    response.setContentType('application/json');
    response.setStatus(status_code);
    const writer = response.getStreamWriter();
    writer.writeString(JSON.stringify(body));
}

export function createServiceRequest(request: any, response: any) {
    const requestId = gs.generateGUID();
    const body = request.body?.data ?? {};
    const flat = flattenJson(body);

    gs.info(`[SynOpsAPI][${requestId}] Received createServiceRequest with body: ${JSON.stringify(body)}`);
    gs.info(`[SynOpsAPI][${requestId}] Flattened body: ${JSON.stringify(flat)}`);

    const customerName = flat["createServiceRequest.site.contact.name"];
    if (!customerName) {
        gs.warn(`[SynOpsAPI][${requestId}] Missing customer name in request body`);
        setResponse(response, 400, {
            "timeStamp": new Date().toISOString(),
            "status": "Failed",
            "fault": {
                "faultCode": "BadRequest",
                "faultDescription": "Missing customer name in request body"
            },
            "requestId": requestId,
        });
        return;
    }

    try {
        setResponse(response, 200, {
            "timeStamp": new Date().toISOString(),
            "status": "Accepted",
            "fault": null,
            "requestId": requestId,
        });
        return;
    } catch (e: any) {
        gs.error(`[SynOpsAPI][${requestId}] Failed: ${e.message || String(e)}`);
        const timestamp = new Date().toISOString();
        setResponse(response, 500, {
            "timeStamp": timestamp,
            "status": "Failed",
            "fault": {
                "faultCode": "InternalServerError",
                "faultDescription": e.message || String(e)
            },
            "requestId": requestId,
        });
        return;
    }
}

export function updateServiceRequest(request: any, response: any) {
    const requestId = gs.generateGUID();
    const body = request.body?.data ?? {};
    const flat = flattenJson(body);

    gs.info(`[SynOpsAPI][${requestId}] Received updateServiceRequest with body: ${JSON.stringify(body)}`);
    gs.info(`[SynOpsAPI][${requestId}] Flattened body: ${JSON.stringify(flat)}`);

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
    const flat = flattenJson(body);

    gs.info(`[SynOpsAPI][${requestId}] Received cancelServiceRequest with body: ${JSON.stringify(body)}`);
    gs.info(`[SynOpsAPI][${requestId}] Flattened body: ${JSON.stringify(flat)}`);

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
