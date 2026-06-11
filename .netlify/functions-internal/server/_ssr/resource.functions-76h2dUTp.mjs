import { f as createSsrRpc } from "./enrollment.functions-BfPYweoP.mjs";
import { a as createServerFn } from "./index.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DFQT01mP.mjs";
import { o as objectType, s as stringType, b as booleanType, e as enumType } from "../_libs/zod.mjs";
const adminCreateResource = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator(objectType({
  title: stringType().min(1).max(255),
  program_id: stringType().uuid().nullable().optional(),
  kind: enumType(["document", "video", "link", "slides"]),
  url: stringType().max(1024).nullable().optional(),
  description: stringType().max(2e3).nullable().optional(),
  is_public: booleanType().default(false),
  file_name: stringType().max(255).optional(),
  content_type: stringType().max(255).optional(),
  file_data: stringType().optional()
})).handler(createSsrRpc("358afa07b7b93837cfced7f848ad027b42a5acb50a738bc5a696c4922696c192"));
const adminDeleteResource = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator(objectType({
  resourceId: stringType().uuid()
})).handler(createSsrRpc("aea08ac5bac23704fe5bad8202595fca6858286f99106ef543400e368df6add0"));
const getResourceDownloadUrl = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator(objectType({
  resourceId: stringType().uuid()
})).handler(createSsrRpc("51b67f6aa325a0d37dc36949792dae163ef345aebd27abd6380cf6e12deb1dcd"));
export {
  adminCreateResource as a,
  adminDeleteResource as b,
  getResourceDownloadUrl as g
};
