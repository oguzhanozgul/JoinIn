import { mergeThemeOverrides } from "@mantine/core";

import buttonTheme from "./buttonTheme";
import menuTheme from "./menuTheme";
import textInputTheme from "./textInputTheme";
import typographyTheme from "./typographyTheme";

const commonThemeProperties = mergeThemeOverrides(buttonTheme, menuTheme, textInputTheme, typographyTheme);

export const joinInTheme = mergeThemeOverrides(commonThemeProperties);
