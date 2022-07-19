import { Global_State } from '../../global_state';
import { MakeParamsFromObj } from '../../utils';
import { GenerateJWT } from './jwt';

const DataToLoginMobile = {
  ip: Global_State.local_ip,
  username_machine: Global_State.username_machine,
  port: Global_State.port_server_http,
  token: GenerateJWT(15),
};

const URL_Login_Mobile = (DataToLoginMobile: IDataToLoginMobile) => {
  const baseURL = 'data7://login?';
  const params = MakeParamsFromObj(DataToLoginMobile).join('&');
  return `${baseURL}${params}`;
};

export { URL_Login_Mobile, DataToLoginMobile };
