import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const APP_CATALOG_TABLE = process.env.APP_CATALOG_TABLE!;
const USER_ENTITLEMENTS_TABLE = process.env.USER_ENTITLEMENTS_TABLE!;

export async function getUserEntitlements(email: string): Promise<any[]> {
  const command = new QueryCommand({
    TableName: USER_ENTITLEMENTS_TABLE,
    KeyConditionExpression: "PK = :pk and begins_with(SK, :sk)",
    ExpressionAttributeValues: {
      ":pk": `user#${email}`,
      ":sk": "app#",
    },
  });

  const { Items } = await docClient.send(command);
  return Items || [];
}

export async function getAppDetails(appId: string): Promise<any | null> {
    const command = new QueryCommand({
        TableName: APP_CATALOG_TABLE,
        KeyConditionExpression: "PK = :pk",
        ExpressionAttributeValues: {
            ":pk": `app#${appId}`,
        },
    });

    const { Items } = await docClient.send(command);
    return Items?.[0] || null;
}

// Other DB functions like batch writing entitlements will go here
