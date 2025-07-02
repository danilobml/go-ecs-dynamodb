import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as ecs from 'aws-cdk-lib/aws-ecs'
import * as ec2 from 'aws-cdk-lib/aws-ec2'

export class GoEcsDynamoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    const vpc = new ec2.Vpc(this, "GoEcsDynamoVpc", {
      maxAzs: 2,
      natGateways: 0,
    })

    // ECS cluster
    const cluster = new ecs.Cluster(this, "GoEcsDynamoCluster", {
      vpc
    })
    // Capacity
    cluster.addCapacity("GoEcsDynamoClusterCapacity", {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      desiredCapacity: 1,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC
      }
    })

    // DynamoDB table
    const dynamoDbPeopleTable = new dynamodb.TableV2(this, "GoEcsDynamoPeopleTable", {
      tableName: 'people',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billing: dynamodb.Billing.onDemand(),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })

    // ECS Task definition
    const taskDefinition = new ecs.Ec2TaskDefinition(this, "GoEcsDynamoTaskDefinition")
    taskDefinition.addContainer("GoEcsDynamoContainer", {
      image: ecs.ContainerImage.fromAsset('../'),
      memoryLimitMiB: 512,
      cpu: 256,
      environment: {
        AWS_REGION: this.region,
      },
      portMappings: [
        {
          containerPort: 8080,
        },
      ],
    })

    // ECS-EC2 service
    new ecs.Ec2Service(this, "GoEcsDynamoService", {
      cluster,
      taskDefinition,
      desiredCount: 1,
    })

    // Role permissions
    dynamoDbPeopleTable.grantReadWriteData(taskDefinition.taskRole)
  }
}
