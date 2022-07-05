import { PathLike } from 'fs';
import ContractCredential from '../contracts/contract.credential';

export default class Credenciais implements ContractCredential {
  //creat constructor to initialize the class
  constructor(
    public clientId: string,
    public clientSecret: string,
    public pathCert: PathLike,
    public sandbox: boolean,
    public partnerToken?: string,
    public rawResponse?: any,
    public baseUrl?: string,
    public validateMtls?: boolean,
  ) {}
}
