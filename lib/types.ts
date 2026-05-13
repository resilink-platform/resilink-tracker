export interface EnrollmentRow {
  id: number;
  state: string;
  head_name: string;
  abbr: string;
  target: number;
  enrolled: number;
  dnb_enrolled: number;
  dnb_target: number;
  mdms_enrolled: number;
  mdms_target: number;
  non_clinical_enrolled: number;
  non_clinical_target: number;
  updated_at: string;
}