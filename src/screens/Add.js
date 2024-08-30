import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
const Add = ({navigation}) => {
  return (
    <View style={styles.container}>
       <TouchableOpacity style={[styles.fab,styles.back]} onPress={()=>{ navigation.navigate('Task')}}>
        <Icon name="task-alt" size={45} color="#FFFFFF" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.fab}>
        <Icon name="event" size={45} color="#FFFFFF" onPress={()=>{ navigation.navigate('Task')}} />
      </TouchableOpacity>
    </View>
  )
}

export default Add

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#000000',
    justifyContent:'flex-end' ,
    alignItems:'flex-end',
  },
  back:{
    backgroundColor: '#474545'
  },
  fab: {
    backgroundColor: '#8249ff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin:20,
    padding:10,
    marginBottom:0,

  },

})