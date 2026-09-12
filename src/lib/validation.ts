import { z } from "zod";

export const LeadFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters / Họ tên tối thiểu 2 ký tự" }),
  company: z.string().optional(),
  email: z.string().email({ message: "Invalid email address / Email không hợp lệ" }),
  phone: z.string().min(8, { message: "Valid phone number required / Số điện thoại tối thiểu 8 số" }),
  service: z.string().min(1, { message: "Please select a service / Vui lòng chọn dịch vụ" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters / Nội dung tối thiểu 10 ký tự" }),
});

export type LeadFormData = z.infer<typeof LeadFormSchema>;

export const OnboardingSchema = z.object({
  // Step 1
  companyName: z.string().min(2, { message: "Company name is required" }),
  teamSize: z.string().min(1, { message: "Please select team size" }),
  disciplines: z.array(z.string()).min(1, { message: "Select at least one discipline" }),
  
  // Step 2
  painPoints: z.array(z.string()).min(1, { message: "Select at least one pain point" }),
  primaryGoal: z.string().min(1, { message: "Select your primary goal" }),

  // Step 3
  projectScale: z.string().min(1, { message: "Select project scale" }),
  targetTimeline: z.string().min(1, { message: "Select target timeline" }),
  inputFormats: z.array(z.string()).min(1, { message: "Select input drawing formats" }),

  // Step 4
  contactName: z.string().min(2, { message: "Contact name is required" }),
  workEmail: z.string().email({ message: "Valid work email is required" }),
  phone: z.string().min(8, { message: "Valid phone number is required" }),
  consultationSlot: z.string().min(1, { message: "Please select a preferred time" }),
});

export type OnboardingData = z.infer<typeof OnboardingSchema>;
