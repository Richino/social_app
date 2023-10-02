interface user {
	_id?: string;
	avatar?: string;
	bio?: string;
	createdAt?: string;
	email?: string;
	followers?: string[] | null;
	following?: string[] | null;
	fullname?: string;
	username?: string;
}

interface Post {
	_id: string;
	author: string;
	author_followers: string[][];
	author_details: AuthorDetails;
	avatar: string[];
	caption: string;
	comments: number;
	createdAt: string;
	imageUrl: string;
	likes: string[];
	edited?: boolean;
}

interface UserProfilePost {
	__v: number;
	_id: string;
	author: string;
	createdAt: string;
	edited?: boolean;
	imageUrl: string;
	likes: string[];
	caption: string;
}

interface AuthorDetails {
	_id: string;
	avatar: string;
	fullname: string;
}

export interface User {
	loading: boolean;
	user: user | null;
	feed: Post[];
}

export interface UserProfile {
	loading: boolean;
	user: user | null;
	post: UserProfilePost[];
}

export interface NotificationData {
	_id: string;
	action: string;
	author: {
		fullname: string;
		username: string;
		avatar: string;
	};
	createdAt: string;
	image?: string;
}

export interface List {
	type: string;
	open: boolean;
	_id?: string;
}

export interface Comments {
	_id: string;
	comments_info: {
		_id: string;
		author: AuthorDetails;
		createdAt: string;
		likes: string[];
		text: string;
	};
	createdAt: string;
}

export interface Notifications {
	loading: boolean;
	data: NotificationData;
}

export interface Settings {
	settingTab: number;
	isSettingOpen: boolean;
}

export interface Search {
	placeholder: string;
	type: string;
	mobile: boolean;
    value: string
}

