import Link from 'next/link';
import { Fragment, useContext, useState } from 'react';
import { BiChevronDown, BiLogInCircle, BiLogOutCircle, BiPlusCircle } from 'react-icons/bi';
import { AuthContext } from '../context/auth';
import { Menu, Transition } from '@headlessui/react';
import { FcAddDatabase, FcAddRow, FcPlus } from 'react-icons/fc';

export default function Layout({ children }) {
	const [ showModal, setShowModal ] = useState(false);
	const { user, logout } = useContext(AuthContext);

	return (
		<div className=' bg-red-400 h-screen'>
			<div className="flex flex-col items-center justify-center" >
				<div className="flex  w-full justify-center py-3 md:justify-around align-middle mb-12 shadow-2xl fixed top-0 z-50 bg-brand-bg border-brand-primary border-b-2">
					<h1 className="text-3xl font-light text-white">
						<Link href="/" className="nav-logo">
							<a>rushed</a>
						</Link>
					</h1>
					<nav className="flex-row md:w-3/5 justify-items-center align-middle hidden md:flex w-screen">
						<ul className="w-full  flex flex-row justify-end">
							<li className="nav-link flex flex-row align-middle">
								<Link href={user ? '/rushedit' : '/login'}>
									<button
										onClick={() => setShowModal(!showModal)}
										className="outline-none focus:outline-none"
									>
										<a>
											<FcPlus size={29} />
										</a>
									</button>
								</Link>
							</li>
						
							<li className="nav-link">
								{user ? (
									<Menu>
										<Menu.Button className="focus:outline-none outline-none">
											<div className="flex flex-row items-center justify-between focus:outline-none outline-none focus-within:outline-none">
												{user.username}
												<BiChevronDown className="mx-1 outline-none focus:outline-none" />
											</div>
										</Menu.Button>
										<Transition
											as={Fragment}
											enter="transition ease-out duration-100"
											enterFrom="transform opacity-0 scale-95"
											enterTo="transform opacity-100 scale-100"
											leave="transition ease-in duration-75"
											leaveFrom="transform opacity-100 scale-100"
											leaveTo="transform opacity-0 scale-95"
										>
											<Menu.Items className="absolute right-14 flex flex-col w-64 mt-2 p-4 origin-top-left bg-brand-bgup divide-y rounded-md shadow-lg focus:outline-none">
												<Menu.Item className="pb-2">
													{({ active }) => (
														<a
															className={`${active && 'bg-blue-500'}`}
															href="/account-settings"
														>
															Account settings
														</a>
													)}
												</Menu.Item>
												<Menu.Item className="pb-2">
													{({ active }) => (
														<a
															className={`${active && 'bg-blue-500'}`}
															href="/account-settings"
														>
															Documentation
														</a>
													)}
												</Menu.Item>
												<Menu.Item className="pb-2">
													<span className="opacity-75">Invite a friend (coming soon!)</span>
												</Menu.Item>
											</Menu.Items>
										</Transition>
									</Menu>
								) : (
									<Link href="/login">
										<button onClick={() => setShowModal(!showModal)} className="outline-none">
											<a>
												<BiLogInCircle size={29} />
											</a>
										</button>
									</Link>
								)}
							</li>
						</ul>
					</nav>
				</div>
				<div className="bg-brand-bgup py-24 flex flex-col items-center min-h-screen w-full">{children}</div>
			</div>
		</div>
	);
}
