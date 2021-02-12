// eslint-disable-next-line max-classes-per-file
import { APIGatewayEvent, Context as LambdaContext } from 'aws-lambda';
import { BindRestContext } from 'bind-rest';
import http from 'http';
import HTTPMethod from 'http-method-enum';

import createRequest from 'serverless-http/lib/provider/aws/create-request';

import { ParsedUrlQuery } from 'querystring';

// import { IAWSGatewayEvent } from '../interfaces';
import { multiValueQueryStringParameters, normalizeMultiValues } from '../lib';

export default class AwsLambdaContext extends BindRestContext {
  constructor(
    public readonly apiGatewayEvent: APIGatewayEvent,
    public readonly lambdaContext: LambdaContext,
  ) {
    super();
  }

  protected normalizedHeaders: http.IncomingHttpHeaders;

  protected eventQueryString: string;

  /**
   * @todo maybe need to normalize headers in case of multi-value headers?
   */
  get requestHeaders(): http.IncomingHttpHeaders {
    if (!this.normalizedHeaders) {
      this.normalizedHeaders = normalizeMultiValues(this.apiGatewayEvent.multiValueHeaders);
    }
    return this.normalizedHeaders;
  }

  get requestBody(): string | undefined {
    return this.apiGatewayEvent.body;
  }

  get requestMethod(): HTTPMethod {
    return this.apiGatewayEvent.httpMethod as HTTPMethod;
  }

  get req(): http.IncomingMessage {
    if (!this.httpRequest) {
      this.httpRequest = createRequest(this.apiGatewayEvent, this.lambdaContext, {});
    }

    return this.httpRequest;
  }

  get path() {
    return this.apiGatewayEvent.path;
  }

  /**
   * @todo look at what the parent class returns for this.
   * Does it include protocol, host, port etc or just a relative path with query?
   */
  get requestUrl() {
    const qs = this.querystring;
    return qs ? `${this.path}&${qs}` : this.path;
  }

  get querystring(): string {
    if (!this.eventQueryString) {
      this.eventQueryString = multiValueQueryStringParameters(
        this.apiGatewayEvent.multiValueQueryStringParameters,
      );
    }

    return this.eventQueryString;
  }

  get parsedUrlQuery(): ParsedUrlQuery {
    if (!this.query) {
      this.query = normalizeMultiValues(this.apiGatewayEvent.multiValueQueryStringParameters);
    }

    return this.query;
  }
}
