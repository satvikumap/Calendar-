import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Calendar from './src/screens/Calendar'
import Add from './src/screens/Add'
import Events from './src/screens/Events'
import Task from './src/screens/Task'

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Calendar" component={Calendar} />
        <Stack.Screen name="Add" component={Add} />
        <Stack.Screen name="Task" component={Task} />
        <Stack.Screen name="Events" component={Events} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
