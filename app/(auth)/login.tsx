import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { TextArea } from "@/components/ui/TextArea";
import { Colors } from "@/constants/Colors";
import Metrics from "@/constants/metrics";
import { useAuth } from "@/src/hooks/useAuth";
import { ScrollView } from "react-native";

export default function Login() {
  const {
    handleChange,
    signup, 
    formData,
    rest:cms
  } = useAuth();

  return (
    <ThemedView style={{
      flex:1,
      paddingHorizontal:Metrics.screenPaddingH,
      paddingVertical:Metrics.screenPaddingV
    }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedView>
          <ThemedView style={{alignItems:'flex-end'}}><ThemedText style={{fontSize:14,color:Colors.dark.primary}}>{cms.explore}</ThemedText></ThemedView>
        </ThemedView>
        <ThemedView>
          <ThemedText 
            fontFamily='AGaramondProItalic' 
            style={{
              fontSize:40,
              lineHeight:50,
              color:Colors.dark.primary
            }}
          >
            {cms.welcome}
          </ThemedText>
          <ThemedText 
            style={{
              fontSize:16,
              lineHeight:24,
              color:Colors.dark.primary,
              paddingRight:'30%'
            }}
          >
            {cms.welcomeSub}
          </ThemedText>
        </ThemedView>
        <ThemedView style={{marginVertical:10,marginBottom:10}}><Divider/></ThemedView>
        {formData.map((item) => (
          <TextArea
            key={item.name}
            label={item.label}
            placeholder={item.label}
            keyboardType= {item.type === "email" ? "email-address" : item.type === "number" ? "numeric" : "default"}
            value={item.value}
            secureTextEntry={item.type === "password"}
            onChangeText={(text) => handleChange(item.name, text)}
            error={item.error}
          />
        ))}
        <ThemedView style={{gap:5}}>
          <Button variant="primary" label={cms.register} onPress={() => signup()} />
          <ThemedText style={{color:Colors.dark.gray,fontSize:14,marginVertical:10,textAlign:'center'}}>
            {cms.loginSub} 
            <ThemedText style={{color:Colors.dark.primary,fontSize:14, fontWeight:800}}> {cms.loginSubAction}</ThemedText>
          </ThemedText>
          <ThemedText style={{color:Colors.dark.gray,fontSize:14,marginVertical:10,textAlign:'center'}}>
            ______________________ Or ____________________
          </ThemedText>
          <Button variant="primary" label={cms.explore} onPress={() => {}} />
          
          <ThemedText style={{color:Colors.dark.gray,fontSize:14,marginVertical:10,textAlign:'center'}}>
            {cms.registerSub} <ThemedText style={{color:Colors.dark.primary,fontSize:14, fontWeight:800}}> {cms.Terms}</ThemedText>, <ThemedText style={{color:Colors.dark.primary,fontSize:14, fontWeight:800}}> {cms.DataPolicy}</ThemedText> and <ThemedText style={{color:Colors.dark.primary,fontSize:14, fontWeight:800}}> {cms.CookiesPolicy}</ThemedText>.
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}
