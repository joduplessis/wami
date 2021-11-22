import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { generatePasswordHash } from "../helpers";
import {
    DEFAULT_IMAGE,
    DEFAULT_DESCRIPTION,
    DEFAULT_COLOR,
    DEFAULT_TAG,
    DEFAULT_COUNTRY,
    DEFAULT_TIMEZONE,
    DEFAULT_DATE,
} from "../helpers";

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            validate: (email) => {
                const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

                return emailRegex.test(email);
            },
        },
        password: String,
        forgotten_password: String,
        onboarding: String,
        bank: String,
        branch: String,
        account: String,
        name: { type: String, default: null },
        description: { type: String, default: DEFAULT_DESCRIPTION },
        title: { type: String, default: null },
        image: { type: String, default: DEFAULT_IMAGE },
        contact: { type: String, default: null },
        country: { type: String, default: DEFAULT_COUNTRY },
        timezone: { type: String, default: DEFAULT_TIMEZONE },
        dob: { type: String, default: DEFAULT_DATE },
        color: { type: String, default: DEFAULT_COLOR },
        weight: { type: Number, default: null },
        height: { type: Number, default: null },
        ethnicity: { type: String, default: null },
        gender: { type: String, default: null },
        card: { type: String, default: null },
        vendor: { type: String, default: null },
        token: { type: String, default: null },
        device: { type: String, default: null },
        rating: { type: String, default: 0 },
        offline: { type: Boolean, default: false },
        tags: [
            {
                type: mongoose.Schema.Types.ObjectId,
                default: null,
                ref: "Tag",
            },
        ],
        descriptors: { type: [String], default: [] },
        plan: { type: String, default: 0 },
        professional: { type: [String], default: [] },
        banking: { type: [String], default: [] },
        conditions: { type: [String], default: [] },
        consultations: { type: [String], default: [] },
        goals: { type: [String], default: [] },
        calendar: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
            ref: "Calendar",
        },
    },
    { timestamps: true }
);

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

// Before we save, we encrypt the password
UserSchema.pre("save", function (next) {
    const user = this;

    if (!user.isModified("password")) return next();

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

UserSchema.index({
    name: "text",
    description: "text",
    title: "text",
    tags: "text",
});

export const UserModel = mongoose.model("User", UserSchema);
