import { useMutation } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { BiDownvote, BiEditAlt, BiMicrophone, BiTrashAlt, BiUpvote } from 'react-icons/bi';
import { FaMicrophoneAlt } from 'react-icons/fa';
import { FcBusinessman } from 'react-icons/fc';
import { UPVOTE_COMMENT, DELETE_COMMENT, DOWNVOTE_COMMENT } from '../api/comments';
import { AuthContext } from '../context/auth';

const CommentCard = ({ postId, comment, postOP }) => {
	const router = useRouter();

	const { user } = useContext(AuthContext);
	const [ score, setScore ] = useState(0);
	const [ voteStatus, setVoteStatus ] = useState(0);
	const [ refresh, setRefresh ] = useState(true);

	useEffect(
		() => {
			setScore(comment.score);
			if (comment.upvotes.find((upvote) => upvote.username === user.username)) {
				setVoteStatus(1);
			} else if (comment.downvotes.find((downvote) => downvote.username === user.username)) {
				setVoteStatus(-1);
			}
		},
		[ refresh ]
	);

	const navigateToLogin = () => {
		router.push('/login');
	};

	const [ upvoteComment ] = useMutation(UPVOTE_COMMENT, {
		update(_, result) {
			console.log(result);
		},
		onError(err) {
			console.log(JSON.stringify(err, null, 2));
		}
	});

	const [ downvoteComment ] = useMutation(DOWNVOTE_COMMENT, {
		update(_, result) {
			console.log(result);
		},
		onError(err) {
			console.log(JSON.stringify(err, null, 2));
		}
	});

	const [ deleteComment ] = useMutation(DELETE_COMMENT, {
		update(_, result) {
			console.log(result);
			router.reload(window.location.pathname);
		},
		onError(err) {
			console.log(JSON.stringify(err, null, 2));
		}
	});

	const handleDeleteComment = (commentId) => {
		deleteComment({ variables: { postId: postId, commentId: commentId } });
	};

	const handleEdit = () => {
		console.log(score);
	};

	const handleUpvoteComment = (commentId) => {
		upvoteComment({ variables: { postId: postId, commentId: commentId } });
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

	const handleDownvoteComment = (commentId) => {
		downvoteComment({ variables: { postId: postId, commentId: commentId } });
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
		<div className="bg-brand-bgup rounded-lg p-4 my-4 flex flex-col-reverse md:flex-row flex-1 ">
			<div className="md:flex-col flex align-middle justify-items-center pr-3 mt-4">
				<button
					onClick={user ? () => handleUpvoteComment(comment.id) : navigateToLogin}
					className={`md:p-2 md:m-2 mx-3  ${voteStatus != 1
						? 'text-gray-200'
						: 'text-brand-primary'}  focus:outline-none`}
				>
					<BiUpvote size={20} />
				</button>
				<p className="text-md text-white text-center">{score}</p>
				<button
					onClick={user ? () => handleDownvoteComment(comment.id) : navigateToLogin}
					className={`md:p-2 md:m-2 mx-3 ${voteStatus != -1
						? 'text-gray-200'
						: 'text-blue-300'}  focus:outline-none`}
				>
					<BiDownvote size={20} />
				</button>
			</div>
			<div className="w-full">
				<div className="flex flex-row justify-between my-1">
					<div
						className={`flex flex-row items-center rounded-full ${user.username != comment.username
							? 'bg-brand-bgupup'
							: 'bg-teal-800'} px-2 py-1`}
					>
						<FcBusinessman size={24} />
						<Link replace href={'/user/' + comment.username}>
							<a>
								<p
									className={`text-s1  ${postOP != comment.username
										? 'text-gray-300'
										: 'text-cyan-300'}  ml-2`}
								>
									{' '}
									{comment.username}
								</p>
							</a>
						</Link>
						{comment.username === postOP && <FaMicrophoneAlt className="mx-2" />}
					</div>
					{user &&
					user.username === comment.username && (
						<div className="flex flex-row">
							<button onClick={handleEdit}>
								<BiEditAlt size={20} className="mx-2" />
							</button>
							<button onClick={() => handleDeleteComment(comment.id)}>
								<BiTrashAlt size={20} className="mx-2" />
							</button>
						</div>
					)}
				</div>
				<p className="whitespace-pre-wrap">{comment.body}</p>
			</div>
		</div>
	);
};

export default CommentCard;
