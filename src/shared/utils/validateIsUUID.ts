import { isUUID } from 'class-validator';
import { BadRequestError } from '../error';

export const validateIsUUID = async (id: string): Promise<void> => {
  const isIdValid = isUUID(id, '4');

  if (!isIdValid) {
    throw new BadRequestError('Incorrect format of id');
  }
};
