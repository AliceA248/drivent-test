import { ApplicationError } from '@/protocols';

export function cannotListHotels(): ApplicationError {
  return {
    name: 'CannotListHotelsError',
    message: 'Cannot list hotels',
  };
}
