'use client'

import React from 'react';
import { InMemoryCache, ApolloClient, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
 

const createApolloClient = (accessToken,sessionId) => {
    const httpLink = createHttpLink({
        uri: "http://postlogin-server.hellomentor.online/graphql"
    });
    const clientId = process.env.NEXT_PUBLIC_X_HM_Client_Token || "";
    // Function to set authorization headers
    const authLink = setContext((_, { headers }) => {
        // return the headers to the context so httpLink can read them
        return {
            headers: {
                ...headers,
                Authorization: 
                accessToken ? `Bearer ${accessToken}` : '',
                "X-HM-Client-Token": clientId,
                "SessionId":sessionId
            }
        };
    });

    return new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache()
    });
};

// Component to initialize Apollo Client
export default function StartApolloClient({ accessToken,sessionId,children }) {
    const client = createApolloClient(accessToken,sessionId);

    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    );
}
