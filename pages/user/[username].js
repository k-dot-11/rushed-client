import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import client from '../../apolloClient';
import React, { useEffect, useState } from 'react';
import { PostCard } from '../../components/postcard';
import moment from 'moment';
import { FcBusiness, FcBusinessman } from 'react-icons/fc';

const UserPage = () => {
	const [ posts, setPosts ] = useState();
	const [ loading, setLoading ] = useState(true);
	const router = useRouter();
	const { username } = router.query;

	useEffect(async () => {
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
	}, []);

	if (loading)
		return (
			<div>
				<h1>Loading...</h1>
			</div>
		);

	return (
		<div className=" items-center flex flex-col w-full">
			<h1 className={'text-white text-xl flex whitespace-pre-wrap'}>
				Posts from <FcBusinessman size={25} className='mx-1'/> 
				  {username}
			</h1>
			{posts.data.getPosts
				.filter((post) => post.username === username)
				.map((post) => <PostCard post={post} key={post.id} />)}
		</div>
	);
};

export default UserPage;
