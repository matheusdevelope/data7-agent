import { PathLike } from 'fs';

export default interface ContractCredentialPIX {
  client_id: string;
  client_secret: string;
  pix_cert: PathLike;
  sandbox: boolean;
  partner_token?: string;
}
