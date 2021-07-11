import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import { FETCH_POST_QUERY } from '../../api/getposts';
import { UPVOTE_POST, DOWNVOTE_POST } from '../../api/vote';
import { CREATE_COMMENT, DELETE_COMMENT, UPVOTE_COMMENT, DOWNVOTE_COMMENT } from '../../api/comments';
import { AuthContext } from '../../context/auth';
import { BiCommentAdd, BiDownvote, BiEditAlt, BiPaperPlane, BiTrashAlt, BiUpvote } from 'react-icons/bi';
import Link from 'next/link';
import { FcBusinessman, FcComments, FcDeleteDatabase } from 'react-icons/fc';
import { FaComments, FaFlag, FaShare, FaShareAlt } from 'react-icons/fa';
import { Formik, Form, Field } from 'formik';
import moment, { now } from 'moment';
import CommentCard from '../../components/comment-card';

const Post = () => {
	const router = useRouter();
	const { postId } = router.query;

	const { user } = useContext(AuthContext);

	const navigateToLogin = () => {
		router.push('/login');
	};

	const { data, loading, error } = useQuery(FETCH_POST_QUERY, {
		variables: {
			postId
		},
		onError(err) {
			console.log(JSON.stringify(err, null, 2));
		}
	});

	const [ score, setScore ] = useState(0);
	const [ refresh, setRefresh ] = useState(true);
	const [ voteStatus, setVoteStatus ] = useState(0);

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

	const [ createComment ] = useMutation(CREATE_COMMENT, {
		update(_, result) {
			console.log(result);
			router.reload(window.location.pathname);
		},
		onError(err) {
			console.log(JSON.stringify(err, null, 2));
		}
	});

	const handleUpvote = () => {
		upvotePost({ variables: { postId: postId } });
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

	const handleSubmitComment = (values) => {
		createComment({ variables: { level: 1, body: values.comment, parentId: postId, postId: postId } });
	};

	const handleDownvote = () => {
		downvotePost({ variables: { postId: postId } });
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

	useEffect(
		() => {
			if (!loading) {
				setScore(data.getPost.score);
				if (data.getPost.upvotes.find((upvote) => upvote.username === data.getPost.username)) {
					setVoteStatus(1);
				} else if (data.getPost.downvotes.find((downvote) => downvote.username === data.getPost.username)) {
					setVoteStatus(-1);
				}
			}
		},
		[ loading, refresh ]
	);

	if (loading) return <p>Loading</p>;
	else {
		return (
			<div className="bg-brand-bg md:w-4/6 p-5 rounded-xl shadow-xl text-white flex flex-col h-full">
				<div className="flex flex-col-reverse md:flex-row border-b mb-4 border-gray-600  pb-4">
					<div className="md:flex hidden md:flex-col align-middle justify-items-center px-3">
						<button
							onClick={user ? handleUpvote : navigateToLogin}
							className={`pr-2 mr-2 md:pr-0  md:my-3 ${voteStatus != 1
								? 'text-gray-200'
								: 'text-brand-primary'}  focus:outline-none`}
						>
							<BiUpvote size={24} />
						</button>
						<p className="text-md text-white text-center md:mr-2">{score}</p>
						<button
							onClick={user ? handleDownvote : navigateToLogin}
							className={`pl-2 ml-2 md:pl-0 md:ml-0 md:my-3 md:mr-2 ${voteStatus != -1
								? 'text-gray-200'
								: 'text-blue-300'}  focus:outline-none`}
						>
							<BiDownvote size={24} />
						</button>
					</div>

					<div className="w-auto flex-1 items-center flex">
						<h1 className="md:text-3xl text-2xl">{data.getPost.title}</h1>
					</div>

					<div className="py-2 h-auto flex flex-row-reverse md:flex-col justify-between">
						<div className="flex flex-col">
							<h className="text-white ">{moment(data.getPost.createdAt).fromNow()}</h>
							<h className="text-white hidden md:inline-block">{data.getPost.createdAt.split('T')[0]}</h>
						</div>
						<div className={`flex flex-row items-center ${user.username === data.getPost.username ? 'bg-teal-600' : 'bg-brand-bgup'} rounded-2xl p-1 justify-center`}>
							<FcBusinessman />
							<Link replace href={'/user/' + data.getPost.username}>
								<a>
									<p className="text-s1 text-white ml-2"> {data.getPost.username}</p>
								</a>
							</Link>
						</div>
					</div>
				</div>

				<div className="md:ml-16">
					<div>
						<p>{data.getPost.body}</p>
					</div>
					<div className="flex flex-row md:items-center md:justify-start justify-around py-5  my-4 border-gray-600">
						<div className="md:hidden flex align-middle justify-items-center">
							<button
								onClick={user ? handleUpvote : navigateToLogin}
								className={`pr-1 mr-1 md:pr-0  md:my-3 ${voteStatus != 1
									? 'text-gray-200'
									: 'text-brand-primary'}  focus:outline-none`}
							>
								<BiUpvote size={20} />
							</button>
							<p className="text-md text-white text-center md:mr-2">{score}</p>
							<button
								onClick={user ? handleDownvote : navigateToLogin}
								className={`pl-1 ml-1 md:pl-0 md:ml-0 md:my-3 md:mr-2 ${voteStatus != -1
									? 'text-gray-200'
									: 'text-blue-300'}  focus:outline-none`}
							>
								<BiDownvote size={20} />
							</button>
						</div>

						<div className="flex md:mx-2 items-center">
							<FaComments color="white" />
							<p className="text-white md:self-start mx-1 md:ml-4 text-sm">
								{data.getPost.commentCount}{' '}
							</p>
							<p className="hidden md:inline-flex text-white md:self-start mx-1 text-sm">
								{data.getPost.commentCount != 1 ? 'comments' : 'comment'}
							</p>
						</div>

						<button className="flex md:mx-6" onClick={() => console.log(data.getPost)}>
							<FaShare color="white" />
							<p className="text-white self-start ml-2 text-sm">Share</p>
						</button>

						<button className="flex md:mx-6">
							<FaFlag color="white" />
							<p className="text-white self-start ml-2 text-sm">Report</p>
						</button>
					</div>
					<h1 className="text-xl">Comments</h1>
					{user && (
						<Formik
							initialValues={{
								comment: '',
								level: 1
							}}
							onSubmit={handleSubmitComment}
						>
							<Form>
								<div className="flex md:flex-col my-4 md:items-center w-full border border-gray-600 p-4 rounded-md">
									<Field
										as="textarea"
										className="px-3 py-3 whitespace-pre-wrap placeholder-gray-400 text-gray-100 relative bg-brand-bgup rounded text-md  outline-none focus:outline-none focus:ring w-full"
										id="comment"
										name="comment"
										placeholder="State your views on this rushed statement"
									/>
									<div className="flex flex-row md:items-center md:w-full  md:justify-between pl-2 md:px-5 ">
										<p className="text-sm text-gray-500 md:inline-flex hidden">
											Pro-tip : Drag the bottom right corner to expand the text area :)
										</p>
										<button
											type="submit"
											className="flex bg-brand-primary rounded-3xl p-2 self-center md:mt-5 text-white items-center outline-none"
										>
											<BiPaperPlane/>
											<p className='md:inline-block hidden'>Rush it</p>
										</button>
									</div>
								</div>
							</Form>
						</Formik>
					)}
					{data.getPost.comments.map((comment) => (
						<CommentCard comment={comment} postId={postId} loading={loading} key={comment.id} postOP={data.getPost.username}/>
					))}
				</div>
			</div>
		);
	}
};

export default Post;
