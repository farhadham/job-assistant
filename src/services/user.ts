import { honoClientUser } from "@/lib/api";

export const getUserProfile = honoClientUser.index.$get;
export const updateUser = honoClientUser.index.$put;
