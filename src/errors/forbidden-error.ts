import { ApplicationError } from "@/protocols";

export function forbiddenError(): ApplicationError {
  return {
    name: "ForbiddenError",
    message: "You don't have authorization to view this page",
  };
}
