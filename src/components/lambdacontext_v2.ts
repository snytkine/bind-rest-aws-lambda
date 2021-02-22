import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { Context as LambdaContext } from 'aws-lambda/handler';
import { BindRestContext } from 'bind-rest';
import http from 'http';
import createRequest from 'serverless-http/lib/provider/aws/create-request';
import HTTPMethod from 'http-method-enum';
import { ParsedUrlQuery } from 'querystring';
import { IBindRestContext } from 'bind-rest/build/types/lib/interfaces/icontext';
import normalizeV2EventQuery from '../lib/normalizev2eventquery';

const debug = require('debug')('bind:rest:aws:lambda');

const TAG = 'AwsLambdaContextV2';

export default class AwsLambdaContextV2 extends BindRestContext implements IBindRestContext {
  /**
   * a middleware may set this value
   * A use case for such middleware is to strip the
   * environment prefix from realPath in eventV2
   * where realPath is something like /dit/mypath/something
   * usually the router does not have any knowledge of 'dit' or any other
   * environment-specific prefix since this is AWS Http Gateway specific thing.
   * So a middleware can be run early in the middleware chain (before it reaches router, should be
   * close the being the first middleware). A middleware will be able to look at 'stage' value
   * and if it's not $default stage then remove the prefix.
   *
   * Also an eventMapper can be run on the creation of the context, this way
   * a context will already have a path normalized.
   *
   * @private
   */
  private realPath: string;

  constructor(
    public readonly apiGatewayEvent: APIGatewayProxyEventV2,
    public readonly lambdaContext: LambdaContext,
    public readonly isColdStart: boolean = false,
  ) {
    super();
    debug('entered AwsLambdaContextV2 constructor');
    this.contextType = 'AwsLambdaContextV2';
    debug('%s Constructed. isColdStart=%s', TAG, isColdStart);
  }

  /**
   * need to normalize headers in case of multi-value headers?
   */
  get requestHeaders(): http.IncomingHttpHeaders {
    return this.apiGatewayEvent.headers;
  }

  get requestBody(): string | undefined {
    return this.apiGatewayEvent.body;
  }

  get requestMethod(): HTTPMethod {
    const ret = this.apiGatewayEvent.requestContext.http.method as HTTPMethod;
    debug('%s returning from requestMethod ret=%s', TAG, ret);
    return ret;
  }

  get req(): http.IncomingMessage {
    if (!this.httpRequest) {
      this.httpRequest = createRequest(this.apiGatewayEvent, this.lambdaContext, {});
    }

    return this.httpRequest;
  }

  /**
   * A setter is here for the purpose of middleware being able
   * to set the value of path.
   * @param s
   */
  set path(s: string) {
    this.realPath = s;
  }

  get path() {
    if (this.realPath === undefined) {
      this.realPath = this.apiGatewayEvent.rawPath;
    }

    return this.realPath;
  }

  get requestUrl() {
    return this.apiGatewayEvent.rawQueryString
      ? `${this.path}?${this.apiGatewayEvent.rawQueryString}`
      : this.path;
  }

  get querystring(): string {
    return this.apiGatewayEvent.rawQueryString;
  }

  get parsedUrlQuery(): ParsedUrlQuery {
    if (!this.query) {
      this.query = normalizeV2EventQuery(this.apiGatewayEvent.queryStringParameters);
    }

    return this.query;
  }

  get parsedCookies(): NodeJS.Dict<string> {
    if (this.cookies === undefined) {
      if (this.apiGatewayEvent.cookies) {
        this.cookies = this.apiGatewayEvent.cookies.reduce((acc, next) => {
          const [cookieName, cookieValue] = next.split('=');
          return { ...acc, [cookieName]: cookieValue };
        }, {});
      } else {
        debug('%s NO cookie in apiGatewayEvent V2');
        this.cookies = {};
      }
    }

    return this.cookies;
  }
}
