# type-verify-adaptor

A simple system for type-safe APIs with examples.

Maybe useful for microservices that do not prefer a heavy framework?

## A brief instruction

1. **Define your type!** For input data (payload), please use JSON Schema to define its type; for returned data, just plain TypeScript type is OK.
2. **Write your logic!** During this, the type definition of your payload and returned data will be inferred by your IDE, and there's no need to worry about typos and `TypeError`s.
3. **Register your action!** Call `registerAction` to put your fresh code into production.

## What does `check` do?

Although `Schema` can do much, it cannot do everything. `Schema` is useful when determining whether the _structure_ of the input data is right, but it knows nothing about your _production environment_. For example, it does not know whether the object with a given `id` exists in your database, and this is exactly what your `check` method should do.

## When should I use `sideEffect` param?

Imagine your `check` function calls a blocking API to check whether an object with the given `id` exists, and this API just returns the exact object (if it does exist) instead of telling you whether it exists. (What a bad API! But just think about it.) Your `consumer` function will use this object, but you certainly do not want to call this blocking API twice. You just want to know whether it _exists_; but the API just _returns_ the whole object to you. Its action of returning the object is called **side effect**.

In this case, you can use `sideEffect` parameter to pass the fetched object directly to the `consumer` function, without fetching it again.

### Why not just modify the `payload` object?

Guys, we are using TypeScript, not JavaScript. To ensure type safety, we have to wrap the side effect in another parameter. Fortunately, you can customize the structure of the `sideEffect` parameter passed to your `consumer` function.