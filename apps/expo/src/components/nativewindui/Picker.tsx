import { View } from "react-native"
import { Picker as RNPicker } from "@react-native-picker/picker"

import { cn } from "@oyo/ui"

import { useColorScheme } from "~/lib/useColorScheme"

export function Picker<T>({
  mode = "dropdown",
  style,
  dropdownIconColor,
  dropdownIconRippleColor,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof RNPicker<T>>) {
  const { colors } = useColorScheme()
  return (
    <View
      className={cn(
        "ios:shadow-sm ios:shadow-black/5 android:border android:border-foreground bg-background",
        className,
      )}
    >
      <RNPicker
        mode={mode}
        style={
          style ?? {
            backgroundColor: colors.background,
            borderRadius: 10,
            color: colors.foreground,
          }
        }
        dropdownIconColor={dropdownIconColor ?? colors.foreground}
        dropdownIconRippleColor={dropdownIconRippleColor ?? colors.foreground}
        {...props}
      />
    </View>
  )
}

export const PickerItem = RNPicker.Item
