import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
	uri: 'https://peaceful-ravine-43242.herokuapp.com/'
});

const authLink = setContext(() => {
	const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : '';
	return {
		headers: {
			Authorization: token ? `Bearer ${token}` : ''
		}
	};
});

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache()
});

export default client;
