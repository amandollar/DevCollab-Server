"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchema = void 0;
const zod_1 = require("zod");
const validateSchema = (schema) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Check if schema expects body, query, params structure or just body
            const schemaKeys = Object.keys(schema.shape || {});
            const hasBodyKey = schemaKeys.includes('body');
            if (hasBodyKey) {
                // Schema expects { body, query, params } structure
                yield schema.parseAsync({
                    body: req.body,
                    query: req.query,
                    params: req.params,
                });
            }
            else {
                // Schema expects just the body directly
                yield schema.parseAsync(req.body);
            }
            return next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.issues.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                return res.status(400).json({
                    message: 'Validation failed',
                    errors: errorMessages
                });
            }
            return res.status(500).json({
                message: 'Internal server error during validation'
            });
        }
    });
};
exports.validateSchema = validateSchema;
