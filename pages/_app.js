import '../styles/globals.css';
import { ApolloProvider } from '@apollo/client';
import client from '../apolloClient';
import Layout from '../components/layout';
import { AuthProvider } from '../context/auth';

function MyApp({ Component, pageProps }) {
	return (
		<AuthProvider>
			<ApolloProvider client={client}>
				
					<Layout>
						<Component {...pageProps} />
					</Layout>
				
			</ApolloProvider>
		</AuthProvider>
	);
}

export default MyApp;
