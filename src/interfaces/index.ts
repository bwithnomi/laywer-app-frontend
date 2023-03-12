export interface ChatUser{
  _id: string,
  name: string,
  email: string,
  profile_image: string,
  status: boolean,
  role: string,
  conversation: never[],
  createdAt: string,
  updatedAt: string,
  __v: number,
}
export interface Conversation{
  _id: string,
  sender: ChatUser | null,
  receiver: ChatUser | null,
  createdAt: string,
  updatedAt: string,
  __v: number,
}
export interface Message {
  _id: string,
  sender: ChatUser | null,
  Conversation: string,
  message: string,
  file: string,
  createdAt: string,
  updatedAt: string,
  __v: number,
}
export interface ValidationError {
  msg: string,
  param?: string,
  location?: string,
}