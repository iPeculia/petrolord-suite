/**
 * This file is for documentation and type-hinting purposes.
 * JavaScript does not enforce these types at runtime.
 */

/**
 * @typedef {Object} MEMProject
 * @property {string} id - UUID of the project.
 * @property {string} user_id - UUID of the user.
 * @property {string} project_name - Name of the project.
 * @property {'metric' | 'imperial'} unit_system - The unit system used.
 * @property {string} created_at - ISO timestamp of creation.
 */

/**
 * @typedef {Object} WellLogData
 * @property {string[]} curves - Array of curve mnemonics.
 * @property {Object<string, number>[]} data - Array of data rows.
 */

/**
 * @typedef {Object} PressurePoint
 * @property {number} depth
 * @property {number} pressure
 * @property {'mdt' | 'leakoff' | 'formation_test'} type
 */

/**
 * @typedef {Object} CalculationResults
 * @property {Object<string, number>[]} stresses - Calculated stresses vs. depth.
 * @property {Object<string, number>[]} mudWindow - Calculated mud window vs. depth.
 */

/**
 * @typedef {Object} EdgeFunctionJob
 * @property {string} id - UUID of the job.
 * @property {string} project_id - UUID of the project.
 * @property {'queued' | 'running' | 'completed' | 'failed'} status - Job status.
 * @property {string} function_name - Name of the invoked edge function.
 */

export const Types = {};