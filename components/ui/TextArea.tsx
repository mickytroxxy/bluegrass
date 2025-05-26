import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { Animated, KeyboardTypeOptions, StyleSheet, Text, TextInput, TextInputProps, TextStyle, TouchableOpacity, View } from "react-native";
import { ThemedView } from "../ThemedView";
import Icon from "./Icon";

export type TextAreaProps = {
    value?: string | number;
    onChangeText?: (text: string) => void;
    placeholder?: string;
    label?: string;
    keyboardType?: KeyboardTypeOptions;
    icon?: {
        type: string;
        name: string;
        color?: string;
        size?: number;
    };
    secureTextEntry?: boolean;
    error?: string;
    style?: any;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'secureTextEntry'>;

export const TextArea = ({
    value: externalValue,
    onChangeText,
    placeholder,
    label,
    icon,
    secureTextEntry,
    error,
    style,
    keyboardType,
    ...restProps
}: TextAreaProps) => {
    const [value, setValue] = useState<string | number | undefined>(externalValue);
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const labelAnim = useState(new Animated.Value(externalValue ? 1 : 0))[0];

    // Determine if input should be secure
    const isSecure = secureTextEntry;
    const actualSecureTextEntry = isSecure && !showPassword;

    useEffect(() => {
        setValue(externalValue);
        Animated.timing(labelAnim, {
            toValue: externalValue ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [externalValue]);

    const handleFocus = () => {
        setIsFocused(true);
        Animated.timing(labelAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const handleBlur = () => {
        setIsFocused(false);
        if (!value || value === '') {
            Animated.timing(labelAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }).start();
        }
    };

    const handleChangeText = (text: string) => {
        setValue(text);
        if (onChangeText) {
            onChangeText(text);
        }

        // Handle label animation based on text content
        if (text.length > 0) {
            Animated.timing(labelAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false,
            }).start();
        } else if (!isFocused) {
            Animated.timing(labelAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }).start();
        }
    };

    const handleClear = () => {
        setValue("");
        if (onChangeText) {
            onChangeText("");
        }
    };

    const labelStyle = {
        position: 'absolute' as const,
        fontFamily:'AvenirMedium',
        left: icon ? 35 : 10,
        top: labelAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 2],
        }),
        fontSize: labelAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 12],
        }),
        color: labelAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['#aaa', '#888'],
        }),
    } as Animated.AnimatedProps<TextStyle>;

    return (
        <View style={styles.container}>
            <ThemedView
                style={[
                    styles.inputContainer,
                    {
                        borderColor: error ? 'tomato' : isFocused ? Colors.dark.primary : 'gray',
                    },
                    style
                ]}
            >
                {icon && (
                    <View style={styles.iconContainer}>
                        <Icon
                            type={icon.type}
                            name={icon.name}
                            size={icon.size || 20}
                            color={icon.color || '#555'}
                        />
                    </View>
                )}

                <View style={styles.inputWrapper}>
                    {label && (
                        <Animated.Text style={labelStyle}>
                            {label}
                        </Animated.Text>
                    )}

                    <TextInput
                        style={[
                            styles.input,
                            { paddingLeft: icon ? 5 : 10, fontFamily:'AGaramondProItalic' }
                        ]}
                        value={typeof value === 'string' ? value : value?.toString()}
                        onChangeText={handleChangeText}
                        placeholder={isFocused && (!label || value) ? placeholder : ""}
                        placeholderTextColor="#aaa"
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        secureTextEntry={actualSecureTextEntry}
                        keyboardType={keyboardType}
                        {...restProps}
                    />
                </View>

                <View style={styles.actionsContainer}>
                    {isSecure && (
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Icon
                                type="Feather"
                                name={showPassword ? "eye-off" : "eye"}
                                size={20}
                                color="#555"
                            />
                        </TouchableOpacity>
                    )}

                    {value && !isSecure && (
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={handleClear}
                        >
                            <Icon
                                type="Feather"
                                name="x"
                                size={20}
                                color="#555"
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </ThemedView>

            {error && (
                <Text style={styles.errorText}>{error}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        height: 56,
        paddingVertical: 4,
    },
    iconContainer: {
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputWrapper: {
        flex: 1,
        justifyContent: 'center',
        position: 'relative',
    },
    input: {
        paddingHorizontal: 10,
        paddingTop: 20,
        paddingBottom: 8,
        fontSize: 18,
        color: Colors.dark.primary,
        height: '100%',
        textAlignVertical: 'center',
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 4,
    },
    iconButton: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'tomato',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 10,
    },
});