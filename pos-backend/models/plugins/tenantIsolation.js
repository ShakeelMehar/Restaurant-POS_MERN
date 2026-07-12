const tenantContext = require('../../middlewares/tenantContext');

module.exports = function tenantIsolationPlugin(schema, options) {
    const applyTenantFilter = function (next) {
        // Exclude Super Admin operations or bypass commands if explicitly requested
        const store = tenantContext.getStore();
        
        if (store && store.restaurantId) {
            this.where({ restaurantId: store.restaurantId });
        } else if (store && store.bypassIsolation) {
            // Explicitly bypassed, do nothing
        } else {
            // If store is undefined or missing bypass/restaurantId, STRICTLY block it.
            // This prevents unauthenticated routes or forgotten middlewares from querying across all tenants!
            return next(new Error('Strict Tenant Isolation: Missing restaurantId context. You must wrap this query in tenantContext.run()'));
        }

        next();
    };

    // Apply to read operations
    schema.pre('find', applyTenantFilter);
    schema.pre('findOne', applyTenantFilter);
    schema.pre('countDocuments', applyTenantFilter);
    schema.pre('count', applyTenantFilter);
    schema.pre('findOneAndUpdate', applyTenantFilter);
    schema.pre('updateMany', applyTenantFilter);
    schema.pre('deleteMany', applyTenantFilter);
    schema.pre('findOneAndDelete', applyTenantFilter);

    // Apply to create/save operations
    schema.pre('validate', function (next) {
        const store = tenantContext.getStore();
        
        if (store && store.restaurantId) {
            this.restaurantId = store.restaurantId;
        } else if (store && store.bypassIsolation) {
            // Explicitly bypassed, do nothing
        } else {
            return next(new Error('Strict Tenant Isolation: Cannot save document without a restaurantId in context.'));
        }
        next();
    });
};
