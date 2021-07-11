import React, { useContext, useEffect, useState } from 'react';
import { FcGoogle, FcIdea, FcReddit, FcSteam } from 'react-icons/fc';
import { Formik, Field, Form } from 'formik';
import { BiLogInCircle } from 'react-icons/bi';
import Link from 'next/link';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/auth';

function Login() {
	const router = useRouter();
	const context = useContext(AuthContext);
	const [ errors, setErrors ] = useState();

	useEffect(
		() => {
			if (context.user) router.push('/');
		},
		[ context.user ]
	);

	const LOGIN_USER = gql`
		mutation login($username: String!, $password: String!) {
			login(username: $username, password: $password) {
				id
				email
				username
				createdAt
				token
			}
		}
	`;

	const [ addUser, { loading } ] = useMutation(LOGIN_USER, {
		update(proxy, { data: { login: userData } }) {
			console.log(userData);
			context.login(userData);
			router.push('/');
		},
		onError(err) {
			setErrors(err.graphQLErrors[0].extensions.errors);
			console.log(err.graphQLErrors[0].extensions.errors);
		}
	});

	const handleLogin = (values) => {
		addUser({ variables: values });
	};

	return (
		<div className="bg-brand-bgupup flex flex-row w-4/6 rounded-3xl px-4 py-6">
			<div className="flex-1 flex flex-col p-3 items-center">
				<FcIdea size={56} />
				<h1 className="text-brand-primary text-4xl mt-4">Sign in to your account</h1>
				<div className="p-6 text-center">
					<p className="text-gray-400 text-md">Sign in with</p>
					<div className="flex flex-row justify-center pt-3  mb-4">
						<button className="border-brand-primary border-2 p-2 rounded-3xl mx-3">
							<FcGoogle size={28} />
						</button>
						<button className="border-brand-primary border-2 p-2 rounded-3xl mx-3">
							<FcReddit size={28} />
						</button>
						<button className="border-brand-primary border-2 p-2 rounded-3xl mx-3">
							<FcSteam size={28} />
						</button>
					</div>
					<p className="text-gray-400">Or continue with</p>
					<Formik
						initialValues={{
							username: '',
							password: ''
						}}
						onSubmit={handleLogin}
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
								<button
									type="submit"
									className="bg-brand-primary rounded-3xl p-2 self-center mt-5 text-white items-center outline-none"
								>
									<div className="flex flex-row  items-center p-2 outline-none">
										<BiLogInCircle />
										<p className="text-white mx-1 outline-none">Login</p>
									</div>
								</button>
							</div>
						</Form>
					</Formik>
				</div>
				<h1 className="text-white text-xl">Don't have an account ?</h1>
				<Link href="register">
					<a>
						<button className="bg-brand-primary rounded-3xl text-white my-2 p-3 shadow-2xl">
							Join Rushed
						</button>
					</a>
				</Link>
			</div>
			<div className="bg-brand-primary rounded-3xl md:flex-1 ">
				{errors &&
					Object.entries(errors).map((key, value) => {
						<li>{value}</li>;
					})}
			</div>
		</div>
	);
}

export default Login;
