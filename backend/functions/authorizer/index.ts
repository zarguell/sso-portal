import { APIGatewayRequestAuthorizerEvent, APIGatewayAuthorizerResult } from 'aws-lambda';
import * as jwt from 'jsonwebtoken';

// In a real scenario, you'd fetch this from a JWKS endpoint
const JWT_SECRET = 'your-jwt-secret'; // Replace with a real secret from Secrets Manager

export const handler = async (event: APIGatewayRequestAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
    const token = event.headers?.Authorization?.split(' ')[1];

    if (!token) {
        return generatePolicy('user', 'Deny', event.methodArn);
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // You can add more validation here (e.g., issuer, audience)
        const principalId = typeof decoded === 'object' ? decoded.sub || 'user' : 'user';
        return generatePolicy(principalId, 'Allow', event.methodArn, {
            email: (decoded as any).email,
            displayName: (decoded as any).name
        });
    } catch (e) {
        console.error('Invalid token:', e);
        return generatePolicy('user', 'Deny', event.methodArn);
    }
};

function generatePolicy(principalId: string, effect: 'Allow' | 'Deny', resource: string, context?: any): APIGatewayAuthorizerResult {
    const authResponse: any = {
        principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [{
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource,
            }],
        },
    };

    if (context) {
        authResponse.context = context;
    }

    return authResponse;
}
