import * as jwt from 'jsonwebtoken';
const key = 'spdifnglkfnlksfgoisfsrgpin';
function GenerateJWT() {
  return jwt.sign({}, key, {
    expiresIn: 60 * 60, //one hour
  });
}

function ValidateJWT(token: string) {
  jwt.verify(token, key, (err, decoded) => {
    if (err) return false;
    return decoded;
  });
}

export { GenerateJWT, ValidateJWT };
