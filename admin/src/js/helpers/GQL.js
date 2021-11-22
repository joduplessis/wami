import gql from "graphql-tag";
import * as axios from "axios";
import { API_PATH, USER, GROUP, CHANNEL } from "./";

export const GQL = {
    fetchUserAccount: (id, token) => {
        return axios({
            url: `${API_PATH}/graphql`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer: ${token}`,
            },
            data: JSON.stringify({
                query: `
                    query FetchUser($id: String!) {
                        user(id: $id) {
                            _id
                            email
                            name
                            image
                            country
                            dob
                            color
                            timezone
                        }
                    }
                `,
                variables: {
                    id,
                },
            }),
        });
    },

    fetchUser: (id, token) => {
        return axios({
            url: `${API_PATH}/graphql`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer: ${token}`,
            },
            data: JSON.stringify({
                query: `
                    query FetchUser($id: String!) {
                        userAvailability(id: $id)
                        user(id: $id) {
                            _id
                            email
                            name
                            description
                            title
                            image
                            contact
                            country
                            dob
                            color
                            card
                            vendor
                            token
                            device
                            rating
                            tags
                            plan
                            timezone
                            calendar {
                                _id
                                timezone
                                address
                                location {
                                    coordinates
                                    type
                                }
                                rate
                            }
                        }
                    }
                `,
                variables: {
                    id,
                },
            }),
        });
    },

    fetchUserSearch: (term, token) => {
        return axios({
            url: `${API_PATH}/graphql`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer: ${token}`,
            },
            data: JSON.stringify({
                query: `
                    query SearchUsers($term: String!) {
                        userSearch(term: $term) {
                            _id
                            email
                            name
                            description
                            title
                            image
                            contact
                            country
                            dob
                            color
                            tags
                        }
                    }
                `,
                variables: {
                    term,
                },
            }),
        });
    },

    fetchUserTransactions: (id, token) => {
        return axios({
            url: `${API_PATH}/graphql`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer: ${token}`,
            },
            data: JSON.stringify({
                query: `
                    query Transactions($id: String!) {
                        userTransactions(id: $id, count: 50) {
                            _id
                            title
                            description
                            createdAt
                            amount
                        }
                    }
                `,
                variables: { id },
            }),
        });
    },

    fetchChannel: (id, token) => {
        return axios({
            url: `${API_PATH}/graphql`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer: ${token}`,
            },
            data: JSON.stringify({
                query: `
                    query FetchChannel($id: String!) {
                        channel(id: $id) {
                            _id
                            name
                            description
                            image
                            private
                            tags
                            user {
                                _id
                                name
                                image
                                color
                            }
                            group {
                                _id
                                image
                                name
                                color
                                members {
                                    _id
                                }
                            }
                            members {
                                _id
                            }
                        }
                    }
                `,
                variables: { id },
            }),
        });
    },

    fetchGroup: (id, token) => {
        return axios({
            url: `${API_PATH}/graphql`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer: ${token}`,
            },
            data: JSON.stringify({
                query: `
                    query Group($id: String!) {
                        group(id: $id) {
                            _id
                            name
                            color
                            image
                            members {
                                _id
                                name
                                image
                                color
                                title
                            }
                        }
                    }
                `,
                variables: { id },
            }),
        });
    },

    fetchTag: (tag, count, token) => {
        return axios({
            url: `${API_PATH}/graphql`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer: ${token}`,
            },
            data: JSON.stringify({
                query: `
                    query FetchTag($tag: String!, $count: Int!) {
                        usersForTag(tag: $tag, count: $count) {
                            _id
                            name
                            title
                            image
                            rating
                            color
                            calendar {
                                available
                            }
                        }
                        channelsForTag(tag: $tag, count: $count) {
                            _id
                            name
                            description
                            group {
                                _id
                                name
                                color
                                image
                            }
                            user {
                                _id
                                name
                                color
                                image
                            }
                            image
                            members {
                                _id
                            }
                        }
                    }
                `,
                variables: {
                    tag,
                    count,
                },
            }),
        });
    },

    fetchTagUsers: (tag, count, token) => {
        return axios({
            url: `${API_PATH}/graphql`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer: ${token}`,
            },
            data: JSON.stringify({
                query: `
                    query FetchTag($tag: String!, $count: Int!) {
                        usersForTag(tag: $tag, count: $count) {
                            _id
                            name
                            title
                            image
                            rating
                            color
                            calendar {
                                available
                            }
                        }
                    }
                `,
                variables: {
                    tag,
                    count,
                },
            }),
        });
    },

    fetchTagChannels: (tag, count, token) => {
        return axios({
            url: `${API_PATH}/graphql`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer: ${token}`,
            },
            data: JSON.stringify({
                query: `
                    query FetchTag($tag: String!, $count: Int!) {
                        channelsForTag(tag: $tag, count: $count) {
                            _id
                            name
                            description
                            private
                            group {
                                _id
                                name
                                color
                                image
                            }
                            user {
                                _id
                                name
                                color
                                image
                            }
                            image
                            members {
                                _id
                            }
                        }
                    }
                `,
                variables: {
                    tag,
                    count,
                },
            }),
        });
    },

    fetchEvent: (id, token) => {
        return axios({
            url: `${API_PATH}/graphql`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer: ${token}`,
            },
            data: JSON.stringify({
                query: `
                    query Event($id: String!) {
                        event(id: $id) {
                            _id
                            notes
                            processed
                            rate
                            location {
                                coordinates
                            }
                            address
                            start
                            end
                            offline
                            mandatory
                            owner {
                                _id
                                image
                                color
                                name
                                title
                            }
                            expert {
                                _id
                                name
                                title
                                color
                                image
                            }
                            calendar {
                                _id
                                timezone
                                interval
                            }
                            attendees {
                                status
                                user {
                                    _id
                                    name
                                    image
                                    title
                                    color
                                }
                            }
                        }
                    }
                `,
                variables: { id },
            }),
        });
    },

    fetchCalendarsForGeo: (longitude, latitude, token) => {
        return axios({
            url: `${API_PATH}/graphql`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer: ${token}`,
            },
            data: JSON.stringify({
                query: `
                    query Calendars($longitude: Float!, $latitude: Float!) {
                        calendarsGeo(longitude: $longitude, latitude: $latitude) {
                            available
                            location {
                                coordinates
                            }
                            user {
                                _id
                                name
                                description
                                color
                                tags
                                title
                                image
                                rating
                            }
                        }
                    }
                `,
                variables: {
                    longitude,
                    latitude,
                },
            }),
        });
    },

    fetchGroups: (id, token) => {
        return axios({
            url: `${API_PATH}/graphql`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer: ${token}`,
            },
            data: JSON.stringify({
                query: `
                    query Groups($id: String!) {
                        groups(id: $id) {
                            _id
                            name
                            color
                            image
                            members {
                                _id
                            }
                        }
                    }
                `,
                variables: { id },
            }),
        });
    },

    fetchContacts: (id, token) => {
        return axios({
            url: `${API_PATH}/graphql`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer: ${token}`,
            },
            body: JSON.stringify({
                query: `
                    query Contacts($id: String!) {
                        contacts(id: $id) {
                            _id
                            contact {
                                _id
                                name
                                color
                                image
                                title
                            }
                            user {
                                _id
                                name
                                color
                                image
                                title
                            }
                            confirmed
                        }
                    }
                `,
                variables: { id },
            }),
        });
    },

    fetchTags: (token) => {
        return axios({
            url: `${API_PATH}/graphql`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer: ${token}`,
            },
            body: JSON.stringify({
                query: `
                    {
                        tags {
                            name
                            description
                            color
                            image
                        }
                    }
                `,
            }),
        });
    },

    fetchMessages: (topic, token) => {
        return axios({
            url: `${API_PATH}/graphql`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer: ${token}`,
            },
            data: JSON.stringify({
                query: `
                    query Messages($topic: String!) {
                        messages(topic: $topic) {
                            _id
                            text
                            mime
                            url
                            reactions
                            topic
                            createdAt
                            sender {
                                color
                                name
                                title
                                image
                            }
                        }
                    }
                `,
                variables: {
                    topic,
                },
            }),
        });
    },

    fetchEvents: (id, token) => {
        return axios({
            url: `${API_PATH}/graphql`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer: ${token}`,
            },
            data: JSON.stringify({
                query: `
                    query Events($id: String!) {
                        events(id: $id) {
                            _id
                            notes
                            processed
                            start
                            end
                            owner {
                                _id
                                image
                                color
                                title
                                name
                            }
                            expert {
                                _id
                                image
                                color
                                title
                                name
                            }
                            attendees {
                                status
                                user {
                                    _id
                                    name
                                    image
                                    title
                                }
                            }
                        }
                    }
                `,
                variables: { id },
            }),
        });
    },

    fetchChannels: (id, token) => {
        return axios({
            url: `${API_PATH}/graphql`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer: ${token}`,
            },
            data: JSON.stringify({
                query: `
                    query Channels($id: String!) {
                        channels(id: $id) {
                            _id
                            name
                            description
                            private
                            group {
                                _id
                                name
                                color
                                image
                            }
                            user {
                                _id
                                name
                                color
                                image
                            }
                            image
                            members {
                                _id
                            }
                        }
                    }
                `,
                variables: { id },
            }),
        });
    },

    SYSTEM: {
        fetchGroup: (id, token) => {
            return axios({
                url: `${API_PATH}/graphql`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer: ${token}`,
                },
                data: JSON.stringify({
                    query: `
                        query Group($id: String!) {
                            group(id: $id) {
                                _id
                                name
                                color
                                image
                                members {
                                    _id
                                }
                            }
                        }
                    `,
                    variables: { id },
                }),
            });
        },

        fetchContact: (id, token) => {
            return axios({
                url: `${API_PATH}/graphql`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer: ${token}`,
                },
                data: JSON.stringify({
                    query: `
                        query Contact($id: String!) {
                            contact(id: $id) {
                                _id
                                contact {
                                    _id
                                    name
                                    color
                                    image
                                    title
                                }
                                user {
                                    _id
                                    name
                                    color
                                    image
                                    title
                                }
                                confirmed
                            }
                        }
                    `,
                    variables: { id },
                }),
            });
        },

        fetchEvent: (id, token) => {
            return axios({
                url: `${API_PATH}/graphql`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer: ${token}`,
                },
                data: JSON.stringify({
                    query: `
                        query Event($id: String!) {
                            event(id: $id) {
                                _id
                                notes
                                processed
                                start
                                end
                                owner {
                                    _id
                                    image
                                    color
                                    title
                                    name
                                }
                                expert {
                                    _id
                                    image
                                    color
                                    title
                                    name
                                }
                                attendees {
                                    status
                                    user {
                                        _id
                                        name
                                        image
                                        title
                                    }
                                }
                            }
                        }
                    `,
                    variables: { id },
                }),
            });
        },

        fetchChannel: (id, token) => {
            return axios({
                url: `${API_PATH}/graphql`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer: ${token}`,
                },
                data: JSON.stringify({
                    query: `
                        query Channel($id: String!) {
                            channel(id: $id) {
                                _id
                                name
                                private
                                description
                                group {
                                    _id
                                    name
                                    color
                                    image
                                }
                                user {
                                    _id
                                    name
                                    color
                                    image
                                }
                                image
                                members {
                                    _id
                                }
                            }
                        }
                    `,
                    variables: { id },
                }),
            });
        },
    },
};
