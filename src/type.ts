export enum SnsAction {
  LIST_SUBSCRIPTIONS = 'ListSubscriptions',
  LIST_TOPICS = 'ListTopics',
  CREATE_TOPIC = 'CreateTopic',
  SUBSCRIBE = 'Subscribe',
  UNSUBSCRIBE = 'Unsubscribe',
  PUBLISH = 'Publish'
}

export type Sms = {
  messageId: string;
  messageGroupId: string | undefined;
  destination: string;
  message: string;
  at: number;
};
