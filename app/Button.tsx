import { useRef, useEffect, memo } from "react";
import { ColorValue, Animated, View, StyleSheet, Text, Easing } from "react-native";

type AnimationType = 'NONE'|'DIM'|'BRIGHT'|'FLASHING'

type ButtonProps = {
  bgColor:ColorValue,
  text:string,
  animationType:AnimationType,
  value?:number|string|null
}

const Button = ({bgColor,text,animationType,value}:ButtonProps) => {

  console.log('rerender')

  const getBackground = () => {
    if (animationType === 'BRIGHT'){
      return       <View
      style={{
        ...styles.buttonBackground,
        opacity: 0
    }}/>
    }else if (animationType === 'FLASHING'){
      return <AnimatedBackground from={0.5} to={0} duration={1600}/>
    } else if (animationType === 'DIM'){
      return <View
      style={{
        ...styles.buttonBackground,
        opacity: 0.5
    }}/>
    }
    else return (
      <View
        style={{
          ...styles.buttonBackground,
          opacity: 0
      }}/>
    )
  }

  return (
    <View style={{
        ...styles.button,
        backgroundColor: bgColor,
      }}>
      <Text
        style={styles.buttonText}
      >{text}</Text>
      {value != null && <Text style={styles.buttonText}>{value}</Text>}
      {getBackground()}
    </View>
  )
}

const AnimatedBackground = ({from, to, duration}:{from: number, to: number, duration: number}) => {

  const fadeAnim = useRef(new Animated.Value(1)).current; 

  useEffect(() => {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration,
            useNativeDriver: true
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration,
            useNativeDriver: true
          }),
        ]),
      )
      animation.start();
      return () => {
        animation.reset();
      }
  }, [])

  const interpolated = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [from, to]
  });

  return (
    <Animated.View
      style={{
        ...styles.buttonBackground,
        opacity: interpolated
    }}/>
  )

}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid',
    width: '25%',
    minHeight: '50%',
    backgroundColor: "rgb(50,50,50)",
    display: 'flex',
    justifyContent: 'center'
  },
  buttonText: {
    zIndex: 1,
    paddingBottom: 10,
    textAlign: 'center',
    fontWeight: '600'
  },
  buttonBackground: {
    position: 'absolute',
    zIndex: 0,
    height: '100%',
    width: '100%',
    backgroundColor: 'black'
  }
})

export default memo(Button)