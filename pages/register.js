import React, { useState, useContext, useEffect } from 'react';
import { FcIdea } from 'react-icons/fc';
import { Formik, Field, Form } from 'formik';
import { BiLogInCircle } from 'react-icons/bi';
import Link from 'next/link';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/auth';

const Register = () => {
	const router = useRouter();
	const context = useContext(AuthContext);
	const [ errors, setErrors ] = useState();

	useEffect(
		() => {
			if (context.user) router.push('/');
		},
		[ context.user ]
	);

	const REGISTER_USER = gql`
		mutation register($username: String!, $email: String!, $password: String!, $confirmPassword: String!) {
			register(
				registerInput: {
					username: $username
					email: $email
					password: $password
					confirmPassword: $confirmPassword
				}
			) {
				id
				email
				username
				createdAt
				token
			}
		}
	`;

	const [ addUser, { loading } ] = useMutation(REGISTER_USER, {
		update(proxy, { data: { register: userData } }) {
			console.log(userData);
			context.login(userData);
			router.push('/');
		},
		onError(err) {
			setErrors(err.graphQLErrors[0].extensions.exception.errors);
			console.log(err.graphQLErrors[0].extensions.exception.errors);
		}
	});

	const handleRegister = (values) => {
		addUser({ variables: values });
	};

	return (
		<div className="flex-1 flex flex-col p-3 items-center">
			<FcIdea size={56} />
			<h1 className="text-brand-primary text-4xl mt-4">Create your Rushed Account</h1>
			<div className="p-6 text-center">
				<Formik
					initialValues={{
						username: '',
						email: '',
						password: '',
						confirmPassword: ''
					}}
					onSubmit={handleRegister}
				>
					<Form>
						<div className="flex flex-col items-start">
							<label className="text-gray-200 my-4 text-lg" htmlFor="firstName">
								Rushed username
							</label>
							<Field
								as="input"
								className="rounded-3xl bg-clip-border p-3 outline-none"
								id="username"
								name="username"
								placeholder="Username"
							/>

							<label className="text-gray-200 my-4 text-lg" htmlFor="firstName">
								Email
							</label>
							<Field
								as="input"
								className="rounded-3xl bg-clip-border p-3 outline-none"
								id="email"
								name="email"
								placeholder="Email"
							/>

							<label className="text-gray-200 my-4 text-lg" htmlFor="password">
								Password
							</label>
							<Field
								as="input"
								className="rounded-3xl bg-clip-border p-3 outline-none"
								id="password"
								name="password"
								type="password"
								placeholder="Password"
							/>
							<label className="text-gray-200 my-4 text-lg" htmlFor="password">
								Confirm Password
							</label>
							<Field
								as="input"
								className="rounded-3xl bg-clip-border p-3 outline-none"
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								placeholder="Confirm Password"
							/>
							<button
								type="submit"
								className="bg-brand-primary rounded-3xl p-2 self-center mt-5 text-white items-center outline-none"
							>
								<div className="flex flex-row  items-center p-2 outline-none">
									<p className="text-white mx-1 outline-none">Create Account</p>
								</div>
							</button>
						</div>
					</Form>
				</Formik>
			</div>
			<h1 className="text-white text-xl">Already have an account ?</h1>
			<Link href="/register">
				<a>
					<button
						onClick={() => router.push('/')}
						className="bg-brand-primary rounded-3xl text-white my-2 p-3 shadow-2xl"
					>
						<div className="flex flex-row  items-center p-2 outline-none">
							<BiLogInCircle />
							<p className="text-white mx-1 outline-none">Login</p>
						</div>
					</button>
				</a>
			</Link>
		</div>
	);
};

export default Register;
