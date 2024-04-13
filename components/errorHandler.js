import { client, v1 } from '@datadog/datadog-api-client';

const configurationOpts = {
  authMethods: {
    apiKeyAuth: "e3575de47a1503ba8454e377489e371d"
  }
}

const configuration = client.createConfiguration(configurationOpts);
const apiInstance = new v1.EventsApi(configuration);

export default function errorHandler (title, message, symbol, event, version) {
    const params = {
        body: {
            title: title,
            text: message,
            alert_type: "error",
            deviceName: "",
            host: "",
            priority: "normal",
            source: "stock-display",
            tags: [
                    "environment:prod",
                    "app:stock-display",
                    "service:Custom",
                    `version:${version}`,
                    `event:${event}`,
                    `tag:${symbol}`,
                ]
        }
    }

    apiInstance
        .createEvent(params)
        .then((data) => {
            console.log("API called successfully. Returned data: " + JSON.stringify(data));
        })
        .catch((error) => {
            console.error(error);
        });
}