import * as jwt from 'jsonwebtoken';
const key = 'spdifnglkfnlksfgoisfsrgpin';
function GenerateJWT(expiration_seconds?: number) {
  return jwt.sign({}, key, {
    expiresIn: expiration_seconds ? expiration_seconds : 60, //one minute
  });
}

function ValidateJWT<T>(token: string) {
  let result: T | string | jwt.JwtPayload | undefined | false;
  jwt.verify(token, key, (err, decoded) => {
    if (err) result = false;
    result = decoded;
  });
  return result;
}

export { GenerateJWT, ValidateJWT };
