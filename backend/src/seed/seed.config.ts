export const rolePermissionsSeed = {
    admin: ['*'],
    doctor: [
        // patient
        'patient:create',
        'patient:read',
        'patient:update',
        'patient:delete',

        // study
        'study:create',
        'study:read',
        'study:update',
        'study:delete',

        // series
        'series:create',
        'series:read',
        'series:update',
        'series:delete',

        // inference
        'inference:create',
        'inference:read',
        'inference:update',
        'inference:delete',

        // prediction
        'prediction:create',
        'prediction:read',
        'prediction:update',
        'prediction:delete',

        // prediction-run
        'prediction-run:create',
        'prediction-run:read',
        'prediction-run:update',
        'prediction-run:delete',

        // ingestion
        'ingestion:create',
        'ingestion:read',
        'ingestion:update',
        'ingestion:delete',

        // instance-image (часто лучше только read/update, но ты просил полный CRUD)
        'instance-image:create',
        'instance-image:read',
        'instance-image:update',
        'instance-image:delete',
    ],
};