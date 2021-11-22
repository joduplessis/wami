import crypto from "crypto";
import { SECRET } from "./";

exports.encode = function (payload, secret) {
    const header = {
        typ: "JWT",
        alg: "HS256",
    };

    const jwt =
        base64Encode(JSON.stringify(header)) +
        "." +
        base64Encode(JSON.stringify(payload));

    return jwt + "." + sign(jwt, secret);
};

exports.decode = function (token, secret) {
    const segments = token.split(".");

    if (segments.length !== 3) return new Error("Token structure not correct");

    const header = JSON.parse(base64Decode(segments[0]));
    const payload = JSON.parse(base64Decode(segments[1]));
    const rawSignature = segments[0] + "." + segments[1];

    if (!verify(rawSignature, SECRET, segments[2]))
        throw new Error("Verification failed");

    return payload;
};

function verify(rawSignature, secret, signature) {
    return signature === sign(rawSignature, secret);
}

function sign(str, key) {
    return crypto.createHmac("sha256", key).update(str).digest("base64");
}

function base64Encode(str) {
    return new Buffer(str).toString("base64");
}

function base64Decode(str) {
    return new Buffer(str, "base64").toString();
}
