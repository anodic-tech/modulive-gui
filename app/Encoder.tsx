import { memo } from "react";
import { ColorValue, View, StyleSheet, Text } from "react-native";

const Encoder = ({bgColor,text,value}:{bgColor:ColorValue,text:string,value:string}) => {
  
    return (
        <View style={{
            ...styles.encoder,
            backgroundColor: bgColor,
        }}>
            <Text style={styles.encoderText}>{text.replace('_',' ')}</Text>
            {value !== "" && <Text style={{...styles.encoderText, ...styles.encoderValue}}>{Math.round(parseFloat(value))}</Text>}
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
        backgroundColor: "rgb(50,50,50)",
        display: 'flex',
        justifyContent: 'center'
      },
      encoderText: {
        zIndex: 1,
        paddingBottom: 10,
        textAlign: 'center',
        fontWeight: '600'
      },
      encoderValue: {
        fontSize: 20
      }

})

export default memo(Encoder)