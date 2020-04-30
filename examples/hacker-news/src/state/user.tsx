import { createBranch } from 'staterx';

export type UserT = {
  /** The user's unique username. Case-sensitive. Required. */
  id: string;
  /** Delay in minutes between a comment's creation and its visibility to other users. */
  delay: number;
  /** Creation date of the user, in Unix Time. */
  created: number;
  /** The user's karma. */
  karma: number;
  /** The user's optional self-description. HTML. */
  about: string;
  /** List of the user's stories, polls and comments. */
  submitted: number[];
};

export type UserStateT = {
  items: { [id: string]: UserT | undefined };
};

const branch = createBranch<UserT, UserStateT>(undefined, {
  name: 'user'
});

export const userState = {
  ...branch
};
