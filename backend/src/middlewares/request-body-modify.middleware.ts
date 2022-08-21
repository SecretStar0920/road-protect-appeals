export async function RequestBodyModify(req, res, next) {
    // request body modify
    try {
        req.body = JSON.stringify(req.body);
        req.body = req.body.replace(/(<([^>]+)>)/gi, ' ');
        req.body = JSON.parse(req.body);
    } catch {}

    await next();
}
