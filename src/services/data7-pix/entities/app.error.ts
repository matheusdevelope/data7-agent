export default class AppError extends Error {
  constructor(
    readonly id: string,
    readonly operaction: string,
    message: string,
    readonly details: string,
    readonly value: string,
  ) {
    super(message);
  }

  //create method from json
  static fromJson(json: any): AppError {
    return new AppError(
      json.id || json.Id,
      json.operaction || json.Operaction,
      json.message || json.Message,
      json.details || json.Details,
      json.value || json.Value,
    );
  }

  //create method to json
  toJson(): any {
    return {
      id: this.id,
      operaction: this.operaction,
      message: this.message,
      details: this.details,
      value: this.value,
    };
  }

  //create method from object
  static fromObject(obj: any): AppError {
    return new AppError(
      obj.id || obj.Id,
      obj.operaction || obj.Operaction,
      obj.message || obj.Message,
      obj.details || obj.Details,
      obj.value || obj.Value,
    );
  }
}
