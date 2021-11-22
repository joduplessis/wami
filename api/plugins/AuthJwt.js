const jwt = require("../helpers/jwt");
import { SECRET } from "../helpers";

export const AuthJwt = {
    name: "AuthJwt",
    version: "1.0.0",
    register: async function (server, options) {
        server.auth.scheme("jwt", (server, options) => {
            return {
                authenticate: function (request, h) {
                    const req = request.raw.req;

                    // If it's not there
                    if (!req.headers.authorization)
                        return h
                            .response({ message: "No auth token present" })
                            .code(401)
                            .takeover();
                    if (!req.headers.authorization.split(" ")[1])
                        return h
                            .response({ message: "No Bearer prefix" })
                            .code(401)
                            .takeover();

                    try {
                        const { authorization } = req.headers;
                        const token = authorization.split(" ")[1];
                        const payload = jwt.decode(token, SECRET);
                        const { sub, exp } = payload;

                        // If it's expired
                        if (exp < Date.now() / 1000)
                            return h
                                .response({
                                    message: "Expired token, please log in",
                                })
                                .code(401)
                                .takeover();

                        return h.authenticated({ credentials: { user: sub } });
                    } catch (err) {
                        console.log(err);
                        return h
                            .response({ message: "Token invalidated." })
                            .code(401)
                            .takeover();
                    }
                },
            };
        });
    },
};
