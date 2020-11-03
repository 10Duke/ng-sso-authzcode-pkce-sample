/**
 * Parses parameters (key-value) from query-parameters.
 *
 */
export function parseQueryParameters(query: string): Record<string, string>
{
    console.log(query);
    const pairs = query.split('&');
    const decode = decodeURIComponent;
    const parameters: Record<string, string> = {};

    for (const pair of pairs) {
        const parameter = pair.split('=');
        const name = decode(parameter[0]);
        const value = decode(parameter[1]);

        parameters[name] = value;
    }

    return parameters;
}
