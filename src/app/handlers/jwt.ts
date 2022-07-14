import * as jwt from 'jsonwebtoken';
const key = 'spdifnglkfnlksfgoisfsrgpin';
function GenerateJWT() {
  return jwt.sign({}, key, {
    expiresIn: 60 * 60, //one hour
  });
}

function ValidateJWT(token: string) {
  let result;
  jwt.verify(token, key, (err, decoded) => {
    if (err) result = false;
    result = decoded;
  });
  return result;
}

export { GenerateJWT, ValidateJWT };
