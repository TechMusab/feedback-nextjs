import "next-auth"

declare module "next-auth" {
  interface User {
    _id: string;
    email: string;
    username: string;
    isVerified?: boolean;
    isAcceptingMsg?: boolean;
  }
    interface Session {
        user: {
            _id: string;
            email: string;
            username: string;
            isVerified?: boolean;
            isAcceptingMsg?: boolean;
        }
    }
}