import {handle} from "./action-base";

require("./ExampleAction");

async function main() {
  await handle("", {}).then(res => console.log(res));
  await handle("example_action", {}).then(res => console.log(res));
  await handle("example_action", {
    foo: "bar", bar: 1
  }).then(res => console.log(res));
  await handle("example_action", {
    foo: "bar", bar: 0
  }).then(res => console.log(res));
}

main().then();