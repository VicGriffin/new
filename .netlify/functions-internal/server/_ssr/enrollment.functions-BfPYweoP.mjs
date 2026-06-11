import { a as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./index.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DFQT01mP.mjs";
import { o as objectType, s as stringType, n as numberType, a as arrayType, e as enumType } from "../_libs/zod.mjs";
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
enumType(["pending_payment", "payment_approved", "active", "completed", "rejected"]);
enumType(["pending", "approved", "rejected"]);
const createEnrollment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator(objectType({
  programId: stringType().uuid()
})).handler(createSsrRpc("4cee8d10f01379b0cb57bea35baed1d4467d322cd34b26bafca71d15f76850e9"));
const submitPayment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator(objectType({
  enrollmentId: stringType().uuid(),
  amount: numberType().positive(),
  reference: stringType().min(1).max(128),
  method: stringType().min(1).max(64)
})).handler(createSsrRpc("b597591822fb604df0792c0b5591a0600e82e58ffd84f24e7750bb8db23e3007"));
const updateProgress = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator(objectType({
  enrollmentId: stringType().uuid(),
  completedTopics: arrayType(stringType()),
  lastModule: stringType().min(1),
  lastTopic: stringType().min(1)
})).handler(createSsrRpc("756b70ef45ca15008576333c1061e06638fabe52907b60a490077cd337e73a44"));
const adminApproveEnrollment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator(objectType({
  enrollmentId: stringType().uuid()
})).handler(createSsrRpc("7fe60e17dc91a78cb0de49293d1c75f9b01786e4cd570c84f3b62cb6790e88c3"));
const adminRejectEnrollment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator(objectType({
  enrollmentId: stringType().uuid()
})).handler(createSsrRpc("21d9ea8ebece835665a682ef3fa77332d26144ad2410924b813f0273471b72d3"));
const adminCompleteEnrollment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator(objectType({
  enrollmentId: stringType().uuid()
})).handler(createSsrRpc("6ad3b58c21d953e66e41e3552eddcee7163992c54d762c8200e0554e87000497"));
const adminDeleteEnrollment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator(objectType({
  enrollmentId: stringType().uuid()
})).handler(createSsrRpc("96c132fdc9dc350b6b3a041609b90fb7a9ef984fe0aee08c0e737b8eca862fbe"));
export {
  adminApproveEnrollment as a,
  adminRejectEnrollment as b,
  createEnrollment as c,
  adminCompleteEnrollment as d,
  adminDeleteEnrollment as e,
  createSsrRpc as f,
  submitPayment as s,
  updateProgress as u
};
