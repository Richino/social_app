export interface PostFeedProps {
	fullname: string;
	usernameOrText: string;
	avatar: string;
	post: string;
	caption: string;
	likes: Array<string>;
	comments: number;
	id: string;
	author: string;
	index: number;
	followers: Array<string>;
	createdAt: string;
	edited: boolean;
}
