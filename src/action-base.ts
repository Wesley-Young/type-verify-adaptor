import {Schema, Validate, validator} from "@exodus/schemasafe";
import {FromSchema, JSONSchema} from "json-schema-to-ts";

type RetData =
  { status: "ok", retcode: 0, data: any } |
  { status: "async", retcode: 1 } |
  { status: "failed", retcode: number }

type CheckResult<SideEffect> = {
  isValid: true,
  sideEffect: SideEffect
} | {
  isValid: false,
  errMsg: string
};

export interface Action<
  Schema extends JSONSchema,
  Data,
  Effect
> {
  schema: Schema,
  checker?: (payload: FromSchema<Schema>) => CheckResult<Effect> | Promise<CheckResult<Effect>>,
  consumer: (payload: FromSchema<Schema>, sideEffect: Effect) => Data | Promise<Data>
}

interface ActionWrapper {
  validator: Validate,
  checker?: (payload: any) => any,
  consumer: (payload: any, sideEffect: any) => any
}

const actions = new Map<string, ActionWrapper>()

export function registerAction(name: string, action: {
  schema: JSONSchema
  checker?: (payload: any) => any,
  consumer: (payload: any, sideEffect: any) => any
}) {
  actions.set(name, {
    validator: validator(action.schema as Schema),
    checker: action.checker ? (payload) => action.checker(payload) : undefined,
    consumer: (payload, sideEffect) => action.consumer(payload, sideEffect)
  });
}

export async function handle(actionName: string, payload: any): Promise<RetData> {
  const wrapper = actions.get(actionName);
  if (!wrapper) return {
    status: "failed",
    retcode: 1404
  };

  const { validator, checker, consumer } = wrapper;
  if (!validator(payload)) return {
    status: "failed",
    retcode: 1400
  };

  let sideEffect = undefined;
  if (checker) {
    const checkResult = await checker(payload);
    if (!checkResult.isValid) {
      // log checkResult.errMsg to the console
      return {
        status: "failed",
        retcode: 1400
      };
    }
    sideEffect = checkResult.sideEffect;
  }
  return {
    status: "ok",
    retcode: 0,
    data: await consumer(payload, sideEffect)
  };
}