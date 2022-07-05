import fs from 'fs';
import AppError from '../entities/app.error';
import Cobranca from '../entities/cobranca';

export default class WatchPatch {
  constructor(readonly patch: string) {}

  public listen(callBack: (cobrancas: Cobranca[], filename: string) => void): void {
    fs.watch(this.patch, (eventType, filename) => {
      if (!this.patch || !filename.endsWith('.json') || filename.endsWith(".read'")) return;
      if (eventType === 'rename') return;

      try {
        const cobrancas: Cobranca[] = [];
        const data = this.readFile(filename);
        const jsonArray = this.convertToJson(data)['Data'];
        this.renameFile(filename);

        if (!Array.isArray(jsonArray))
          throw new AppError('', 'JSON', 'ERROR JSON FILE', 'JSON NAO CONTE UMA ARRAY', filename);

        jsonArray?.forEach((json: any) => {
          cobrancas.push(Cobranca.fromJson(json));
        });

        callBack(cobrancas, filename);
      } catch (error: any) {
        console.log(error);
      }
    });
  }

  private readFile(filename: string): string {
    const fullPath = `${this.patch}/${filename}`;
    const data = fs.readFileSync(fullPath, 'utf8');
    return data;
  }

  private renameFile(filename: string): void {
    const fullPath = `${this.patch}/${filename}`;
    const newName = `${this.patch}/${filename.replace('.json', '').toUpperCase()} ${new Date().getTime()}.read`;
    fs.renameSync(fullPath, newName);
  }

  private convertToJson(data: string): any {
    return JSON.parse(data);
  }
}
