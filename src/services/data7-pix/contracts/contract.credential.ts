import { PathLike } from 'fs';

export default interface ContractCredential {
  clientId: string;
  clientSecret: string;
  pathCert: PathLike;
  sandbox: boolean;
  partnerToken?: string;
  rawResponse?: any;
  baseUrl?: string;
  validateMtls?: boolean;
}
