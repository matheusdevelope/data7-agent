const Global_State = {
  isDev: process.env.IS_DEV === 'true',
  port_server_http: 3500,
  events: {
    open_qrcode: 'open-qrcode',
    close_qrcode: 'close-qrcode',
    new_qrcode: 'new-qrcode',
    update_qrcode: 'update-qrcode',
    send_message_whats: 'send-message-whats',
  },
};

export { Global_State };
