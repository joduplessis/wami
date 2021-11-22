import {
    CalendarController,
    ChannelController,
    EventController,
    ContactController,
    GroupController,
    MessageController,
    TransactionController,
    UserController,
    AuthController,
    TaskController,
} from "../controllers";

export const initRoutes = (app) => {
    app.route({
        method: ["DELETE", "POST", "PUT"],
        path: "/task/{id?}",
        options: { auth: "jwt" },
        handler: TaskController.Task,
    });
    app.route({
        method: ["DELETE", "POST", "PUT"],
        path: "/tasklist/{id?}",
        options: { auth: "jwt" },
        handler: TaskController.TaskList,
    });

    app.route({
        method: ["POST", "PUT"],
        path: "/message/{id?}",
        options: { auth: "jwt" },
        handler: MessageController.Message,
    });
    app.route({
        method: "POST",
        path: "/message/{id}/reactions/remove",
        options: { auth: "jwt" },
        handler: MessageController.Reactions.Remove,
    });
    app.route({
        method: "POST",
        path: "/message/{id}/reactions/add",
        options: { auth: "jwt" },
        handler: MessageController.Reactions.Add,
    });

    app.route({
        method: ["DELETE", "PUT", "POST"],
        path: "/contact/{id?}",
        options: { auth: "jwt" },
        handler: ContactController.Contact,
    });
    app.route({
        method: "POST",
        path: "/contact/{id}/confirm",
        options: { auth: "jwt" },
        handler: ContactController.Confirm,
    });
    app.route({
        method: "POST",
        path: "/contact/{id}/call",
        options: { auth: "jwt" },
        handler: ContactController.Call,
    });

    app.route({
        method: "PUT",
        path: "/calendar/{id}",
        options: { auth: "jwt" },
        handler: CalendarController,
    });

    app.route({
        method: ["DELETE", "POST", "PUT"],
        path: "/group/{id?}",
        options: { auth: "jwt" },
        handler: GroupController.Group,
    });
    app.route({
        method: "POST",
        path: "/group/{id}/member/add",
        options: { auth: "jwt" },
        handler: GroupController.Member.Add,
    });
    app.route({
        method: "POST",
        path: "/group/{id}/member/remove",
        options: { auth: "jwt" },
        handler: GroupController.Member.Remove,
    });

    app.route({
        method: ["DELETE", "POST", "PUT"],
        path: "/channel/{id?}",
        options: { auth: "jwt" },
        handler: ChannelController.Channel,
    });
    app.route({
        method: "POST",
        path: "/channel/{id}/member/add",
        options: { auth: "jwt" },
        handler: ChannelController.Member.Add,
    });
    app.route({
        method: "POST",
        path: "/channel/{id}/member/remove",
        options: { auth: "jwt" },
        handler: ChannelController.Member.Remove,
    });

    app.route({
        method: ["PUT", "POST", "DELETE"],
        path: "/event/{id?}",
        options: { auth: "jwt" },
        handler: EventController.Event,
    });
    app.route({
        method: "POST",
        path: "/event/{id}/attendee/update",
        options: { auth: "jwt" },
        handler: EventController.Attendee.Update,
    });
    app.route({
        method: "POST",
        path: "/event/{id}/process",
        options: { auth: "jwt" },
        handler: EventController.Process,
    });

    app.route({
        method: "POST",
        path: "/upload",
        handler: AuthController.Upload,
    });
    app.route({
        method: "POST",
        path: "/login",
        handler: AuthController.Login,
    });
    app.route({
        method: "POST",
        path: "/password/reset",
        handler: AuthController.Password.Reset,
    });
    app.route({
        method: "POST",
        path: "/password/update",
        handler: AuthController.Password.Update,
    });
    app.route({
        method: "POST",
        path: "/signup",
        handler: AuthController.Signup,
    });

    app.route({
        method: "PUT",
        path: "/user/{id}/offline",
        handler: UserController.Offline,
        options: { auth: "jwt" },
    });
    app.route({
        method: "PUT",
        path: "/user/{id}/device",
        handler: UserController.Device,
        options: { auth: "jwt" },
    });
    app.route({
        method: "PUT",
        path: "/user/{id}/rating",
        handler: UserController.Rating,
        options: { auth: "jwt" },
    });
    app.route({
        method: "PUT",
        path: "/user/{id}",
        handler: UserController.User,
        options: { auth: "jwt" },
    });
    app.route({
        method: "POST",
        path: "/user/onboarding/token",
        handler: UserController.Onboarding.Token,
    });
    app.route({
        method: "POST",
        path: "/user/onboarding/complete",
        handler: UserController.Onboarding.Complete,
    });
    app.route({
        method: "POST",
        path: "/user/{id}/rating",
        options: { auth: "jwt" },
        handler: UserController.Rating,
    });

    app.route({
        method: "POST",
        path: "/transaction",
        options: { auth: "jwt" },
        handler: TransactionController,
    });

    app.route({
        method: "POST",
        path: "/user/{token}/documents/professional",
        handler: UserController.Documents.Professional,
        config: {
            payload: {
                output: "stream",
                allow: "multipart/form-data",
            },
            cors: {
                origin: ["*"],
                additionalHeaders: ["cache-control", "x-requested-with"],
            },
        },
    });

    app.route({
        method: "POST",
        path: "/user/{token}/documents/banking",
        handler: UserController.Documents.Banking,
        config: {
            payload: {
                output: "stream",
                allow: "multipart/form-data",
            },
            cors: {
                origin: ["*"],
                additionalHeaders: ["cache-control", "x-requested-with"],
            },
        },
    });
};
