'use strict';

var Logger = require('dw/system/Logger');
var Status = require('dw/system/Status');
var Site = require('dw/system/Site');

/**
 * @function afterPOST
 * @description This hook is used to synchronize customer registrations with the Salesforce
 * Platform triggered by OCAPI / headless interactions
 *
 * @param {Object} customer Represents the customer being registered
 * @param {Object} customerRegistration Describes the post used to register a customer
 */
// eslint-disable-next-line no-unused-vars
function afterPOST(customer, customerRegistration) {
    if (!Site.getCurrent().getCustomPreferenceValue('b2ccrm_syncCustomersViaOCAPI') || !customer.isAuthenticated() || !require('dw/system/HookMgr').hasHook('app.customer.created')) {
        return new Status(Status.OK);
    }

    var LOGGER = Logger.getLogger('int_b2ccrmsync', 'hooks.ocapi.shop.customer.afterPOST');
    // Call out that we're executing the customer-profile sync
    LOGGER.info('-- B2C-CRM-Sync: Customer Registration: Start: Sync via OCAPI');
    // Invoke the customer-process hook -- and pass-in the created customer-record
    require('dw/system/HookMgr').callHook('app.customer.created', 'created', customer.getProfile());
    // Call out that we're done executing the customer-profile sync
    LOGGER.info('-- B2C-CRM-Sync: Customer Registration: Stop: Sync via OCAPI');
    // Return an ok-status (authorizing the creation)
    return new Status(Status.OK);
}

/**
 * @function afterPATCH
 * @description This hook is used to synchronize customer profile updates with the
 * Salesforce Platform triggered by OCAPI / headless interactions
 *
 * @param {Object} customer Represents the customer being updated
 * @param {Object} customerRegistration Describes the post used to update the customer profile
 */
// eslint-disable-next-line no-unused-vars
function afterPATCH(customer, customerRegistration) {
    if (!Site.getCurrent().getCustomPreferenceValue('b2ccrm_syncCustomersViaOCAPI') || !customer.isAuthenticated() || !require('dw/system/HookMgr').hasHook('app.customer.updated')) {
        return new Status(Status.OK);
    }

    var LOGGER = Logger.getLogger('int_b2ccrmsync', 'hooks.ocapi.shop.customer.afterPATCH');
    // Call out that we're executing the customer-profile sync
    LOGGER.info('-- B2C-CRM-Sync: Customer Profile Update: Syncing Customer Profile via OCAPI');
    // Invoke the customer-process hook -- and pass-in the created customer-record
    require('dw/system/HookMgr').callHook('app.customer.updated', 'updated', customer.getProfile());
    // Call out that we're done executing the customer-profile sync
    LOGGER.info('-- B2C-CRM-Sync: Customer Profile Update: Finish: Sync via OCAPI');
    // Return an ok-status (authorizing the update)
    return new Status(Status.OK);
}

module.exports.afterPOST = afterPOST;
module.exports.afterPATCH = afterPATCH;
