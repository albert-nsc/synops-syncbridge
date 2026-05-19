import { RestApi } from "@servicenow/sdk/core";
import { hello, echo, getIncident } from "../server/apiHandlers";

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
            $id: Now.ID["synops_hello"],
            name: "Hello",
            path: "/hello",
            method: "GET",
            version: 1,
            script: hello,
        },
        {
            $id: Now.ID["synops_echo"],
            name: "Echo",
            path: "/echo",
            method: "POST",
            version: 1,
            script: echo,
        },
        {
            $id: Now.ID["synops_incident_by_number"],
            name: "Get incident by number",
            path: "/incident/{number}",
            method: "GET",
            version: 1,
            script: getIncident,
        },
    ],
});