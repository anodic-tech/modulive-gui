import { colorIndexMap } from "@/constants/Colors"
import { View, StyleSheet, Text } from "react-native"
import Button from "./Button"

const ModuleDisplay = ({modules, activeModule, name}:{modules:Module[], activeModule:ActiveModule|'None', name: string}) => {

    const NUM_BUTTONS = 8
    const buttons = []
    for(let i=0; i<NUM_BUTTONS; i++){

      if(activeModule != 'None' && activeModule.sections[i] != 'None'){
        const section = activeModule.sections[i] as Section
        buttons.push(<Button 
          key={name+i}
          text={section.name}
          bgColor={colorIndexMap[section.color_index]}
          animationType={section.is_playing ? 'BRIGHT' : section.is_triggered ? 'FLASHING' : 'DIM'}
        />)
      } 
      
      else if(activeModule === 'None' && modules[i]){
        const module = modules[i]
        buttons.push(<Button 
          key={name+i}
          text={module.name}
          bgColor={colorIndexMap[module.color_index]}
          animationType={'BRIGHT'}
        />)
      }

      else{
        buttons.push(<Button 
          key={name+i}
          text={""}
          bgColor={"transparent"}
          animationType={"NONE"}  
        />)
      }
      
    }
  
    return (
      <View
        style={{
          borderColor: activeModule!='None' ? colorIndexMap[activeModule.color_index] : 'rgb(30,30,30)',
          borderWidth: 2
        }}
      >
        <Text style={styles.moduleDisplayHeader}> {name}: {activeModule!='None' ? activeModule.name : 'Select a Module'}</Text>
        <View style={styles.moduleDisplayContainer}>
          {buttons.map(b=>b)}
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  moduleDisplayContainer: {
    width: 400,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  moduleDisplayHeader: {
    color: "rgb(200,200,200)",
    fontSize: 20
  }
})

export default ModuleDisplay