exports.handler = function(event, context) {
    if (parseInt(event.version) >= 20160715) {
      if (event.action != undefined) {
        context.succeed({"meta": {"code": 400, "msg": "Not implemented yet"}});
      } else {
        if (event.redirecturl != undefined) {
          // Do redirect
          context.fail(event.redirecturl.toString());
        } else {
          // Send parameters as JSON
          context.succeed({"parameters": event});
        }
      }
    } else {
      context.fail("Invalid version")
    }
}
