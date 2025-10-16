import { DynamoDBDocumentClient, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { loadMockData } from "./adapters/mock";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const USER_ENTITLEMENTS_TABLE = process.env.USER_ENTITLEMENTS_TABLE!;

export const handler = async (event: any): Promise<void> => {
    console.log('Starting entitlement sync...');

    // For MVP, we only use the mock adapter
    const users = await loadMockData();

    const writeRequests = users.flatMap(user => {
        const metadataRequest = {
            PutRequest: {
                Item: {
                    PK: `user#${user.email}`,
                    SK: "metadata",
                    email: user.email,
                    displayName: user.displayName,
                    lastSync: new Date().toISOString(),
                }
            }
        };

        const appRequests = user.apps.map(appId => ({
            PutRequest: {
                Item: {
                    PK: `user#${user.email}`,
                    SK: `app#${appId}`,
                    appId: appId,
                    grantedAt: new Date().toISOString(),
                    source: "mock-data",
                }
            }
        }));

        return [metadataRequest, ...appRequests];
    });

    // DynamoDB BatchWriteCommand can take up to 25 items at a time
    for (let i = 0; i < writeRequests.length; i += 25) {
        const chunk = writeRequests.slice(i, i + 25);
        const command = new BatchWriteCommand({
            RequestItems: {
                [USER_ENTITLEMENTS_TABLE]: chunk,
            },
        });
        await docClient.send(command);
    }

    console.log(`Successfully synced ${users.length} users and their entitlements.`);
};
