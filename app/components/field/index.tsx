import { Box } from "@operonstudio/ui";
import type { ReactNode } from "react";
import * as classes from "./style";

interface FieldProps {
  label: ReactNode;
  /**
   * The id of the control this labels. Set it when the control is a real form
   * element, so clicking the label focuses it.
   */
  htmlFor?: string;
  /**
   * Use instead of `htmlFor` when the control is not a form element — a
   * dropdown button, say. Point the control at this id with `aria-labelledby`.
   */
  id?: string;
  required?: boolean;
  hint?: ReactNode;
  children: ReactNode;
}

/**
 * A labelled form row.
 *
 * Every modal in Compose was repeating the same inline-styled `<label>`, and
 * most of them were not attached to their control, so screen readers announced
 * an unlabelled input and clicking the text did nothing.
 */
export const Field = ({
  label,
  htmlFor,
  id,
  required,
  hint,
  children,
}: FieldProps) => (
  <Box>
    {htmlFor ? (
      <label htmlFor={htmlFor} {...classes.labelStyle}>
        {label}
        {required && <span {...classes.requiredStyle}>*</span>}
      </label>
    ) : (
      <Box id={id} {...classes.labelStyle}>
        {label}
        {required && <span {...classes.requiredStyle}>*</span>}
      </Box>
    )}
    {children}
    {hint && <Box {...classes.hintStyle}>{hint}</Box>}
  </Box>
);
