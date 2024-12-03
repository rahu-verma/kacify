import { TUser } from "../models/user";

export const UserRouterProfileSerializer = (user: TUser) => {
  return {
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      email: user.email,
      userType: user.userType,
    },
  };
};
