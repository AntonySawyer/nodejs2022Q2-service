import { DataSource, DataSourceOptions } from 'typeorm';

import { ORM_OPTIONS } from './ormConfig';

export default new DataSource(ORM_OPTIONS as DataSourceOptions);
