import { gql } from '@apollo/client';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { BiPlus, BiPlusCircle } from 'react-icons/bi';
import client from '../apolloClient';
import { PostCard } from '../components/postcard';
import { AuthContext } from '../context/auth';

export async function getStaticProps() {
	const result = await client.query({
		query: gql`
			query {
				getPosts {
					id
					title
					body
					createdAt
					username
					score
					commentCount
					comments {
						id
						body
						username
					}
					upvotes {
						username
					}
					downvotes {
						username
					}
				}
			}
		`
	});

	return {
		props: {
			result
		}
	};
}

function Home({ result }) {
	const [ posts, setPosts ] = useState();
	const [ loading, setLoading ] = useState(true);
	const { user } = useContext(AuthContext);
	const router = useRouter();
	const handleClick = () => {
		if (user) router.push('/rushedit');
		else router.push('/login');
	};

	useEffect(
		async () => {
			await client
				.query({
					query: gql`
						query {
							getPosts {
								id
								title
								body
								createdAt
								username
								score
								commentCount
								comments {
									id
									body
									username
								}
								upvotes {
									username
								}
								downvotes {
									username
								}
							}
						}
					`
				})
				.then((res) => {
					setPosts(res);
					setLoading(false);
				});
		},
		[ result ]
	);
	if (loading) return <div />;
	return (
		<div className="flex flex-col items-center">
			{posts.data.getPosts.map((post) => <PostCard post={post} key={post.id} />)}
			<button
				className="fixed bottom-0 right-0 mr-4 mb-4 rounded-full bg-green-600 text-white outline-none focus:outline-none md:hidden"
				onClick={handleClick}
			>
				<BiPlus size={50} className="p-2" />
			</button>
		</div>
	);
}

export default Home;
