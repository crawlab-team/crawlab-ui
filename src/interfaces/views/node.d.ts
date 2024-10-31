import { NODE_STATUS_OFFLINE, NODE_STATUS_ONLINE } from '@/constants/node';

declare global {
  type NodeStatus = NODE_STATUS_OFFLINE | NODE_STATUS_ONLINE;
}
