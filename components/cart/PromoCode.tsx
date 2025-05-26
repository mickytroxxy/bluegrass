import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import React from 'react';
import { Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

interface PromoCodeProps {
  value: string;
  onChange: (text: string) => void;
  onApply: () => void;
}

export default function PromoCode({ value, onChange, onApply }: PromoCodeProps) {
  return (
    <ThemedView style={styles.promoContainer}>
      <ThemedView style={{flex:1,justifyContent:'center'}}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="Add your promo code"
          style={{flex:1,fontFamily:'AvenirMedium'}}
        />
      </ThemedView>
      <ThemedView style={styles.applyButtonContainer}>
        <TouchableOpacity onPress={onApply}>
          <ThemedText style={{color: value ? Colors.dark.primary : Colors.dark.gray, fontFamily:'AvenirBold'}}>Apply</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  promoContainer: {
    flexDirection:'row',
    borderWidth:1,
    borderColor:Colors.dark.primary,
    borderRadius:80,
    paddingVertical:5,
    paddingHorizontal:10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  applyButtonContainer: {
    justifyContent:'center',
    borderLeftWidth:1,
    borderLeftColor:Colors.dark.primary,
    paddingLeft:10,
    height:40,
  },
}); 