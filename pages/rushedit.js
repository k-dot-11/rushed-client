import { gql, useMutation } from '@apollo/client';
import { Formik, Form, Field } from 'formik';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { FcPodiumWithSpeaker } from 'react-icons/fc';
import { AuthContext } from '../context/auth';

function RushedIt() {
	const context = useContext(AuthContext);
	const router = useRouter();
	useEffect(
		() => {
			if (!context.user) router.push('login');
		},
		[ context.user ]
	);

	const CREATE_POST = gql`
		mutation createPost($title: String!, $body: String!) {
			createPost(title: $title, body: $body) {
				id
				createdAt
				username
				body
				title
			}
		}
	`;

	const [ createPost ] = useMutation(CREATE_POST, {
		update(_, result) {
			console.log(result);
			router.push('/posts/' + result.data.createPost.id);
		},
		onError(err) {
			console.log(JSON.stringify(err, null, 2));
		}
	});

	const handleSubmit = (values) => {
		createPost({ variables: values });
	};

	return (
		<div className="md:w-1/2 bg-brand-bg p-3 px-5 rounded-lg shadow-xl">
			<div className="border-b-2 p-2 border-gray-400 flex flex-row items-center">
				<FcPodiumWithSpeaker size={44} className="text-2xl text-white mb-2 mr-2" />
				<h1 className="text-2xl text-white mb-2 ml-2">Give a rushed statement</h1>
			</div>
			<Formik
				initialValues={{
					title: '',
					body: ''
				}}
				onSubmit={handleSubmit}
			>
				<Form>
					<div className="flex flex-col items-start">
						<label className="text-gray-200 my-4 text-lg" htmlFor="firstName">
							Title
						</label>
						<Field
							as="input"
							className="px-3 py-3 placeholder-gray-400 text-gray-100 relative bg-brand-bgup rounded text-xl  outline-none focus:outline-none focus:ring w-full"
							id="title"
							name="title"
							autoComplete="off"
						/>

						<label className="text-gray-200 my-4 text-lg" htmlFor="password">
							Body
						</label>
						<Field
							as="textarea"
							className="px-3 py-3 h-40 placeholder-gray-400 text-gray-100 relative bg-brand-bgup rounded text-md  outline-none focus:outline-none focus:ring w-full"
							id="body"
							name="body"
						/>
						<button
							type="submit"
							className="bg-brand-primary rounded-3xl p-2 self-center mt-5 text-white items-center outline-none"
						>
							<div className="flex flex-row  items-center p-2 outline-none">
								<p className="text-white mx-1 outline-none">Rush It</p>
							</div>
						</button>
					</div>
				</Form>
			</Formik>
		</div>
	);
}

export default RushedIt;
