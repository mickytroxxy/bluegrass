import { Colors } from "@/constants/Colors";
import { TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";

export const Button = (
    {
        variant = 'primary',
        label,
        onPress,
        disabled = false
    }:
    {
        variant:'primary' | 'secondary', 
        label:string, onPress:() => void, 
        disabled?:boolean
    }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={{
                backgroundColor:variant === 'primary' ? Colors.dark.primary : Colors.light.background,
                borderColor:variant === 'primary' ? Colors.dark.primary : Colors.dark.primary,
                borderWidth:1,
                borderRadius:80,
                paddingVertical:15,
                paddingHorizontal:20,
                marginVertical:10,
                alignItems:'center'
            }}
        >
            <ThemedText style={{color:variant === 'primary' ? Colors.light.background : Colors.dark.primary}}>{label}</ThemedText>
        </TouchableOpacity>
    );
}