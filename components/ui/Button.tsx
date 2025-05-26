import { Colors } from "@/constants/Colors";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import { ThemedText } from "../ThemedText";
import Icon from "./Icon";

export const Button = (
    {
        variant = 'primary',
        label,
        onPress,
        disabled = false,
        styles
    }:
    {
        variant:'primary' | 'secondary',
        label:string, onPress:() => void,
        disabled?:boolean,
        styles?:ViewStyle
    }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={
                [
                    {
                        backgroundColor:variant === 'primary' ? Colors.dark.primary : Colors.light.background,
                        borderColor:variant === 'primary' ? Colors.dark.primary : Colors.dark.primary,
                        borderWidth:1,
                        borderRadius:80,
                        paddingVertical:15,
                        paddingHorizontal:20,
                        marginVertical:10,
                        alignItems:'center'
                    },
                    styles
                ]
            }
        >
            <ThemedText style={{color:variant === 'primary' ? Colors.light.background : Colors.dark.primary}}>{label}</ThemedText>
        </TouchableOpacity>
    );
}

export const AddressButton = (
    {
        address,
        onPress,
        isSelected = false
    }:
    {
        address: string,
        onPress: () => void,
        isSelected?: boolean
    }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: Colors.light.background,
                borderColor: isSelected ? Colors.dark.primary : '#E0E0E0',
                borderWidth: 2,
                borderRadius: 12,
                paddingVertical: 16,
                paddingHorizontal: 16,
                marginVertical: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}
        >
            <View style={{ flex: 1 }}>
                <ThemedText
                    style={{
                        color: Colors.dark.primary,
                        fontSize: 16,
                        fontFamily: 'AvenirMedium'
                    }}
                    numberOfLines={2}
                >
                    {address}
                </ThemedText>
            </View>
            {isSelected && (
                <Icon
                    type="MaterialIcons"
                    name="check-circle"
                    size={24}
                    color={Colors.dark.primary}
                />
            )}
        </TouchableOpacity>
    );
}