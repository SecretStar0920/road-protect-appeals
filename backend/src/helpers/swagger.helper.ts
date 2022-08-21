import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import config from '@config';
import swaggerMappingModels from '../apis/swagger-mapping-models';

export function createSwagger(app) {
    // add swagger if not production
    if (config.swagger.disable) {
        return;
    }

    swaggerMappingModels();

    const options = new DocumentBuilder()
        .setTitle(config.swagger.name)
        .setDescription(config.swagger.desc)
        .setVersion(config.swagger.version)
        .addBearerAuth('Authorization', 'header')
        .build();

    app.use('/api-docs', (req, res, next) => res.send(document));

    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('/api/swagger', app, document);

    const swStats = require('swagger-stats');

    // Load your swagger specification
    const apiSpec = JSON.stringify(document);

    // Enable swagger-stats middleware in express app, passing swagger specification as option
    app.use(swStats.getMiddleware({ swaggerSpec: apiSpec }));
}

export function printSwaggerDetails() {
    if (!config.swagger.disable) {
        console.log(' ');
        console.log('\x1b[36m%s\x1b[0m', '---------- Swagger ----------');
        console.log('\x1b[36m%s\x1b[0m', `Swagger Client`);
        console.log('\x1b[36m%s\x1b[0m', `http://localhost:${config.app.port}/api/swagger`);
        console.log('\x1b[36m%s\x1b[0m', `Swagger Json`);
        console.log('\x1b[36m%s\x1b[0m', `http://localhost:${config.app.port}/api-docs/`);
        console.log('\x1b[36m%s\x1b[0m', `Swagger Stats`);
        console.log('\x1b[36m%s\x1b[0m', `http://localhost:${config.app.port}/swagger-stats/ui`);
        console.log(' ');
    }
}
