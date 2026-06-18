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

function setRequiredValue(gr: GlideRecord, field: string, value: string) {
    if (!gr.isValidField(field)) {
        throw new Error(`Invalid async job field: ${field}`);
    }

    gr.setValue(field, value);
}

function createAsyncJob(requestId: string, target: string, payload: unknown): string {
    const gr = new GlideRecord("x_nscgg_syncbridge_async_job");

    gr.initialize();

    setRequiredValue(gr, "request_id", requestId);
    setRequiredValue(gr, "target", target);
    setRequiredValue(gr, "state", "queued");
    setRequiredValue(gr, "payload", JSON.stringify(payload));
    setRequiredValue(gr, "attempts", "0");

    const sysId = gr.insert();

    if (!sysId) {
        throw new Error("Failed to create async job record");
    }

    return sysId;
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
        wo.setValue("correlation_id", externalReference);
        wo.setValue("correlation_display", "SynOps");
        wo.setValue("u_site_address", siteAddress);

        const loc = new GlideRecord("cmn_location");
        loc.initialize();

        loc.setValue("name", `${addressLine1}, ${addressCity}`);
        loc.setValue("street", addressLine1);
        loc.setValue("city", addressCity);
        loc.setValue("state", addressState);
        loc.setValue("country", addressCountry);
        loc.setValue("zip", addressPostalCode);

        const locationSysId = loc.insert();

        if (!locationSysId) {
            throw new Error("Failed to create cmn_location record");
        }

        gs.info(`[SynOpsAPI][${requestId}] Created cmn_location ${locationSysId}`);

        wo.setValue("location", locationSysId);

        const workOrderSysId = wo.insert();

        if (!workOrderSysId) {
            throw new Error("Failed to insert wm_order");
        }

        const workOrderNumber = wo.getValue("number");

        gs.info(`[SynOpsAPI][${requestId}] Created wm_order ${workOrderSysId}`);

        const transactionId = getString(flat, "header.transactionId");
        const customerTicketId = getString(flat, "createServiceRequest.customerTicketId");

        const createPayload = {
            "Header": {
                "transactionId": transactionId,
                "userId": "SYSTEM_USER",
                "sourceSystem": "NSC", //Mandatory
                "timeStamp": new Date().toISOString()
            },
            "IncidentUpdate": {
                "customerTicketId": customerTicketId,
                "vendorTicketID": workOrderNumber,
                "vendorTicketStatus": "",
                "activity": "CREATESRRESPONSE",
                "responseDate": new Date().toISOString(),
                "feConfirmEtaDate": null,
                "feDispatchDate": null,
                "feArrivalDate": null,
                "SuspendCode": null,
                "SuspendDesc": null,
                "feCompletionDate": null,
                "CauseCode": null,
                "RepairCode": null,
                "Comments": "",
                "incidentStatus": "New",
                "incidentClosedDTGMT": null,
                "incidentStartDTGMT": null,
                "incidentPriority": null,
                "incidentResolutionCode": null,
                "incidentResolutionDesc": null,
                "OperationalCategorizationTier1": null,
                "IncidentCauseCode": null,
                "IncidentCauseType": null,
                "firstFeName": "",
                "firstFePhone": "",
                "firstFeEmail": "",
                //Second FE details required if second fe required is true
                "secondFeName": "",
                "secondFePhone": "",
                "secondFeEmail": "",
                "TrackingNumber": null,
                "IsPartReturned": null,
                "PartNotReturnedReason": null,
                "Fault": {
                    "FaultCode": "",
                    "FaultDescription": ""
                }
            }
        }

        const job1SysId = createAsyncJob(requestId, "request_1", createPayload);

        const openPayload = {
            "Header": {
                "transactionId": transactionId,
                "userId": "SYSTEM_USER",
                "sourceSystem": "NSC", //Mandatory
                "timeStamp": new Date().toISOString()
            },
            "IncidentUpdate": {
                "customerTicketId": customerTicketId,
                "vendorTicketID": workOrderNumber,
                "vendorTicketStatus": "OPEN",
                "activity": "OPENSRRESPONSE",
                "responseDate": new Date().toISOString(),
                "feConfirmEtaDate": null,
                "feDispatchDate": null,
                "feArrivalDate": null,
                "SuspendCode": null,
                "SuspendDesc": null,
                "feCompletionDate": null,
                "CauseCode": null,
                "RepairCode": null,
                "Comments": `Work order ${workOrderNumber} has been created.`,
                "incidentStatus": "New",
                "incidentClosedDTGMT": null,
                "incidentStartDTGMT": null,
                "incidentPriority": null,
                "incidentResolutionCode": null,
                "incidentResolutionDesc": null,
                "OperationalCategorizationTier1": null,
                "IncidentCauseCode": null,
                "IncidentCauseType": null,
                "firstFeName": "",
                "firstFePhone": "",
                "firstFeEmail": "",
                //Second FE details required if second fe required is true
                "secondFeName": "",
                "secondFePhone": "",
                "secondFeEmail": "",
                "TrackingNumber": null,
                "IsPartReturned": null,
                "PartNotReturnedReason": null,
                "Fault": {
                    "FaultCode": "",
                    "FaultDescription": ""
                }
            }
        }

        const job2SysId = createAsyncJob(requestId, "request_2", openPayload);

        const job1 = new GlideRecord("x_nscgg_syncbridge_async_job");
        if (!job1.get(job1SysId)) {
            throw new Error(`Async job not found: ${job1SysId}`);
        }

        gs.eventQueue(
            "x_nscgg_syncbridge.long_request.process",
            job1,
            job1SysId,
            "request_1"
        );

        const job2 = new GlideRecord("x_nscgg_syncbridge_async_job");
        if (!job2.get(job2SysId)) {
            throw new Error(`Async job not found: ${job2SysId}`);
        }

        gs.eventQueue(
            "x_nscgg_syncbridge.long_request.process",
            job2,
            job2SysId,
            "request_2"
        );

        setResponse(response, 200, {
            "timeStamp": new Date().toISOString(),
            "status": "Accepted",
            "fault": null,
            "work_order": {
                "number": workOrderNumber,
                "sys_id": workOrderSysId,
            },
            "jobs": [
                job1.getUniqueValue(),
                job2.getUniqueValue(),
            ],
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

    try {
        const woNumber = getString(flat, "updateServiceRequest.vendorTicketId");

        const wo = new GlideRecord("wm_order");

        wo.addQuery("number", woNumber);
        wo.setLimit(1);
        wo.query();

        if (!wo.next()) {
            throw new Error(`Work order not found: ${woNumber}`);
        }

        const workNote = body["updateServiceRequest"]["remarks"][0]["text"];
        wo.setValue("work_notes", workNote);
        wo.update();

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

export function cancelServiceRequest(request: any, response: any) {
    const requestId = gs.generateGUID();
    const body = request.body?.data ?? {};
    const flat = flattenJson(body);

    gs.info(`[SynOpsAPI][${requestId}] Received cancelServiceRequest with body: ${JSON.stringify(body)}`);
    gs.info(`[SynOpsAPI][${requestId}] Flattened body: ${JSON.stringify(flat)}`);

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
