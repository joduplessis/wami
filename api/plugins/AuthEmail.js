export const AuthEmail = {
    name: "AuthEmail",
    version: "1.0.0",
    register: async function (server, options) {
        server.auth.scheme("email", (server, options) => {
            return {
                authenticate: function (request, h) {
                    const req = request.raw.req;

                    // If it's not there
                    if (!req.headers.email)
                        return h
                            .response({ message: "No email present" })
                            .code(401)
                            .takeover();

                    return h.authenticated({ credentials: { email } });
                },
            };
        });
    },
};
