import Testimonial from "../models/testimonial.model.js";
import ApiError from "../utils/apiError.js";

export const createTestimonial = async ({ name, country, rating, gender, thinking }) => {
  const testimonial = await Testimonial.create({ name, country, rating, gender, thinking });
  return testimonial;
};

export const getPublicTestimonials = async () => {
  const testimonials = await Testimonial.findAll({
    where: { isActive: true },
    order: [["createdAt", "DESC"]],
  });
  return testimonials;
};

export const getAllTestimonialsForAdmin = async () => {
  const testimonials = await Testimonial.findAll({ order: [["createdAt", "DESC"]] });
  return testimonials;
};

export const toggleTestimonialStatus = async (id, isActiveStatus) => {
  const testimonial = await Testimonial.findByPk(id);
  if (!testimonial) throw new ApiError(404, "Testimonial not found");

  testimonial.isActive = isActiveStatus;
  await testimonial.save();

  return testimonial;
};

// Lets an admin correct/rewrite a submitted testimonial (e.g. fixing typos,
// trimming inappropriate language) before or after approving it. Only the
// fields actually provided are changed - omitted fields are left as-is.
export const updateTestimonial = async (id, { name, country, rating, gender, thinking }) => {
  const testimonial = await Testimonial.findByPk(id);
  if (!testimonial) throw new ApiError(404, "Testimonial not found");

  if (name !== undefined) testimonial.name = name;
  if (country !== undefined) testimonial.country = country;
  if (rating !== undefined) testimonial.rating = rating;
  if (gender !== undefined) testimonial.gender = gender;
  if (thinking !== undefined) testimonial.thinking = thinking;

  await testimonial.save();

  return testimonial;
};
