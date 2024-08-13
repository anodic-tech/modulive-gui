import { ColorValue, View, StyleSheet, Text } from "react-native";

const Encoder = ({bgColor,text,value}:{bgColor:ColorValue,text:string,value:string}) => {
  
    return (
        <View style={{
            ...styles.encoder,
            backgroundColor: bgColor,
        }}>
            <Text style={styles.encoderText}>{text}</Text>
            <Text style={styles.encoderText}>{value}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    encoder: {
        // height: 100,
        borderWidth: 1,
        borderColor: 'black',
        borderStyle: 'solid',
        width: '50%',
        backgroundColor: "rgb(50,50,50)"
      },
      encoderText: {
        zIndex: 1,
        paddingBottom: 10
      }
})

export default Encoder