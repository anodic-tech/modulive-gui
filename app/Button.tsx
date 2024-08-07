import { useRef, useEffect } from "react";
import { ColorValue, Animated, View, StyleSheet, Text, Easing } from "react-native";

type AnimationType = 'NONE'|'DIM'|'BRIGHT'|'FLASHING'

const Button = ({bgColor,text,animationType}:{bgColor:ColorValue,text:string,animationType:AnimationType}) => {

  const getBackground = () => {
    if (animationType === 'BRIGHT'){
      return <AnimatedBackground from={0.2} to={0} duration={1600}/>
    }else if (animationType === 'FLASHING'){
      return <AnimatedBackground from={0.5} to={0.2} duration={1600}/>
    }
    else return (
      <View
        style={{
          ...styles.buttonBackground,
          opacity: 0.5
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
      {getBackground()}
    </View>
  )
}

const AnimatedBackground = ({from, to, duration}:{from: number, to: number, duration: number}) => {

  const fadeAnim = useRef(new Animated.Value(0)).current; 

  useEffect(() => {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration,
            useNativeDriver: true,
            easing: Easing.linear
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
            easing: Easing.linear
          }),
        ]),
      )
      animation.start();
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
    height: 100,
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid',
    width: '25%',
    backgroundColor: "rgb(50,50,50)"
  },
  buttonDisplay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%'
  },
  buttonText: {
    zIndex: 1,
    paddingBottom: 10
  },
  buttonBackground: {
    position: 'absolute',
    zIndex: 0,
    height: '100%',
    width: '100%',
    backgroundColor: 'black'
  }
})

export default Button