import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUserEntitlements } from '../../shared/db';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userEmail = event.requestContext.authorizer?.lambda.email;
    const appId = event.pathParameters?.appId;

    if (!userEmail || !appId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'bad_request', message: 'Missing user email or app ID' }),
        };
    }

    try {
        const entitlements = await getUserEntitlements(userEmail);
        const hasAccess = entitlements.some(ent => ent.appId === appId);

        if (!hasAccess) {
            return {
                statusCode: 403,
                body: JSON.stringify({ error: 'access_denied', message: 'You do not have access to this application' }),
            };
        }

        // MVP: Mock SSO initiation
        console.log(`SSO initiated for user ${userEmail} to app ${appId}`);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `SSO initiated to ${appId}`,
                appName: appId, // In a real scenario, you'd fetch the app name
                userEmail: userEmail,
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        };
    } catch (error) {
        console.error('Error initiating SSO:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'internal_server_error', message: 'Service temporarily unavailable' }),
        };
    }
};
