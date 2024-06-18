import {
  GIT_STATUS_PENDING,
  GIT_STATUS_CLONING,
  GIT_STATUS_READY,
  GIT_STATUS_ERROR,
} from '@/constants/git';

declare global {
  type GitStatus =
    | GIT_STATUS_PENDING
    | GIT_STATUS_CLONING
    | GIT_STATUS_READY
    | GIT_STATUS_ERROR;
}
