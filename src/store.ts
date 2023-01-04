import { TopicsList, SubscriptionsList } from 'aws-sdk/clients/sns';
import { Sms } from './type';

export const sms: Array<Sms> = [];
export const subscriptions: SubscriptionsList = [];
export const topicList: TopicsList = [];
