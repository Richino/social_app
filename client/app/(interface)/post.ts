export interface IPost {
	id: string;
	fullname: string;
	usernameOrText: string;
	avatar: string;
	post: string;
	author: string;
}

export interface Comments {
	avatar: string;
	fullname: string;
	id: string;
	createdAt: string;
	text: string;
	index: number;
	caption: boolean;
	commentId?: string;
	likes?: string[];
	postId?: string;
	edited?: boolean;
}

export interface TypeComment {
	id: string | "";
}
export interface Popup {
	author: string;
	postId: string;
	postIndex: number;
}
