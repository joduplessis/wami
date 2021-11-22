export const typeDefs = `
    scalar Date

    type User {
        _id: String!
        email: String
        password: String
        forgotten_password: String
        onboarding: String
        name: String
        description: String
        title: String
        image: String
        contact: String
        country: String
        timezone: String
        dob: Date
        color: String
        weight: Float
        height: Float
        ethnicity: String
        gender: String
        card: String
        vendor: String
        token: String
        device: String
        rating: Float
        offline: Boolean
        tags: [Tag]
        descriptors: [String]
        plan: Int
        professional: [String]
        banking: [String]
        conditions: [String]
        consultations: [String]
        goals: [String]
        calendar: Calendar
        bank: String
        branch: String
        account: String
        createdAt: Date
        updatedAt: Date
    }

    type Task {
        _id: String!
        text: String
        description: String
        date: Date
        completed: Boolean
        user: User
        contact: User
        tasklist: TaskList
        createdAt: Date
        updatedAt: Date
    }

    type TaskList {
        _id: String!
        title: String
        subtitle: String
        topic: String
        createdAt: Date
        updatedAt: Date
    }

    type Rating {
        _id: String!
        user: User
        rating: Float
    }

    type Attendee {
        _id: String!
        user: User
        status: String
    }

    type Location {
        _id: String!
        type: String!
        coordinates: [Float]
    }

    type Transaction {
        _id: String!
        title: String!
        description: String
        amount: Float
        user: User
        expert: User
        event: Event
        createdAt: Date
        updatedAt: Date
    }

    type Tag {
        _id: String!
        name: String
        description: String
        image: Float
        color: String
        createdAt: Date
        updatedAt: Date
    }

    type Message {
        _id: String!
        text: String
        mime: String
        url: String
        reactions: [String]
        topic: String
        sender: User
        createdAt: Date
        updatedAt: Date
    }

    type Group {
        _id: String!
        name: String
        color: String
        image: String
        members: [User]
        createdAt: Date
        updatedAt: Date
    }

    type Contact {
        _id: String
        user: User
        contact: User
        conditions: [String]
        consultations: [String]
        goals: [String]
        card: String
        vendor: String
        token: String
        active: Date
        confirmed: Boolean
        createdAt: Date
        updatedAt: Date
    }

    type Event {
        _id: String!
        notes: String
        processed: Boolean
        rate: Float
        location: Location
        address: String
        start: Date
        end: Date
        offline: Boolean
        mandatory: Boolean
        owner: User
        expert: User
        calendar: Calendar
        attendees: [Attendee]
        createdAt: Date
        updatedAt: Date
    }

    type Channel {
        _id: String!
        name: String
        description: String
        image: String
        tags: [Tag]
        private: Boolean
        user: User
        group: Group
        members: [User]
        createdAt: Date
        updatedAt: Date
    }

    type Calendar {
        _id: String!
        available: Float
        rate: Float
        days: [String]
        start: String
        end: String
        daybreak: String
        interval: Float
        timezone: String
        address: String
        location: Location
        user: User
        createdAt: Date
        updatedAt: Date
    }

    # the schema allows the following query:
    type Query {
        groups(id: String!): [Group]
        contacts(id: String!): [Contact]
        contact(id: String!): Contact
        tags: [Tag]
        tag(id: String!): Tag
        messages(topic: String!): [Message]
        events(id: String!): [Event]
        userRating(id: String!): Float
        channels(id: String!): [Channel]
        usersForTag(tag: String!, count: Int!): [User]
        userTransactions(id: String!, count: Int!): [Transaction]
        user(id: String!): User
        userContact(id: String!, cid: String!): Contact
        userAvailability(id: String!): [String]
        userTasks(id: String!): [Task]
        userTasksFromCoach(id: String!, cid: String!): [Task]
        users: [User]
        userSearch(term: String!): [User]
        coachSearch(tag: String!, term: String!): [User]
        calendarsGeo(longitude: Float!, latitude: Float!): [Calendar]
        channelSearch(term: String!): [Channel]
        channelsForTag(tag: String!, count: Int!): [Channel]
        channel(id: String!): Channel
        group(id: String!): Group
        groupMembers(id: String!): [User]
        groupChannels(id: String!): [Channel]
        channelMembers(id: String!): [User]
        attachments(topic: String!): [Message]
        event(id: String!): Event
        calendar(id: String!): Calendar
    }
`;
