'use client'

import React from 'react';
import { InMemoryCache, ApolloClient, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
 

const createApolloClient = (accessToken) => {
    const httpLink = createHttpLink({
        uri: "https://portal.hellomentor.in/graphql"
    });

    // Function to set authorization headers
    const authLink = setContext((_, { headers }) => {
        // return the headers to the context so httpLink can read them
        return {
            headers: {
                ...headers,
                Authorization: accessToken ? `Bearer ${accessToken}` : ''
            }
        };
    });

    return new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache()
    });
};

// Component to initialize Apollo Client
export default function StartApolloClient({ accessToken, children }) {
    const client = createApolloClient(accessToken);

    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    );
}
