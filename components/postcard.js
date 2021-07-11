import React, { useContext, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { BiUpvote, BiDownvote, BiComment } from 'react-icons/bi';
import { FcBusinessman } from 'react-icons/fc';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/auth';
import { DOWNVOTE_POST, UPVOTE_POST } from '../api/vote';
import moment from 'moment';

function PostCard(props) {
	const router = useRouter();
	const [ score, setScore ] = useState(props.post.score);
	const [ voteStatus, setVoteStatus ] = useState(0);

	useEffect(
		() => {
			if (props.post.upvotes.find((upvote) => upvote.username === props.post.username)) {
				setVoteStatus(1);
			} else if (props.post.downvotes.find((downvote) => downvote.username === props.post.username)) {
				setVoteStatus(-1);
			}
		},
		[ props.post.upvotes, props.post.downvotes, props.post.username ]
	);

	const navigateToLogin = () => {
		router.push('/login');
	};

	const { user } = useContext(AuthContext);

	const [ upvotePost ] = useMutation(UPVOTE_POST, {
		update(_, result) {
			console.log(result);
		},
		onError(err) {
			console.log(JSON.stringify(err, null, 2));
		}
	});

	const [ downvotePost ] = useMutation(DOWNVOTE_POST, {
		update(_, result) {
			console.log(result);
		},
		onError(err) {
			console.log(JSON.stringify(err, null, 2));
		}
	});

	const handleUpvote = () => {
		upvotePost({ variables: { postId: props.post.id } });
		switch (voteStatus) {
			case -1:
				setScore(score + 2);
				setVoteStatus(1);
				break;
			case 0:
				setScore(score + 1);
				setVoteStatus(1);
				break;
			case 1:
				setScore(score - 1);
				setVoteStatus(0);
				break;
		}
	};

	const handleDownvote = () => {
		downvotePost({ variables: { postId: props.post.id } });
		switch (voteStatus) {
			case -1:
				setScore(score + 1);
				setVoteStatus(0);
				break;
			case 0:
				setScore(score - 1);
				setVoteStatus(-1);
				break;
			case 1:
				setScore(score - 2);
				setVoteStatus(-1);
				break;
		}
	};

	return (
		<div className="bg-brand-bgupup p-5 md:w-3/5 md:m-2 mt-4  md:rounded-lg rounded-md flex md:flex-row flex-col-reverse justify-between w-11/12 shadow-md">
			<div className="flex justify-between items-center md:px-2">
				
				<div className="md:flex-col flex align-middle justify-items-center pr-3 mt-4">
					<button
						onClick={user ? handleUpvote : navigateToLogin}
						className={`pr-2 mr-2 md:pr-0  md:my-3 ${voteStatus != 1
							? 'text-gray-200'
							: 'text-brand-primary'}  focus:outline-none`}
					>
						<BiUpvote size={20} />
					</button>
					<p className="text-md text-white text-center md:mr-2">{score}</p>
					<button
						onClick={user ? handleDownvote : navigateToLogin}
						className={`pl-2 ml-2 md:pl-0 md:ml-0 md:my-3 md:mr-2 ${voteStatus != -1
							? 'text-gray-200'
							: 'text-blue-300'}  focus:outline-none`}
					>
						<BiDownvote size={20} />
					</button>
				</div>
				<Link href={{ pathname: 'posts/' + props.post.id }}>
					<a className='md:hidden'>
						<button
							className="bg-brand-primary p-2 rounded-2xl md:w-32 shadow-md"
							onClick={() => console.log(props.post)}
						>
							<div className="flex flex-row items-center content-center">
								<BiComment color="white" />
								<p className="text-white self-start ml-2 text-sm">{props.post.commentCount}</p>
								<p className="text-white self-start ml-2 text-sm hidden md:inline-block">
									{props.post.commentCount != 1 ? 'comments' : 'comment'}
								</p>
							</div>
						</button>
					</a>
				</Link>
			</div>
			
			<div className="flex flex-col  flex-1 md:justify-around">
				<div className="flex flex-row items-center justify-between">
					<div className='flex items-center'>
					<FcBusinessman />
					<Link replace href={'/user/' + props.post.username}>
						<a>
							<p className="text-s1 text-gray-300 ml-2"> {props.post.username}</p>
						</a>
					</Link></div>
					<h className='text-sm text-gray-500 md:hidden'>{moment(props.post.createdAt).fromNow()}</h>
				</div>
				<div>
					<h1 className="md:text-2xl text-xl text-white mt-2 md:mt-0">{props.post.title}</h1>
					<p className="text-lg text-gray-300 hidden md:block"> {props.post.body}</p>
				</div>
			</div>

			<div className="p-2 h-auto md:flex flex-col justify-between items-end ml-2 hidden">
				<h className="text-white ">{moment(props.post.createdAt).fromNow()}</h>

				<Link replace href={{ pathname: '/posts/' + props.post.id }}>
					<a>
						<button
							className="bg-brand-primary p-2 rounded-2xl md:w-32 shadow-md"
							onClick={() => console.log(props.post)}
						>
							<div className="flex flex-row items-center content-center">
								<BiComment color="white" />
								<p className="text-white self-start ml-2 text-sm">{props.post.commentCount}</p>
								<p className="text-white self-start ml-2 text-sm hidden md:inline-block">
									{props.post.commentCount != 1 ? 'comments' : 'comment'}
								</p>
							</div>
						</button>
					</a>
				</Link>
			</div>
		</div>
	);
}

export { PostCard };
