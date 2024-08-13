import { ColorValue, View, StyleSheet, Text } from "react-native";

const Fader = ({value}:{value:number}) => {
  
    return (
    <View style={styles.container}>
        <View style={styles.bar}/>
        <View style={{...styles.needle, left: `${value}%`}}/>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%'
    },
    bar: {
        width: '100%',
        borderWidth: 3,
        height: 0,
        borderRadius: 3
    },
    needle: {
        position: 'absolute',
        height: '100%',
        borderWidth: 3,
        borderColor: 'grey',
        borderRadius: 3
    }
})

export default Fader