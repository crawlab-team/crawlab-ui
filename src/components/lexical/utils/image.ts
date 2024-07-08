import { createCommand } from 'lexical';

export const INSERT_IMAGE_COMMAND =
  createCommand<InsertImageCommandPayload>('INSERT_IMAGE');
