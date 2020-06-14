const decoratorValidator = (fn, schema, argsType) => {
  return async function (event) {
    const data = JSON.parse(event[argsType]);
    // abortEarly show all errors
    const { error, value } = await schema.validate(
      data,
      { abortEarly: true }
    );
    // this will update instance of arguments
    event[argsType] = value;
    //  arguments serves to take all the arguments that came in the function
    // go to next
    // the apply will return that will run late
    if (!error) return fn.apply(this, arguments);

    return {
      statusCode: 422,
      body: error.message,
    }
  };
}

module.exports = decoratorValidator;
