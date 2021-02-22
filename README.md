Bind-Rest
==========
Package to enable applications built with [bind-rest](https://www.npmjs.com/package/bind-rest) framework to run as an AWS Lambda function
## 1.0.1

### Installation
This assumes you already have created an application
using the bind-rest framework and that it rus as a stand-alone node.js
application.

Now in order to run your application on AWS as a Lambda function
you need to install this module

```npm install bind-rest-aws-lambda```


### Usage
As you already know, the [bind-rest](https://www.npmjs.com/package/bind-rest) is a Typescript-based framework,
so you write your program in Typescript.

Create a file in the root of your application. You can name your file
anything you like, for example lambda.ts

Here is an example of lambda.ts
This is a typical real-world example.

```typescript
import {createHandler} from 'bind-rest-aws-lambda'

const handler = createHandler({componentDirs: [__dirname]});

export {handler}
```

As you can see all you need to provide to createHandler function is the 
object that implements ApplicationOptions interface from bind-rest framework.

At the minimum you must pass array of directories that contain your components 
like controllers, middleware, other regular components.

Using the special node.js constance __dirname is a convenient way to say "this directory"

You may pass other options, for example extraComponents. (see below)

The just build your application and use the generated build folder and node_modules directory
to create the archive.zip

Upload archive.zip to AWS Lambda (using AWS Console/Lambda)

Provide the name of your controller file and function in the Handler field,
Set value to
```typescript
build/lambda.handler
```

Configure AWS Api Gateway to use {proxy+} route if using REST API
or you can use HTTP API (costs up to 70% less and could be more efficient)
If using HTTP API instead of REST API set the $default stage and $default route.
If you want to use custom stages instead of default stage then you must 
also use extra middleware provided by this package to fix the 
value of 'path'

This is how to add extra middleware to your application:
```typescript
import {createHandler, FixEvent2Path} from 'bind-rest-aws-lambda'

const handler = createHandler({componentDirs: [__dirname], extraComponents: [FixEvent2Path]});

export {handler}
```

As you can see you just need to import the FixEvent2Path middleware and provide it
as an extraComponent to your application. 

This step is not necessary if using REST API or if using HTTP API but with $default stage.

