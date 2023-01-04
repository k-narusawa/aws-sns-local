import express from 'express';
import cors from 'cors';
import type { Server } from 'http';
import * as xml2js from 'xml2js';
import * as bodyParser from 'body-parser';
import {
  PublishInput,
  MessageAttributeMap,
  CreateTopicInput,
  ListTopicsInput
} from 'aws-sdk/clients/sns';
import { randomUUID } from 'crypto';
import { sms, topicList } from './store';
import * as config from '../mock-config.json';

const builder = new xml2js.Builder();

const server = async (): Promise<Server> => {
  const app = express();
  app.use(cors());

  app.get('/health', (req, res) => {
    res.status(200).send({ status: 'OK' });
  });

  app.use(bodyParser.urlencoded({ extended: true }));

  app.get('/store', (req, res) => {
    if (!req.query.since) {
      res.status(200).send(sms);
      return;
    }
  });

  app.post('/clear-store', (req, res) => {
    sms.splice(0);
    res.status(200).send({ message: 'Sms cleared' });
  });

  app.all('/', (req, res) => {
    switch (req.body.Action) {
      case 'ListSubscriptions':
        return {};
      case 'ListTopics':
        const listTopicsInput: ListTopicsInput = {
          NextToken: req.body.NextToken
        };
        return res.send(builder.buildObject(listTopics(listTopicsInput)));
      case 'CreateTopic':
        const createTopicInput: CreateTopicInput = {
          Name: req.body.Name,
          Attributes: req.body.Attributes,
          Tags: req.body.Tags,
          DataProtectionPolicy: req.body.DataProtectionPolicy
        };
        return res.send(builder.buildObject(createTopic(createTopicInput)));
      case 'Subscribe':
        return {};
      case 'Unsubscribe':
        return {};
      case 'Publish':
        const publishInput: PublishInput = {
          TopicArn: req.body.TopicArn,
          TargetArn: req.body.TargetArn,
          PhoneNumber: req.body.PhoneNumber,
          Message: req.body.Message,
          Subject: req.body.Subject,
          MessageStructure: req.body.MessageStructure,
          MessageAttributes: req.body.MessageAttributes,
          MessageDeduplicationId: req.body.MessageDeduplicationId,
          MessageGroupId: req.body.MessageGroupId
        };
        return res.send(builder.buildObject(publish(publishInput)));
      default:
        throw new Error();
    }
  });

  return new Promise((resolve) => {
    const s = app.listen(Number(config.port), () => resolve(s));
  });
};

const listTopics = (listTopicsInput: ListTopicsInput) => {
  return {
    ListTopicsResponse: {
      $: {
        xmlns: 'http://sns.amazonaws.com/doc/2010-03-31/'
      },
      ListTopicsResult: [
        {
          Topics: [
            topicList.map((topic) => {
              return { member: { TopicArn: topic.TopicArn } };
            })
          ]
        }
      ],
      ResponseMetadata: {
        RequestId: randomUUID()
      }
    }
  };
};
const createTopic = (createTopicInput: CreateTopicInput) => {
  const topicArn = `arn:aws:sns:${config.aws.region}:${config.aws.accountId}:${createTopicInput.Name}`;
  topicList.push({
    TopicArn: topicArn
  });
  return {
    CreateTopicResponse: {
      $: {
        xmlns: 'http://sns.amazonaws.com/doc/2010-03-31/'
      },
      CreateTopicResult: [
        {
          TopicArn: topicArn
        }
      ],
      ResponseMetadata: {
        RequestId: randomUUID()
      }
    }
  };
};

const publish = (publishInput: PublishInput) => {
  const messageId = randomUUID();
  if (publishInput.PhoneNumber) {
    sms.push({
      messageId: messageId,
      messageGroupId: publishInput.MessageGroupId,
      destination: publishInput.PhoneNumber,
      message: publishInput.Message,
      at: Math.floor(new Date().getTime() / 1000)
    });
  } else {
    //TODO WIP
    console.log('WIP');
  }
  return {
    PublishResponse: {
      $: {
        xmlns: 'http://sns.amazonaws.com/doc/2010-03-31/'
      },
      PublishResult: [
        {
          MessageId: messageId
        }
      ],
      ResponseMetadata: {
        RequestId: randomUUID()
      }
    }
  };
};
export default server;
