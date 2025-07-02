#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { GoEcsDynamoStack } from '../lib/go-ecs-dynamo-stack';

const app = new cdk.App();
new GoEcsDynamoStack(app, 'GoEcsDynamoStack', {
});