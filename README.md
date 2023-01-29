# remix-google-cloud-functions

[Remix](https://remix.run) [Adapter](https://remix.run/docs/en/v1/other-api/adapter) for [Google Cloud Functions](https://cloud.google.com/functions) and [Firebase Functions](https://firebase.google.com/docs/functions).

## Usage

### Firebase

See the [functions directory](./example/functions/) in the [example project](./example/).

```sh
npm i remix-google-cloud-functions @remix-run/node @google-cloud/functions-framework firebase-functions
```

Create a Firebase function as follows - `build` should point to the output from `remix build` or `remix dev`.

```js
const { onRequest } = require("firebase-functions/v2/https");
const { createRequestHandler } = require("remix-google-cloud-functions");

const remix = onRequest(
  createRequestHandler({
    build: require("../build"),
  })
);
module.exports = { remix };
```

### Google Cloud Functions

See the [gcf](./example/gcf/) in the [example project](./example/).

```sh
npm i remix-google-cloud-functions @remix-run/node @google-cloud/functions-framework
```

`gcf/index.js`

```js
const { createRequestHandler } = require("remix-google-cloud-functions");

exports.remix = createRequestHandler({
  build: require("../build"),
});
```

To run locally, add a script such as:

`package.json`

```json
    "start": "functions-framework --source gcf --target=remix --port 5003",
```

Note this does not serve the static assets.

Further details can be found on the [official guide](https://cloud.google.com/functions/docs/writing/write-http-functions).

## About Remix

[Remix](https://remix.run) is a web framework that helps you build better websites with React.

To get started, open a new shell and run:

```sh
npx create-remix@latest
```

Then follow the prompts you see in your terminal.

For more information about Remix, [visit remix.run](https://remix.run)!
