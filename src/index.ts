import express from 'express';
import cors from 'cors';
import type { Server } from 'http';
import * as xml2js from 'xml2js';
import * as bodyParser from 'body-parser';
import { PublishInput, MessageAttributeMap } from 'aws-sdk/clients/sns';
import { randomUUID } from 'crypto';
import { sms } from './store';
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
        return {};
      case 'CreateTopic':
        return {};
      case 'Subscribe':
        return {};
      case 'Unsubscribe':
        return {};
      case 'Publish':
        const input: PublishInput = {
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
        return res.send(
          builder.buildObject(
            publish(
              input.TopicArn,
              input.Subject,
              input.Message,
              input.PhoneNumber,
              input.MessageStructure,
              input.MessageAttributes,
              input.MessageGroupId
            )
          )
        );
      default:
        throw new Error();
    }
  });

  return new Promise((resolve) => {
    const s = app.listen(Number(config.port), () => resolve(s));
  });
};

const publish = (
  topicArn: string | undefined,
  subject: string | undefined,
  message: string,
  phoneNumber: string | undefined,
  messageStructure: string | undefined,
  messageAttributes: MessageAttributeMap | undefined,
  messageGroupId: string | undefined
): any => {
  const messageId = randomUUID();
  if (phoneNumber) {
    sms.push({
      messageId: messageId,
      messageGroupId: messageGroupId,
      destination: phoneNumber,
      message: message,
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
