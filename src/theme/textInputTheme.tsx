import { createTheme, MantineTheme, TextInput, TextInputProps } from "@mantine/core";

import textInputClasses from "./textInputTheme.module.css";

const textInputTheme = createTheme({
  components: {
    TextInput: TextInput.extend({
      defaultProps: {
        size: "md",
      },
      classNames() {
        return {
          root: textInputClasses.root,
          wrapper: textInputClasses.wrapper,
          input: textInputClasses.input,
          section: textInputClasses.section,
          label: textInputClasses.label,
          required: textInputClasses.required,
          description: textInputClasses.description,
          error: textInputClasses.error,
        };
      },
      styles: (_theme: MantineTheme, props: TextInputProps) => {
        const commonStyles = {
          root: {},
          wrapper: {},
          input: {},
          section: {},
          label: {},
          required: {},
          description: {},
          error: {},
        };

        if (props.size === "search") {
          return {
            root: {
              ...commonStyles.root,
              padding: "7px 11px 7px 11px",
              gap: "5px",
              height: "48px",
              minHeight: "48px",
            },
            wrapper: {
              ...commonStyles.wrapper,
              gap: "8px",
              fontSize: "14px",
              minHeight: "32px",
            },
            input: {
              ...commonStyles.input,
              fontSize: "16px",
              height: "20px",
            },
            section: {
              ...commonStyles.section,
              position: "relative",
              width: "24px",
            },
            required: {},
            description: {},
            error: {},
          };
        }

        return {};
      },
    }),
  },
});

export default textInputTheme;
