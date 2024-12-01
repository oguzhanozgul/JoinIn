import { createTheme, Menu } from "@mantine/core";

import menuClasses from "./menuTheme.module.css";

const menuTheme = createTheme({
  components: {
    Menu: Menu.extend({
      defaultProps: {
        position: "bottom-end",
      },
      classNames() {
        return {
          dropdown: menuClasses.dropdown,
          arrow: menuClasses.arrow,
          divider: menuClasses.divider,
          label: menuClasses.label,
          item: menuClasses.item,
          itemLabel: menuClasses.itemLabel,
          itemSection: menuClasses.itemSection,
        };
      },
    }),
  },
});

export default menuTheme;
