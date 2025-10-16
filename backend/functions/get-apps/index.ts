import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUserEntitlements, getAppDetails } from '../../shared/db';
import { App, GetAppsResponse } from '../../shared/types';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userEmail = event.requestContext.authorizer?.lambda.email;

    if (!userEmail) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'unauthorized', message: 'Invalid or expired token' }),
        };
    }

    try {
        const entitlements = await getUserEntitlements(userEmail);
        const appPromises = entitlements.map(ent => getAppDetails(ent.appId));
        const appDetails = await Promise.all(appPromises);

        const apps: App[] = appDetails
            .filter(app => app && app.enabled)
            .map(app => ({
                id: app.id,
                name: app.name,
                description: app.description,
                category: app.category,
                iconUrl: app.iconUrl,
                ssoUrl: `/api/sso/${app.id}`, // Construct the SSO URL
                tags: app.tags,
            }));

        const response: GetAppsResponse = {
            user: {
                email: userEmail,
                displayName: event.requestContext.authorizer?.lambda.displayName || '',
            },
            apps,
        };

        return {
            statusCode: 200,
            body: JSON.stringify(response),
            headers: {
                'Content-Type': 'application/json',
            }
        };
    } catch (error) {
        console.error('Error fetching apps:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'internal_server_error', message: 'Service temporarily unavailable' }),
        };
    }
};
