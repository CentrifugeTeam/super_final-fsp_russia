export interface IUser {
	id: number;
	username: string;
	fio: string;
	email: string;
	about?: string;
	photo_url: string;
	is_superuser : boolean;
	is_verified: boolean;
}
