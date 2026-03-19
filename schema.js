const Joi = require("joi");

const listingschema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
   image: Joi.object({
  url: Joi.string().uri().allow("",null)
}).unknown(true).optional(),
    price: Joi.number().min(0).required(),
    location: Joi.string().required(),
    country: Joi.string().required()
  }).required()
});

const reviewschema = Joi.object({
  review: Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
  }).required()
});

module.exports={listingschema,reviewschema};