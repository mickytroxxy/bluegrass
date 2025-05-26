import { Colors } from "@/constants/Colors";
import { ThemedView } from "../ThemedView";

export const Divider = ({height = 15}:{height?:number}) => {
    return (
        <ThemedView style={{height, backgroundColor:Colors.dark.primary}} />
    );
}