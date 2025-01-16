import { Platform } from "react-native"

const IOS_SYSTEM_COLORS = {
  white: "rgb(255, 255, 255)",
  black: "rgb(0, 0, 0)",
  light: {
    grey6: "rgb(242, 242, 247)",
    grey5: "rgb(230, 230, 235)",
    grey4: "rgb(210, 210, 215)",
    grey3: "rgb(199, 199, 204)",
    grey2: "rgb(175, 176, 180)",
    grey: "rgb(142, 142, 147)",
    background: "rgb(239, 232, 221)",
    foreground: "rgb(36, 40, 43)",
    root: "rgb(255, 255, 255)",
    card: "rgb(255, 255, 255)",
    destructive: "rgb(223, 56, 33)",
    primary: "rgb(94, 23, 235)",
  },
  dark: {
    grey6: "rgb(21, 21, 24)",
    grey5: "rgb(40, 40, 42)",
    grey4: "rgb(55, 55, 57)",
    grey3: "rgb(70, 70, 73)",
    grey2: "rgb(99, 99, 102)",
    grey: "rgb(142, 142, 147)",
    background: "rgb(36, 40, 43)",
    foreground: "rgb(239, 232, 221)",
    root: "rgb(0, 0, 0)",
    card: "rgb(21, 21, 24)",
    destructive: "rgb(254, 67, 54)",
    primary: "rgb(3, 133, 255)",
  },
} as const

const ANDROID_COLORS = {
  white: "rgb(255, 255, 255)",
  black: "rgb(0, 0, 0)",
  light: {
    grey6: "rgb(242, 242, 247)",
    grey5: "rgb(230, 230, 235)",
    grey4: "rgb(210, 210, 215)",
    grey3: "rgb(199, 199, 204)",
    grey2: "rgb(175, 176, 180)",
    grey: "rgb(142, 142, 147)",
    background: "rgb(239, 232, 221)",
    foreground: "rgb(36, 40, 43)",
    root: "rgb(255, 255, 255)",
    card: "rgb(255, 255, 255)",
    destructive: "rgb(223, 56, 33)",
    primary: "rgb(94, 23, 235)",
  },
  dark: {
    grey6: "rgb(21, 21, 24)",
    grey5: "rgb(40, 40, 42)",
    grey4: "rgb(55, 55, 57)",
    grey3: "rgb(70, 70, 73)",
    grey2: "rgb(99, 99, 102)",
    grey: "rgb(142, 142, 147)",
    background: "rgb(36, 40, 43)",
    foreground: "rgb(239, 232, 221)",
    root: "rgb(0, 0, 0)",
    card: "rgb(21, 21, 24)",
    destructive: "rgb(254, 67, 54)",
    primary: "rgb(3, 133, 255)",
  },
} as const

const COLORS = Platform.OS === "ios" ? IOS_SYSTEM_COLORS : ANDROID_COLORS

export { COLORS }
