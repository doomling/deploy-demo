import type { Instrumentation } from "next";
import { log } from "@/lib/log";

/**
 * Next.js llama a esta función con cada error del servidor que nadie
 * atrapó: Server Components, Server Actions y Route Handlers.
 * El digest es el mismo que ve el usuario en la página de error.
 */
export const onRequestError: Instrumentation.onRequestError = async (
  err,
  request,
  context,
) => {
  const error = err as Error & { digest?: string };

  log("error", "request_error", {
    digest: error.digest,
    error: error.message,
    method: request.method,
    path: request.path,
    routeType: context.routeType,
    routePath: context.routePath,
  });
};
