import {Action, registerAction} from "./action-base";
import {JSONSchema} from "json-schema-to-ts";

const exampleSchema = {
  type: "object",
  properties: {
    foo: { type: "string" },
    bar: { type: "integer" },
  },
  required: ["foo"],
  additionalProperties: false,
} as const satisfies JSONSchema

const exampleAction: Action<
  typeof exampleSchema,
  { foo: string },
  string
> = {
  schema: exampleSchema,
  checker: payload => {
    if (payload.bar && payload.bar === 1) {
      return {
        isValid: false,
        errMsg: "Some err msg"
      };
    }
    return {
      isValid: true,
      sideEffect: payload.foo
    }
  },
  consumer: (payload, sideEffect) => ({
    foo: `sideEffect ${sideEffect}`
  })
} as const

registerAction("example_action", exampleAction);