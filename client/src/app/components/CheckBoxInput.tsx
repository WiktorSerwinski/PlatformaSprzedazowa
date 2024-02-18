import { Checkbox, FormControlLabel } from "@mui/material";
import { UseControllerProps, useController } from "react-hook-form";

interface CheckboxInputProps extends Omit<UseControllerProps, "children"> {
  label: string;
}

export default function CheckboxInput(props: CheckboxInputProps) {
  const { field } = useController({ ...props, defaultValue: false });

  return (
    <FormControlLabel
      label={props.label}
      control={
        <Checkbox
          {...field}
          checked={field.value}
          color="secondary"
          disabled={props.disabled}
        />
      }
    />
  );
}
