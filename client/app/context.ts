"use client";
import { createContext, useState } from "react";

import { User, UserProfile, Notifications, List, Comments, Settings, Search } from "./(interface)/context";

interface MyContext {
	tabletSearch: boolean;
	setTabletSearch: (value: boolean) => void;
	settings: Settings;
	setSettings: (value: Settings) => void;
	popup: boolean;
	setPopup: (value: boolean) => void;
	comments: Comments[];
	setComments: (value: any) => void;
	notifications: Notifications | any;
	setNotifications: (value: any) => void;
	post: boolean;
	setPost: (value: boolean) => void;
	user: User;
	setUser: (value: any) => void;
	userProfile: UserProfile;
	setUserProfile: (value: any) => void;
	createPost: boolean;
	openCreatePost: (value: boolean) => void;
	userPost: any;
	setUserPost: (value: any) => void;
	changeProfile: boolean;
	setChangeProfile: (value: boolean) => void;
	users: any[];
	setUsers: (value: any) => void;
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
	mobileNav: boolean;
	setMobileNav: (value: boolean) => void;
	list: List;
	setList: (value: any) => void;
	messages: any[];
	setMessages: (value: any) => void;
	messageIndex: number;
	setMessageIndex: (value: any) => void;
	bottomNavOffset: number;
	setBottomNavOffset: (value: any) => void;
	search: Search;
	setSearch: (value: any) => void;
	isLogoutOpen: boolean;
	setLogout: (value: any) => void;
	isErrorOpen: boolean;
	setErrorOpen: (value: any) => void;
	errorMessage: string;
	setErrorMessage: (value: any) => void;
	messageId: string;
	setMessageId: (value: any) => void;
}

export const App = createContext<MyContext>({
	tabletSearch: false,
	setTabletSearch: () => {},
	messageId: "",
	setMessageId: () => {},
	isErrorOpen: false,
	setErrorOpen: () => {},
	search: { placeholder: "", type: "", mobile: false, value: "" },
	setSearch: () => {},
	settings: { settingTab: -1, isSettingOpen: false },
	setSettings: () => {},
	post: false,
	setPost: () => {},
	user: {
		loading: true,
		user: null,
		feed: [],
	},
	setUser: () => {},
	userProfile: { loading: true, user: null, post: [] },
	setUserProfile: () => {},
	createPost: false,
	openCreatePost: () => {},
	userPost: {},
	setUserPost: () => {},
	changeProfile: false,
	setChangeProfile: () => {},
	users: [],
	setUsers: () => {},
	isOpen: false,
	setIsOpen: () => {},
	mobileNav: false,
	setMobileNav: () => {},
	notifications: { loading: true, data: [] },
	setNotifications: () => {},
	comments: [],
	setComments: () => {},
	popup: false,
	setPopup: () => {},
	list: { type: "", open: false, _id: "" },
	setList: () => {},
	messages: [],
	setMessages: () => {},
	messageIndex: -1,
	setMessageIndex: () => {},
	bottomNavOffset: 0,
	setBottomNavOffset: () => {},
	isLogoutOpen: false,
	setLogout: () => {},
	errorMessage: "",
	setErrorMessage: () => {},
});

export const useMyContext = () => {
	const [messageId, setMessageId] = useState("");
	const [post, setPost] = useState(false);
	const [user, setUser] = useState({
		loading: true,
		user: null,
		feed: [],
	});
	const [userProfile, setUserProfile] = useState({
		loading: true,
		user: null,
		post: [],
	});
	const [bottomNavOffset, setBottomNavOffset] = useState(0);
	const [createPost, openCreatePost] = useState(false);
	const [userPost, setUserPost] = useState({});
	const [changeProfile, setChangeProfile] = useState(false);
	const [users, setUsers] = useState([]);
	const [comments, setComments] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [mobileNav, setMobileNav] = useState(false);
	const [notifications, setNotifications] = useState({ loading: true, data: [] });
	const [popup, setPopup] = useState(false);
	const [list, setList] = useState({ type: "", open: false, _id: "" });
	const [messages, setMessages] = useState([]);
	const [messageIndex, setMessageIndex] = useState(-1);
	const [settings, setSettings] = useState({ settingTab: -1, isSettingOpen: false });
	const [search, setSearch] = useState({ placeholder: "", type: "", mobile: false, value: "" });
	const [isLogoutOpen, setLogout] = useState(false);
	const [isErrorOpen, setErrorOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [tabletSearch, setTabletSearch] = useState(false);
	return {
		tabletSearch,
		setTabletSearch,
		messageId,
		setMessageId,
		errorMessage,
		setErrorMessage,
		isErrorOpen,
		setErrorOpen,
		isLogoutOpen,
		setLogout,
		search,
		setSearch,
		settings,
		setSettings,
		bottomNavOffset,
		setBottomNavOffset,
		messageIndex,
		setMessageIndex,
		messages,
		setMessages,
		list,
		setList,
		popup,
		setPopup,
		comments,
		setComments,
		notifications,
		setNotifications,
		post,
		setPost,
		user,
		setUser,
		userProfile,
		setUserProfile,
		createPost,
		openCreatePost,
		userPost,
		setUserPost,
		changeProfile,
		setChangeProfile,
		users,
		setUsers,
		isOpen,
		setIsOpen,
		mobileNav,
		setMobileNav,
	};
};
