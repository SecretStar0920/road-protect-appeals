import bodyParser = require('body-parser');

export default function addBodyParser(app) {
    app.use(
        bodyParser.json({
            limit: '50mb',
        }),
    );
}
