import { INestApplication } from '@nestjs/common';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join, relative } from 'path';

export const setupSwagger = (app: INestApplication): void => {
  const { YAML_CONFIG_ABSOLUTE_PATH, SWAGGER_PATH } = process.env;

  if (!YAML_CONFIG_ABSOLUTE_PATH || !SWAGGER_PATH) {
    return;
  }

  const relativePathToYaml = relative(__dirname, YAML_CONFIG_ABSOLUTE_PATH);

  const swaggerDocument = yaml.load(
    readFileSync(join(__dirname, relativePathToYaml), 'utf8'),
  ) as OpenAPIObject;

  if (swaggerDocument) {
    SwaggerModule.setup(SWAGGER_PATH, app, swaggerDocument);
  }
};
