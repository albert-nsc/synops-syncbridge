import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    bom_json: {
                        table: 'sys_module'
                        id: 'b16f6baa243d40d1a6ba0affe0c72f37'
                    }
                    br0: {
                        table: 'sys_script'
                        id: 'bb242ea1d87e458a8b1000838a04b2b2'
                        deleted: true
                    }
                    cs0: {
                        table: 'sys_script_client'
                        id: 'abf364adbc35411f9e8ebf9527a6f712'
                        deleted: true
                    }
                    package_json: {
                        table: 'sys_module'
                        id: 'ff51e4a4910a45229faf2b06295148e2'
                    }
                    src_server_apiHandlers_ts: {
                        table: 'sys_module'
                        id: 'cc63cd6ed33148aebeb9dbf2fe54f2d6'
                    }
                    src_server_script_ts: {
                        table: 'sys_module'
                        id: '46294053c489473291b34e8008e22c2d'
                        deleted: true
                    }
                    synops_api_v1: {
                        table: 'sys_ws_version'
                        id: '0a5ab3f907224f7da817bbed54f82fd8'
                    }
                    synops_cancel_service_request: {
                        table: 'sys_ws_operation'
                        id: 'f74808cfa731474f9ba4fdd8c04114e8'
                    }
                    synops_create_service_request: {
                        table: 'sys_ws_operation'
                        id: '955a308eed1244e88dfb78314803510e'
                    }
                    synops_echo: {
                        table: 'sys_ws_operation'
                        id: '14327b4fd3d34aa1b33541789d245d4d'
                        deleted: true
                    }
                    synops_hello: {
                        table: 'sys_ws_operation'
                        id: '6a64f113b4024ec0b2e39818b4f233a6'
                        deleted: true
                    }
                    synops_incident_by_number: {
                        table: 'sys_ws_operation'
                        id: '5e46781bb88f4d6e87dc62148652854a'
                        deleted: true
                    }
                    synops_rest_api: {
                        table: 'sys_ws_definition'
                        id: '75a99162d2d84f9e8cdeb3c6f20e9b75'
                    }
                    synops_update_service_request: {
                        table: 'sys_ws_operation'
                        id: '97261fd7cd7f4d1b9c15db98d91ee9bd'
                    }
                }
            }
        }
    }
}
