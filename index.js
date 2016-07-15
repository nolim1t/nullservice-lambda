exports.handler = function(event, context) {
    if (event.apiversion >= 20160715) {
      if (event.action != undefined) {
        context.succeed(JSON.stringify({"meta": {"code": 400, "msg": "Not implemented yet"}}));
      } else {
        if (event.redirecturl != undefined) {
          // Do redirect
          context.fail(event.redirecturl.toString());
        } else {
          // Send parameters as JSON
          context.succeed(JSON.stringify({"parameters": event}));
        }
      }
    } else {
      context.error("Invalid version. apiversion must be over 20160715");
    }
}
