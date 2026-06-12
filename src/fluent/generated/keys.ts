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
                    'long-request-process-event': {
                        table: 'sysevent_register'
                        id: 'e1128d2f155f45f79cc3e3918b26c2f0'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: 'ff51e4a4910a45229faf2b06295148e2'
                    }
                    'process-long-request-action': {
                        table: 'sysevent_script_action'
                        id: 'e56fbe810796414788d8be98cc8b8ddd'
                    }
                    src_server_apiHandlers_ts: {
                        table: 'sys_module'
                        id: 'cc63cd6ed33148aebeb9dbf2fe54f2d6'
                    }
                    src_server_processLongRequest_ts: {
                        table: 'sys_module'
                        id: '9544e6fe93204451ae2dd1ef6c073c8c'
                    }
                    src_server_script_ts: {
                        table: 'sys_module'
                        id: '46294053c489473291b34e8008e22c2d'
                        deleted: true
                    }
                    src_server_scriptActions_processLongRequest_ts: {
                        table: 'sys_module'
                        id: '9bd4bb28019543b68ccbafba240f832f'
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
                    synops_rest_acl: {
                        table: 'sys_security_acl'
                        id: '2618e0e7630a491992d28e9cf365344f'
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
                composite: [
                    {
                        table: 'sys_user_role'
                        id: '024aedd13d0e4bef9047b1ec2526012f'
                        key: {
                            name: 'x_nscgg_syncbridge.synops_api_user'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '05a877121e9740da806a00da489148a6'
                        key: {
                            name: 'x_nscgg_syncbridge_async_job'
                            element: 'request_id'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '128b044ff2bb4d4a81a7fe6f19c4c22d'
                        key: {
                            name: 'x_nscgg_syncbridge_async_job'
                            element: 'request_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '174b40b89ca3481cb1066fa82e3bf73b'
                        key: {
                            name: 'x_nscgg_syncbridge_async_job'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '277d4c14171b40d698325841624189ca'
                        key: {
                            name: 'x_nscgg_syncbridge_async_job'
                            element: 'target'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '301f4292d84b444f8850061193d1f98c'
                        key: {
                            name: 'x_nscgg_syncbridge_async_job'
                            element: 'error'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '44016ccf2fd04ac7a7f7e2260e78468b'
                        key: {
                            name: 'x_nscgg_syncbridge_async_job'
                            element: 'state'
                            value: 'failed'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4cab0589c3c7468c9943e9154c0c54af'
                        key: {
                            name: 'x_nscgg_syncbridge_async_job'
                            element: 'state'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '5caff4cc3a914a9eb4d125d3731f92a2'
                        key: {
                            name: 'x_nscgg_syncbridge_async_job'
                            element: 'state'
                            value: 'processing'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '64b611836b884280834d8d6e9563dc75'
                        key: {
                            name: 'x_nscgg_syncbridge_async_job'
                            element: 'attempts'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '73c270e2dc0e4b3a9b7a92480e56e374'
                        key: {
                            name: 'x_nscgg_syncbridge_async_job'
                            element: 'completed_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7d3f1c2e588a4f3bbbd01fd697d66ca3'
                        key: {
                            name: 'x_nscgg_syncbridge_async_job'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '804ff7a97f6441eb9661004b5b931f29'
                        key: {
                            name: 'x_nscgg_syncbridge_async_job'
                            element: 'started_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '916c34db2beb44749ab1385b4a978c63'
                        key: {
                            name: 'x_nscgg_syncbridge_async_job'
                            element: 'payload'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9444bbb1875540a4bdf3815434caef51'
                        key: {
                            name: 'x_nscgg_syncbridge_async_job'
                            element: 'completed_at'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '94e3219bc2e94182bb2f6d79c4a66984'
                        key: {
                            name: 'x_nscgg_syncbridge_async_job'
                            element: 'state'
                            value: 'queued'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '951f986e5cb94ccb877f9c2229691ceb'
                        key: {
                            name: 'x_nscgg_syncbridge_async_job'
                            element: 'payload'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9909716c57a849e39e1a7fc223a1d4e8'
                        key: {
                            name: 'x_nscgg_syncbridge_async_job'
                            element: 'state'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'af7c93631e0e41b587cad64b053e2c24'
                        key: {
                            name: 'x_nscgg_syncbridge_async_job'
                            element: 'target'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'bad937dcbfde44a39901527046239a80'
                        key: {
                            sys_security_acl: '2618e0e7630a491992d28e9cf365344f'
                            sys_user_role: {
                                id: '024aedd13d0e4bef9047b1ec2526012f'
                                key: {
                                    name: 'x_nscgg_syncbridge.synops_api_user'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c18a9306ee91457ba1b8e2d43c20e2dd'
                        key: {
                            name: 'x_nscgg_syncbridge_async_job'
                            element: 'attempts'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'ca65344385084a088927db7976e1000c'
                        key: {
                            name: 'x_nscgg_syncbridge_async_job'
                            element: 'state'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'dba6a4e558e34d51bf6d791d3ff8af52'
                        key: {
                            name: 'x_nscgg_syncbridge_async_job'
                            element: 'started_at'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f1188cea52d244d98ff0e6169e6af08a'
                        key: {
                            name: 'x_nscgg_syncbridge_async_job'
                            element: 'error'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'f2f59995e18f44fe915aae8bfc23da7f'
                        key: {
                            name: 'x_nscgg_syncbridge_async_job'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'f344c62db2084c2d967449d2b2d7f5ed'
                        key: {
                            name: 'x_nscgg_syncbridge_async_job'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'ff097e641bc843aea60ba8539e18bfbf'
                        key: {
                            name: 'x_nscgg_syncbridge_async_job'
                            element: 'state'
                            value: 'completed'
                        }
                    },
                ]
            }
        }
    }
}
