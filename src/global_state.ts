const Global_State = {
  isDev: process.env.IS_DEV === 'true',
  port_server_http: 3500,
  protocoll_register: 'data7',
  events: {
    set_app_pass: 'set_app_pass',
    get_app_pass: 'get_app_pass',
    get_app_config: 'get_app_config',
    set_app_config: 'set_app_config',
    open_qrcode: 'open-qrcode',
    close_qrcode: 'close-qrcode',
    update_qrcode: 'update-qrcode',
    send_message_whats: 'send-message-whats',
    login_with_qrcode: 'login_with_qrcode',
  },
};

export { Global_State };
