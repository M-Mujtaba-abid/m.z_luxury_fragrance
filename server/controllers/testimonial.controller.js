import * as testimonialService from "../services/testimonial.service.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Public: anyone can submit a testimonial - it starts inactive until an admin approves it
export const submitTestimonial = asyncHandler(async (req, res) => {
  const { name, country, rating, gender, thinking } = req.body;

  const testimonial = await testimonialService.createTestimonial({
    name,
    country,
    rating: Number(rating),
    gender,
    thinking,
  });

  res.status(201).json(new ApiResponse(201, testimonial, "Testimonial submitted successfully"));
});

// Public: approved testimonials for the landing page
export const getPublicList = asyncHandler(async (req, res) => {
  const testimonials = await testimonialService.getPublicTestimonials();

  res.status(200).json(new ApiResponse(200, testimonials, "Testimonials fetched successfully"));
});

// Admin-only: every testimonial, active or not
export const getAdminList = asyncHandler(async (req, res) => {
  const testimonials = await testimonialService.getAllTestimonialsForAdmin();

  res.status(200).json(new ApiResponse(200, testimonials, "Testimonials fetched successfully"));
});

// Admin-only: approve or hide a testimonial
export const approveTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  const testimonial = await testimonialService.toggleTestimonialStatus(id, isActive);

  res.status(200).json(new ApiResponse(200, testimonial, "Testimonial status updated successfully"));
});

// Admin-only: edit the submitted content of a testimonial
export const editTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, country, rating, gender, thinking } = req.body;

  const testimonial = await testimonialService.updateTestimonial(id, {
    name,
    country,
    rating: rating !== undefined ? Number(rating) : undefined,
    gender,
    thinking,
  });

  res.status(200).json(new ApiResponse(200, testimonial, "Testimonial updated successfully"));
});

// Admin-only: remove a testimonial permanently
export const deleteTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await testimonialService.deleteTestimonial({ id });

  res.status(200).json(new ApiResponse(200, null, "Testimonial deleted successfully"));
});
