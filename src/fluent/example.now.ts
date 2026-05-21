import { RestApi } from "@servicenow/sdk/core";
import { createServiceRequest, updateServiceRequest, cancelServiceRequest } from "../server/apiHandlers";

RestApi({
    $id: Now.ID["synops_rest_api"],
    name: "SynOps API",
    serviceId: "synops",
    shortDescription: "Custom SynOps integration API",
    consumes: "application/json",
    produces: "application/json",

    versions: [
        {
            $id: Now.ID["synops_api_v1"],
            version: 1,
            active: true,
            isDefault: true,
        },
    ],

    routes: [
        {
            $id: Now.ID["synops_create_service_request"],
            name: "Create service request",
            path: "/createServiceRequest",
            method: "POST",
            version: 1,
            script: createServiceRequest,
        },
        {
            $id: Now.ID["synops_update_service_request"],
            name: "Update service request",
            path: "/updateServiceRequest",
            method: "POST",
            version: 1,
            script: updateServiceRequest,
        },
        {
            $id: Now.ID["synops_cancel_service_request"],
            name: "Cancel service request",
            path: "/cancelServiceRequest",
            method: "POST",
            version: 1,
            script: cancelServiceRequest,
        },
    ],
});