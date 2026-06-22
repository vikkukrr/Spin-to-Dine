const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];
    if (schema.body) {
      const { error } = schema.body.validate(req.body, { abortEarly: false });
      if (error) {
        error.details.forEach(detail => {
          errors.push({ field: detail.path.join('.'), message: detail.message });
        });
      }
    }
    if (schema.query) {
      const { error } = schema.query.validate(req.query, { abortEarly: false });
      if (error) {
        error.details.forEach(detail => {
          errors.push({ field: detail.path.join('.'), message: detail.message });
        });
      }
    }
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    next();
  };
};

module.exports = { validate };
