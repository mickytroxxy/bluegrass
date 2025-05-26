import { useAuth } from "@/src/hooks/useAuth";
import Login from "./(auth)/login";
import HomeScreen from "./(tabs)/index";


export default function Index() {
  const { accountInfo } = useAuth();
  if (!accountInfo) {
    return <Login />;
  }
  return <HomeScreen />;
}
