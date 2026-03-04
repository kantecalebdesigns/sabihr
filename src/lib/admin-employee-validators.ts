import type { ValidationErrors } from "@/lib/validators";
import type {
  WorkLocationFormData,
  PayGradeFormData,
  ProbationFormData,
  ContractFormData,
} from "@/types/admin-employee";

export function validateWorkLocation(
  _data: WorkLocationFormData
): ValidationErrors<WorkLocationFormData> {
  return {};
}

export function validatePayGrade(
  _data: PayGradeFormData
): ValidationErrors<PayGradeFormData> {
  return {};
}

export function validateProbation(
  _data: ProbationFormData
): ValidationErrors<ProbationFormData> {
  return {};
}

export function validateContract(
  _data: ContractFormData
): ValidationErrors<ContractFormData> {
  return {};
}
