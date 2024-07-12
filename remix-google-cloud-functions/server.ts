import type {
  Request as GcfRequest,
  Response as GcfResponse,
} from "@google-cloud/functions-framework";
import type { AppLoadContext, ServerBuild } from "@remix-run/node";
import {
  createRequestHandler as createRemixRequestHandler,
  createReadableStreamFromReadable,
  writeReadableStreamToWritable,
} from "@remix-run/node";

/**
 * A function that returns the value to use as `context` in route `loader` and
 * `action` functions.
 *
 * You can think of this as an escape hatch that allows you to pass
 * environment/platform-specific values through to your loader/action.
 */
export interface GetLoadContextFunction {
  (req: GcfRequest, res: GcfResponse): AppLoadContext;
}

export type RequestHandler = (
  req: GcfRequest,
  res: GcfResponse
) => Promise<void>;

/**
 * Returns a request handler for Google Cloud functions that serves the response using Remix.
 */
export function createRequestHandler({
  build,
  getLoadContext,
  mode = process.env.NODE_ENV,
}: {
  build: ServerBuild;
  getLoadContext?: GetLoadContextFunction;
  mode?: string;
}): RequestHandler {
  let handleRequest = createRemixRequestHandler(build, mode);

  return async (req: GcfRequest, res: GcfResponse) => {
    try {
      let request = createRemixRequest(req, res);
      let loadContext =
        typeof getLoadContext === "function"
          ? getLoadContext(req, res)
          : undefined;

      let response = await handleRequest(request, loadContext);

      await sendRemixResponse(res, response);
    } catch (error) {
      console.error(error);
      await sendRemixResponse(
        res,
        new Response("Internal Error", { status: 500 })
      );
    }
  };
}

export function createRemixHeaders(
  requestHeaders: GcfRequest["headers"]
): Headers {
  let headers = new Headers();

  for (let [key, values] of Object.entries(requestHeaders)) {
    if (values) {
      if (Array.isArray(values)) {
        for (let value of values) {
          headers.append(key, value);
        }
      } else {
        headers.set(key, values);
      }
    }
  }

  return headers;
}

export function createRemixRequest(req: GcfRequest, res: GcfResponse): Request {
  let origin = `${req.protocol}://${req.get("host")}`;
  let url = new URL(req.url, origin);

  let controller = new AbortController();

  res.on("close", () => controller.abort());

  let init: RequestInit = {
    method: req.method,
    headers: createRemixHeaders(req.headers),
    signal: controller.signal as RequestInit["signal"],
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = createReadableStreamFromReadable(req);
    (init as { duplex: "half" }).duplex = "half";
  }

  return new Request(url.href, init);
}

async function sendRemixResponse(
  res: GcfResponse,
  nodeResponse: Response
): Promise<void> {
  res.statusMessage = nodeResponse.statusText;
  res.status(nodeResponse.status);

  for (let [key, values] of nodeResponse.headers.entries()) {
    for (let value of values) {
      res.append(key, value);
    }
  }

  if (nodeResponse.body) {
    await writeReadableStreamToWritable(nodeResponse.body, res);
  } else {
    res.end();
  }
}
