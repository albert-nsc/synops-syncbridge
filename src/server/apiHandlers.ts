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

function getString(obj: Record<string, unknown>, key: string): string {
  const value = obj[key];

  if (typeof value !== "string") {
    return "";
  }

  return value;
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

    const customerName = getString(flat, "createServiceRequest.site.contact.name");
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

    const customerPhone = getString(flat, "createServiceRequest.site.contact.phoneNumber");
    const customerEmail = getString(flat, "createServiceRequest.site.contact.emailAddress");

    const addressLine1 = getString(flat, "createServiceRequest.site.address.line1");
    if (!addressLine1) {
        gs.warn(`[SynOpsAPI][${requestId}] Missing address line 1 in request body`);
        setResponse(response, 400, {
            "timeStamp": new Date().toISOString(),
            "status": "Failed",
            "fault": {
                "faultCode": "BadRequest",
                "faultDescription": "Missing address line 1 in request body"
            },
            "requestId": requestId,
        });
        return;
    }

    const addressLine2 = getString(flat, "createServiceRequest.site.address.line2") || "-";

    const addressCity = getString(flat, "createServiceRequest.site.address.city");
    if (!addressCity) {
        gs.warn(`[SynOpsAPI][${requestId}] Missing address city in request body`);
        setResponse(response, 400, {
            "timeStamp": new Date().toISOString(),
            "status": "Failed",
            "fault": {
                "faultCode": "BadRequest",
                "faultDescription": "Missing address city in request body"
            },
            "requestId": requestId,
        });
        return;
    }

    const addressState = getString(flat, "createServiceRequest.site.address.state");
    if (!addressState) {
        gs.warn(`[SynOpsAPI][${requestId}] Missing address state in request body`);
        setResponse(response, 400, {
            "timeStamp": new Date().toISOString(),
            "status": "Failed",
            "fault": {
                "faultCode": "BadRequest",
                "faultDescription": "Missing address state in request body"
            },
            "requestId": requestId,
        });
        return;
    }

    const addressPostalCode = getString(flat, "createServiceRequest.site.address.postalCode");
    if (!addressPostalCode) {
        gs.warn(`[SynOpsAPI][${requestId}] Missing address postal code in request body`);
        setResponse(response, 400, {
            "timeStamp": new Date().toISOString(),
            "status": "Failed",
            "fault": {
                "faultCode": "BadRequest",
                "faultDescription": "Missing address postal code in request body"
            },
            "requestId": requestId,
        });
        return;
    }

    const addressCountry = getString(flat, "createServiceRequest.site.address.countryCode");
    if (!addressCountry) {
        gs.warn(`[SynOpsAPI][${requestId}] Missing address country code in request body`);
        setResponse(response, 400, {
            "timeStamp": new Date().toISOString(),
            "status": "Failed",
            "fault": {
                "faultCode": "BadRequest",
                "faultDescription": "Missing address country code in request body"
            },
            "requestId": requestId,
        });
        return;
    }

    try {
        const siteAddress = [
            addressLine1,
            addressLine2,
            addressCity,
            addressState,
            addressPostalCode,
            addressCountry
        ].join(", ");

        const wo = new GlideRecord("wm_order");
        wo.initialize();

        const summary = `Nutanix / ${flat["createServiceRequest.summary"]}`;
        wo.setValue(
            "short_description",
            summary || `Field engineer visit - ${customerName}`
        );

        const externalReference = flat["createServiceRequest.customerTicketId"];
        const description = flat["createServiceRequest.description"];
        wo.setValue(
            "description",
            [
                description || "Field engineer visit requested via API",
                "",
                `Customer: ${customerName}`,
                `Phone: ${customerPhone || ""}`,
                `Email: ${customerEmail || ""}`,
                `Site address: ${siteAddress}`,
                `External reference: ${externalReference || ""}`,
            ].join("\n")
        );

        wo.setValue("priority", "3");
        wo.setValue("u_external_reference", externalReference);
        wo.setValue("u_site_address", siteAddress);

        const workOrderSysId = wo.insert();

        if (!workOrderSysId) {
            throw new Error("Failed to insert wm_order");
        }

        gs.info(`[SynOpsAPI][${requestId}] Created wm_order ${workOrderSysId}`);

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
