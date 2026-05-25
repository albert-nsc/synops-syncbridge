import { Acl, Role } from "@servicenow/sdk/core";

export const synopsApiRole = Role({
    $id: Now.ID["synops_api_role"],
    name: "x_nscgg_syncbridge.synops_api_user",
    description: "Allows access to SynOps Scripted REST API endpoints",
});

export const synopsRestAcl = Acl({
    $id: Now.ID["synops_rest_acl"],
    name: "SynOps REST API ACL",
    type: "rest_endpoint",
    active: true,
    admin_overrides: false,
    operation: "execute",
    roles: [synopsApiRole],
});
