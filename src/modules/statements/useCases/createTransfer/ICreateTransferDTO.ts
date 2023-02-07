import { Statement } from "modules/statements/entities/Statement";

export type ICreateTransferDTO =
Pick<
  Statement,
  'user_id' |
  'description' |
  'amount' |
  'type' |
  'sender_id' |
  'receive_id'
>
