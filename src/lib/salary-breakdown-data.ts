// Salary breakdown — composition of an employee's gross salary into
// taxable/non-taxable components. Used as the default structure applied
// to all payroll runs unless overridden by pay grade.

export interface SalaryComponent {
  id: string;
  name: string;
  percentage: number;
  isMandatory?: boolean;
}

export const DEFAULT_SALARY_COMPONENTS: SalaryComponent[] = [
  { id: "basic", name: "Basic salary", percentage: 50, isMandatory: true },
  { id: "housing", name: "Housing allowance", percentage: 20 },
  { id: "transport", name: "Transport allowance", percentage: 15 },
  { id: "other", name: "Other allowances", percentage: 15 },
];
