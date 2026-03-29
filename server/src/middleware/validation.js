import { ZodSchema } from 'zod';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      // Validate request body
      if (schema.body) {
        const result = schema.body.parse(req.body);
        req.body = result;
      }

      // Validate query parameters
      if (schema.query) {
        const result = schema.query.parse(req.query);
        req.query = result;
      }

      // Validate route parameters
      if (schema.params) {
        const result = schema.params.parse(req.params);
        req.params = result;
      }

      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
  };
};

// Common validation schemas
export const schemas = {
  signup: {
    body: {
      name: { type: 'string', minLength: 2, maxLength: 100 },
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8 }
    }
  },
  
  login: {
    body: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 1 }
    }
  },

  // For more complex validation, you can integrate Zod schemas
  // This is a simplified version for demonstration
};
