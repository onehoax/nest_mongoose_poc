export const USERNAME_REGEX: RegExp = /^[a-zA-Z0-9_\-.]+$/g;
export const URL_REGEX: RegExp =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/g;

export const EMAIL_REGEX: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
