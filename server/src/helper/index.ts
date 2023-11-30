import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const replaceStringNoSpace = (...data: any) => {
    const regexStringReplace = /\s+/g;
    let strs = "";
    data.map((str: string) => {
        return (strs += str);
    });
    return strs.replace(regexStringReplace, "").toLowerCase();
};
// export const helperJWT = {
//     createAccessToken: user => {
//         return new Promise((resolve, reject) => {
//             jwt.sign(
//                 user,
//                 process.env.JWT_SECRET!,
//                 { expiresIn: "1d" },
//                 (err, accessToken) => {
//                     if (err) reject(creatError.InternalServerError());
//                     resolve(accessToken);
//                 }
//             );
//         });
//     },
//     createRefreshToken: user => {
//         return new Promise((resolve, reject) => {
//             jwt.sign(
//                 user,
//                 REFRESH_TOKEN_SECRET,
//                 { expiresIn: "30d" },
//                 (err, refreshTToken) => {
//                     if (err) reject(creatError.InternalServerError());
//                     resolve(refreshTToken);
//                 }
//             );
//         });
//     },
//     authorizationToken: (req, res, next) => {
//         try {
//             if (!req.headers["authorization"]) return next(creatError.Unauthorized());
//             const authHeader = req.headers["authorization"];
//             const bearerToken = authHeader.split(" ");
//             const token = bearerToken[1];
//             jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
//                 if (err) {
//                     const message =
//                         err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
//                     return next(creatError.Unauthorized(message));
//                 }
//                 req.id = decoded.id;
//                 next();
//             });
//         } catch (error) {
//             next(creatError.Unauthorized());
//         }
//     },
// };
export const generatePassword = async (pass: string) => {
    const salt = 10;
    const password = await bcrypt.hash(pass, salt);
    return password;
};

