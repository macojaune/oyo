import { DarkTheme, DefaultTheme } from "@react-navigation/native"

import { COLORS } from "./colors"

const NAV_THEME = {
  light: {
    ...DefaultTheme,
    colors: COLORS.light,
  },
  dark: {
    ...DarkTheme,
    colors: COLORS.dark
  },
}

export { NAV_THEME }
