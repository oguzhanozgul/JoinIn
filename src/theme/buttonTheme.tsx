import { Button, createTheme } from "@mantine/core";

import buttonClasses from "./buttonTheme.module.css";

const buttonTheme = createTheme({
  components: {
    Button: Button.extend({
      defaultProps: {
        size: "md",
        variant: "default",
        loaderProps: {
          type: "dots",
        },
      },
      classNames(_theme, props) {
        if (props?.variant === "default" || !props.variant) {
          return {
            root: buttonClasses.defaultRoot,
          };
        }
        return {};
      },
      styles: () => {
        const commonStyles = {
          root: {
            height: "48px",
            borderRadius: "12px",
            paddingLeft: "12px",
            paddingRight: "12px",
          },
          label: {
            fontSize: "14px",
            fontWeight: 400,
          },
        };

        return commonStyles;
      },
    }),
  },
});

export default buttonTheme;
