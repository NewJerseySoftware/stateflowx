export interface IUser {
    name: string;
    roomID: string;
    gameID: string;
    registered: boolean;
    socketid:string,
    userDetails?: {
      firstName: string;
      lastName: string;
      emailAddress: string;
      // Other properties of UserDetails
    };
  }
  