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
                    }
                    cs0: {
                        table: 'sys_script_client'
                        id: 'abf364adbc35411f9e8ebf9527a6f712'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: 'ff51e4a4910a45229faf2b06295148e2'
                    }
                    src_server_script_ts: {
                        table: 'sys_module'
                        id: '46294053c489473291b34e8008e22c2d'
                    }
                }
            }
        }
    }
}
