export enum UserStatus {
    online,
    offline,
    playing,
}

export class User {
    id: string = '';
    pseudo: string = '';
    avatarPath: string = '';
    status: UserStatus = 0;
}