import Joi from 'joi';

/**
 * Validate subscription input
 * Ensures that the input contains a valid plan ID and payment details.
 */
export const validateSubscriptionInput = (input: any) => {
  const schema = Joi.object({
    planId: Joi.string().required().label('Plan ID'),
    paymentDetails: Joi.object({
      paymentMethodId: Joi.string().required().label('Payment Method ID'),
    }).required().label('Payment Details'),
  });

  return schema.validate(input, { abortEarly: false });
};

/**
 * Validate email input
 * Ensures the input contains a valid email address.
 */
export const validateEmailInput = (input: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label('Email Address'),
  });

  return schema.validate(input, { abortEarly: false });
};

/**
 * Validate user registration input
 * Ensures the input contains valid user registration details.
 */
export const validateRegistrationInput = (input: any) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required().label('Name'),
    email: Joi.string().email().required().label('Email Address'),
    password: Joi.string().min(8).required().label('Password').messages({
      'string.min': 'Password must be at least 8 characters long',
    }),
  });

  return schema.validate(input, { abortEarly: false });
};

/**
 * Validate user login input
 * Ensures the input contains valid login credentials.
 */
export const validateLoginInput = (input: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label('Email Address'),
    password: Joi.string().required().label('Password'),
  });

  return schema.validate(input, { abortEarly: false });
};

/**
 * Validate file upload input
 * Ensures the input contains a valid file type and size.
 */
export const validateFileUploadInput = (input: any) => {
  const schema = Joi.object({
    file: Joi.object({
      mimeType: Joi.string()
        .valid('application/pdf', 'application/msword', 'image/jpeg', 'image/png')
        .required()
        .label('File Type'),
      size: Joi.number().max(5 * 1024 * 1024).required().label('File Size'), // Max 5 MB
    }).required(),
  });

  return schema.validate(input, { abortEarly: false });
};
